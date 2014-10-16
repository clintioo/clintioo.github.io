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

            function getYouTubeFeed () {
                if (settings.url && settings.key) {
                    $.ajax({
                        url: settings.url,
                        data: {
                            key: settings.key
                        },
                        dataType: 'jsonp',
                    }).done(function (response) {
                        embedYouTubeVideo(response);

                        return response;
                    });
                }
            }

            function embedYouTubeVideo (response, limit) {
                var results = response.items,
                    resultsLen = limit || results.length,
                    resultsStr = '<h3>YouTube</h3>';

                for (var i = 0; i < resultsLen; i++) {
                    resultsStr += '<h1><a href="https://www.youtube.com/watch?v=' + results[i].snippet.resourceId.videoId + '">' + results[i].snippet.title + '</a></h1>';
                    resultsStr += '<p>' + results[i].snippet.description + '</p>';
                    resultsStr += '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + results[i].snippet.resourceId.videoId + '" frameborder="0" scrolling="no" allowfullscreen></iframe>';
                }

                return $this.html(resultsStr);
            }

            getYouTubeFeed();

            return {
                getYouTubeFeed: getYouTubeFeed,
                embedYouTubeVideo: embedYouTubeVideo
            }

        });
    };

})(window.jQuery);