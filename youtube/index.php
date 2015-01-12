<html>
<head>
  <title>Test YouTube</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    body {
      font: 62.5% sans-serif;
      background: #000;
      padding: 0;
      margin: 0;
    }

    a {
      text-decoration: none;
    }

    .youtube {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .youtube__overlay {
      position: absolute;
      bottom: 0;
      z-index: 1;
      display: none;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.85);
      cursor: pointer;
    }

    .youtube__overlay:before {
      position: absolute;
      top: 0;
      right: 12px;
      content: 'x';
      color: #fff;
      font-size: 2rem;
    }

    .youtube__overlay--active {
      display: block;
    }

    .youtube__iframe {
      position: absolute;
      top: 40px;
      left: 0;
      right: 0;
      width: 320px;
      height: 180px;
      margin: auto;
    }

    .youtube__cell {
      position: relative;
      float: left;
      width: 100%;
    }

    .youtube__cell a {
      display: block;
      width: 100%;
      height: 100%;
    }

    .youtube__summary {
      position: absolute;
      bottom: 0;
      display: none;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
    }

    .youtube__cell:hover .youtube__summary {
      display: block;
    }

    .youtube__title {
      padding: 15px 20px;
      margin: 0;
      font-weight: normal;
      font-size: 1.4rem;
      color: #fff;
    }

    .youtube__img {
      width: 100%;
      height: auto;
    }

    @media only screen and (min-width: 768px) {
      .youtube__iframe {
        width: 720px;
        height: 405px;
      }

      .youtube__cell {
        width: 33.333333%;
      }
    }
  </style>
</head>
<body>
  <div class="youtube">
    <?php

      function parse_signed_request($signed_request, $secret) {
        list($encoded_sig, $payload) = explode('.', $signed_request, 2); 

        // decode the data
        $sig = base64_url_decode($encoded_sig);
        $data = json_decode(base64_url_decode($payload), true);

        if (strtoupper($data['algorithm']) !== 'HMAC-SHA256') {
            error_log('Unknown algorithm. Expected HMAC-SHA256');
            return null;
        }

        // check sig
        $expected_sig = hash_hmac('sha256', $payload, $secret, $raw = true);
        if ($sig !== $expected_sig) {
            error_log('Bad Signed JSON signature!');
            return null;
        }

        return $data;
      }

      function base64_url_decode($input) {
        return base64_decode(strtr($input, '-_', '+/'));
      }

      $req = $_REQUEST;
      $signed_request = parse_signed_request($req[signed_request], 'b76b75e74863b22ffd73679e5d8a0912');

      $data = implode(",", $signed_request);
      echo $data;
      echo "0 " . $signed_request[0];
      echo "1 " . $signed_request[1];
      echo "2 " . $signed_request[2];
      //$signed_request['app_data'] = MYDATA;

    ?>

    <div class="youtube__overlay"></div>
  </div>
  <script type="text/javascript" src="js/lib/jquery-1.11.1.js"></script>
  <script type="text/javascript" src="js/youtube.js"></script>
  <script type="text/javascript" src="js/app.js"></script>
  <script>
    /**
     *  https://www.facebook.com/dialog/pagetab?app_id=YOUR_APP_ID&next=YOUR_APP_HOSTED_URL
     */

    window.fbAsyncInit = function() {
      FB.init({
        appId      : '361939297298147',
        xfbml      : true,
        version    : 'v2.1'
      });

      FB.Canvas.setSize({
        width: 810,
        height: 2000
      });

      FB.getLoginStatus(function (response) {
        console.log(response);
      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  </script>
</body>
</html>
