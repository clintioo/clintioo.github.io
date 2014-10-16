/**
 *  YouTube
 */

(function ($) {

  "use strict";

  $.fn.youTube = function (options) {

    var settings = {
        url: '',
        key: 'AIzaSyAiNf5dyMhcgIh8cTrkoitROmDU-nBKAkA'
    };

    if (options) {
      $.extend(settings, options);
    }

    return this.each(function () {
      var $this = $(this);

      function init () {
        getYouTubeFeed();

        $('.youtube').on('click', 'a', function (e) {
          var youTubeId = $(this).attr('href').split('v=')[1];

          e.preventDefault();

          toggleYouTubeOverlay();
          addYouTubeVideo(youTubeId);
        });

        $('.youtube__overlay').on('click', function (e) {
          e.preventDefault();

          toggleYouTubeOverlay();
          removeYouTubeVideo();
        });
      }

      function getYouTubeFeed () {
        if (settings.url && settings.key) {
          $.ajax({
            url: settings.url,
            data: {
              key: settings.key
            },
            dataType: 'jsonp',
            }).done(function (response) {
              addYouTubePlaylist(response);

              return response;
          });
        }
      }

      function addYouTubePlaylist (response, limit) {
        var results = response.items,
        resultsLen = limit || results.length,
        resultsStr = '';

        for (var i = 0; i < resultsLen; i++) {
          resultsStr += '<div class="youtube__cell">';
          resultsStr += '<div class="youtube__summary">';
          resultsStr += '<a href="https://www.youtube.com/watch?v=' + results[i].snippet.resourceId.videoId + '">';
          resultsStr += '<h3 class="youtube__title">' + results[i].snippet.title + '</h3>';
          resultsStr += '</a>';
          resultsStr += '</div>';
          resultsStr += '<img class="youtube__img" src="' + results[i].snippet.thumbnails.medium.url + '">';
          resultsStr += '</div>';
        }

        return $this.append(resultsStr);
      }

      function toggleYouTubeOverlay () {
        return $('.youtube__overlay').toggleClass('youtube__overlay--active');
      }

      function addYouTubeVideo (id) {
        return $('.youtube__overlay').html('<iframe class="youtube__iframe" width="720" height="405" src="https://www.youtube.com/embed/' + id + '?autoplay=1" frameborder="0" scrolling="no" allowfullscreen></iframe>');
      }

      function removeYouTubeVideo (id) {
        return $('.youtube__overlay').html('');
      }

      init();

      return {
        init: init,
        getYouTubeFeed: getYouTubeFeed,
        addYouTubePlaylist: addYouTubePlaylist,
        addYouTubeVideo: addYouTubeVideo,
        removeYouTubeVideo: removeYouTubeVideo
      }
  
    });

  };

})(window.jQuery);