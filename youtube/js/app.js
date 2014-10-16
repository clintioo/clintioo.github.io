var app = function ($) {

  var youTubePlaylistId;

  function init () {
    youTubePlaylistId = getParameterByName('playlistId');

    $('.youtube').youTube({
      url: 'https://www.googleapis.com/youtube/v3/playlistItems?playlistId=' + youTubePlaylistId + '&part=snippet'
    });
  }

  function getParameterByName (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  return {
    init: init,
    getParameterByName: getParameterByName
  };

}(jQuery);

$(function () {
  app.init();
});