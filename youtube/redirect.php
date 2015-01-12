<script>
  (function () {
    var param,
      appData = '';

    function gup (name) {
      name = RegExp ('[?&]' + name.replace (/([[\]])/, '\\$1') + '=([^&#]*)');
      return (window.location.href.match (name) || ['', ''])[1];
    }

    param = gup('app_data');

    if (param) {
      appData = '?app_data=' + param;
    }

    return top.location = 'https://www.facebook.com/pagestestappdigitaslbi/app_361939297298147' + appData;
  })();
</script>