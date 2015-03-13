var readability = function ($) {

  var readabilityText,
    readabilityInput = document.getElementById('tester__textarea'),
    $readabilityInput = $(readabilityInput),
    readabilityInputPlaceholderText = $readabilityInput.html(),
    readabilityInputPlaceholderClass = 'tester__textarea--placeholder',
    readabilityHtml = '',
    results = {},
    resultsComplex = {},
    lightboxClass = 'lightbox',
    lightboxHiddenClass = 'lightbox--hidden',
    lightboxWrapClass = 'lightbox__wrap',
    lightboxCloseClass = 'lightbox__close',
    lightboxContentClass = 'help',
    lightboxContentHiddenClass = 'help--hidden',
    $navToggle = $('.header__navtoggle'),
    $nav = $('.header__nav'),
    navHiddenClass = 'header__nav--hidden',
    breakpointSmall = 1023,
    navHeight = 124,
    winWidth,
    regexSpanOpenWord = new RegExp('<span class="tester__complexword">', 'gim'),
    regexSpanOpenSentence = new RegExp('<span class="tester__complexsentence">', 'gim'),
    regexSpan = /<\/?span[^>]*>/g,
    regexUrl = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

  function init () {
    getWindowWidth();
    lightboxInit();

    $navToggle.on('click', function (e) {
      e.preventDefault();
      $nav.toggleClass(navHiddenClass);
    });

    $readabilityInput.on('focus', function (e) {
      if ($readabilityInput.html() === readabilityInputPlaceholderText) {
        $readabilityInput.html('');
      }

      textareaPlaceholder();
    });

    $readabilityInput.on('blur', function (e) {
      if ($readabilityInput.html() === '') {
        $readabilityInput.html(readabilityInputPlaceholderText);
      }

      textareaPlaceholder();
    });

    $readabilityInput.on('keyup', function (e) {
      textareaPlaceholder();
    });

    // Strip HTML from clipboard text
    if (document.addEventListener) {
      document.addEventListener('cut', clipboardStripHtml);
      document.addEventListener('copy', clipboardStripHtml);
      document.addEventListener('paste', textareaStripHtmlStyle);
    }

    $('.tester__submit').on('click', function (e) {
      e.preventDefault();

      getReadabilityText();

      if ($readabilityInput.html() !== readabilityInputPlaceholderText) {
        runTest(readabilityText);
      }
    });

    $(window).resize(function () {
      getWindowWidth();
    });
  }

  function clipboardStripHtml (event) {
    event.preventDefault();

    var str = getSelectionHtml(),
      $el = $('<div />').html(str);

    $.each($el.find('a'), function (i, v) {
      $(v).replaceWith($(v).text() + ' (' + $(v).attr('href') + ')');
    });

    $.each($el.find('li'), function (i, v) {
      $(v).replaceWith('&bull; ' + $(v).text() + '\n');
    });

    $.each($el.find('p, br, h1, h2, h3, h4, h5, h6'), function (i, v) {
      $(v).replaceWith($(v).text() + '\n\n');
    });

    (event.clipboardData || window.clipboardData).setData('Text', $el.text());

    if (event.type === 'cut') {
      replaceSelectedText('');
    }
  }

  function textareaStripHtmlStyle () {
    setTimeout(function () {
      var tmpHtml = $readabilityInput.html().replace(/\bstyle=(['"])(.*?)\1/gi, '');

      return $readabilityInput.html(tmpHtml);
    }, 0);
  }

  function textareaStripHtmlSpan ($el) {
    return readabilityHtml = $el.html().replace(regexSpan, '');
  }

  function textareaPlaceholder () {
    if ($readabilityInput.text() === '' || $readabilityInput.text() === readabilityInputPlaceholderText) {
      return $readabilityInput.addClass(readabilityInputPlaceholderClass);
    } else {
      return $readabilityInput.removeClass(readabilityInputPlaceholderClass);
    }
  }

  function getSelectionHtml () {
    var html = '';

    if (typeof window.getSelection != 'undefined') {
      var sel = window.getSelection();

      if (sel.rangeCount) {
        var container = document.createElement('div');
        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      }
    } else if (typeof document.selection != 'undefined') {
      if (document.selection.type == 'Text') {
        html = document.selection.createRange().htmlText;
      }
    }

    return html;
  }

  function replaceSelectedText (replacementText) {
    var sel,
      range;

    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.text = replacementText;
    }
  }

  function getWindowWidth () {
    return winWidth = $(window).width();
  }

  function getReadabilityText () {
    return readabilityText = $readabilityInput.text();
  }

  function runTest (readabilityText) {
    results.sentenceCount = textstatistics().sentenceCount(readabilityText);
    results.sentences = textstatistics().sentences(readabilityText);

    results.fleschKincaid = Math.round(textstatistics().fleschKincaidGradeLevel(readabilityText));
    results.fleschReading = Math.round(textstatistics().fleschKincaidReadingEase(readabilityText));

    /**
     *  Adjust for min/max values:
     *  Flesh Kincaid Grade Level   4 - 12
     *  Flesch Reading Ease         0 - 100
     */
    if (results.fleschKincaid < 4) {
      results.fleschKincaid = 4;
    } else if (results.fleschKincaid > 12) {
      results.fleschKincaid = 12;
    }

    if (results.fleschReading < 0) {
      results.fleschReading = 0;
    } else if (results.fleschReading > 100) {
      results.fleschReading = 100;
    }

    if (results.fleschReading <= 30) {
      results.fleschReadingScoreClass = 'score__result--red';
      results.fleschReadingScoreText = 'Red';
      results.fleschReadingScoreSummary = 'Way too complicated';
    } else if (results.fleschReading > 30 && results.fleschReading < 65) {
      results.fleschReadingScoreClass = 'score__result--yellow';
      results.fleschReadingScoreText = 'Yellow';
      results.fleschReadingScoreSummary = 'Some work to be done';
    } else {
      results.fleschReadingScoreClass = 'score__result--green';
      results.fleschReadingScoreText = 'Green';
      results.fleschReadingScoreSummary = 'Good to go';
    }

    results.fleschReadingRangePerc = results.fleschReading * .9;

    resultsComplex = textstatistics().wordsWithThreeSyllables(readabilityText);
    results.complexWordCount = resultsComplex.longWordCount;
    results.complexWords = resultsComplex.longWords;

    showResults(results);

    return results;
  }

  function showResults (results) {
    var source = $('#score__template').html(),
        template = Handlebars.compile(source);

    // Complex words
    textareaStripHtmlSpan($readabilityInput);
    highlightComplexWords(readabilityHtml, results.complexWords, results.sentences);

    // Results table
    $('.score__results').html(template(results));

    // Update open graph
    var yammerShareBtn = document.getElementById('yj-share-button');

    yammerShareBtn.onclick = function () {
      var link = 'https://www.yammer.com/aia.com/messages/new?status=I scored ' + results.fleschReading + '/100 using the AIA Read Easy Tool ' + window.location.href;

      window.open(link, 'sharer', 'toolbar=0,status=0,resizeable=1,width=650,height=550');
    }

    // Show score module
    $('.score').removeClass('score--hidden');

    if (winWidth < breakpointSmall) {
      $('html, body').animate({
        scrollTop: $('.score').offset().top
      }, 500);
    }
  }

  function showError (err) {
    return $('.score__results').html(err);
  }

  function highlightComplexWords (readabilityHtml, complexWords, sentences) {
    var complexWords = complexWords,
      urls = readabilityHtml.match(regexUrl, '');

    // Remove complex words from URL's
    if (urls) {
      $.each(complexWords, function (i, v) {
        $.each(urls, function (j, v) {
          if (urls[j].indexOf(complexWords[i]) !== -1) {
            complexWords.splice(i, 1);
          }
        });
      });
    }

    // Highlight complex words and sentences
    $.each(complexWords, function (i, v) {
      var cwWordRegex = new RegExp(complexWords[i], 'gim');

      $.each(sentences, function (j, v) {
        var cwSentenceRegex = new RegExp(sentences[j], 'gim');

        // If complex words exists in sentence
        if (sentences[j].indexOf(complexWords[i]) !== -1) {
          // Add new sentence highlights
          readabilityHtml = readabilityHtml.replace(cwSentenceRegex, '<span class="tester__complexsentence">' + sentences[j] + '</span>');
        }
      });

      // Add new word highlights
      readabilityHtml = readabilityHtml.replace(cwWordRegex, '<span class="tester__complexword">' + complexWords[i] + '</span>');
    });

    return $readabilityInput.html(readabilityHtml);
  }

  /**
   *  Lightbox
   */

  function lightboxInit () {
    $('[rel="lightbox"]').click(function (e) {
      e.preventDefault();
      lightboxShow(e);
    });

    $('.' + lightboxCloseClass).click(function (e) {
      lightboxHide();
    });

    $(document).keydown(function (e) {
      // ESC key
      if (e.keyCode === 27) {
        lightboxHide();
      }
    });
  }

  function lightboxShow (e) {
    var positionTop = $(document).scrollTop() + navHeight,
      $this = $(e.target);

    $nav.addClass(navHiddenClass);

    return $('.' + lightboxClass)
      .removeClass(lightboxHiddenClass)
      .find('.' + lightboxContentClass)
      .addClass(lightboxContentHiddenClass)
      .filter($this.attr('href'))
      .removeClass(lightboxContentHiddenClass);
  }

  function lightboxHide () {
    $nav.addClass(navHiddenClass);

    return $('.' + lightboxClass).addClass(lightboxHiddenClass);
  }

  return {
    init: init,
    runTest: runTest,
    showResults: showResults,
    showError: showError,
    highlightComplexWords: highlightComplexWords,
    lightboxInit: lightboxInit,
    lightboxShow: lightboxShow,
    lightboxHide: lightboxHide
  };

}(jQuery);

$(document).ready(function () {
  readability.init();
});