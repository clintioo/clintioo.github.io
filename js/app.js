var app = function ($, window, undefined) {

  var settings = {
      stateCount: 0,
      currentLocationName: '',
      currentLocationId: 0
  };

  History.Adapter.bind(window, 'statechange', function () {
    var State = History.getState();

    getDeals(Number(State.data.id));
  });

  function init () {
    var location;

    // Use query string if exists; otherwise first item in nav list
    if (window.location.search !== '') {
      location = parseQueryStr(window.location.search);
    } else {
      location = parseQueryStr($('.offers nav li:first a').attr('href'));
    }

    addPushState(location.name, location.id);
    getDeals(location.id);

    $('.offers nav').on('click', 'a', function (e) {
      e.preventDefault();

      location = parseQueryStr($(this).attr('href'));

      // Prevent double click on same nav item
      if (location.name !== settings.currentLocationName) {
        addPushState(location.name, location.id);
      }
    });
  }

  function parseQueryStr (queryStr) {
      return {
        id: Number(queryStr.split('id=')[1]),
        name: queryStr.split('location=')[1].replace('%20', ' ').split('&id=')[0]
      };
  }

  function getDeals (id) {
    return $.ajax({
      url: "js/mock.json",
      dataType: "json",
      success: function (result) {
        updateDealsView(id, result);
      }
    });
  }

  function updateDealsView (id, result) {
    for (var i = 0, locationsLen = result.locations.length; i < locationsLen; i++) {
      if (id === result.locations[i].id) {
        var dealStr = '<p><strong>' + result.locations[i].name + ' deals</strong></p>';

        for (var j = 0, dealsLen = result.locations[i].deals.length; j < dealsLen; j++) {
          dealStr += '<div class="offers__deal">';
          dealStr += '<h3>' + result.locations[i].deals[j].title + '</h3>';
          dealStr += '<p class="offers__price">' + result.locations[i].deals[j].price + '</p>';
          dealStr += '<p class="offers__description">' + result.locations[i].deals[j].description + '</p>';
          dealStr += '<p class="offers__departfrom offers__departfrom--title">Depart From</p>';
          dealStr += '<p class="offers__departfrom">' + result.locations[i].deals[j].dates.from + '-' + result.locations[i].deals[j].dates.to + '</p>';
          dealStr += '<p class="offers__lengthstay offers__lengthstay--title">Length of Stay</p>';
          dealStr += '<p class="offers__lengthstay">' + result.locations[i].deals[j].lengthstay.min + '-' + result.locations[i].deals[j].lengthstay.max + '</p>';
          dealStr += '</div>';
        }
        
        // Update active navigation class
        $('.offers nav li').eq(id - 1).addClass('active').siblings('li').removeClass('active');

        return $('.offers__wrap').html(dealStr);
      }
    }
  }

  function addPushState (name, id) {
    settings.stateCount = settings.stateCount + 1;
    settings.currentLocationName = name;
    settings.currentLocationId = id;

    return History.pushState({state: settings.stateCount, id: settings.currentLocationId}, settings.currentLocationName + " | Destination Guide", "?location=" + settings.currentLocationName + '&id=' + settings.currentLocationId);
  }

  return {
    init: init,
    getDeals: getDeals,
    updateDealsView: updateDealsView
  }

}(jQuery, window);

jQuery(function () {
  app.init();
});