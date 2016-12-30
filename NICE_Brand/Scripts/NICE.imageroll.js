
!function ($) {

  "use strict";

  var style = '@media only screen and (min-width: 461px) { \
    html .evidence-hero { \
      background-image: url(https://www.evidence.nhs.uk/content/nice/{{image}}1600.jpg); \
    } \
  } \
  @media \
  only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 768px), \
  only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 768px), \
  only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 768px), \
  only screen and (        min-device-pixel-ratio: 2)      and (min-width: 768px), \
  only screen and (                min-resolution: 192dpi) and (min-width: 768px), \
  only screen and (                min-resolution: 2dppx)  and (min-width: 768px) { \
    /* Medium screen, retina, stuff to override above media query */ \
    html .evidence-hero { \
      background-image: url(https://www.evidence.nhs.uk/content/nice/{{image}}1600.jpg); /* 1600px */ \
    } \
  } \
  @media only screen and (min-width: 1100px) { \
    /* Large screen, non-retina */ \
    html .evidence-hero { \
      background-image: url(https://www.evidence.nhs.uk/content/nice/{{image}}1600.jpg); /* 1600px */ \
    } \
  } \
  @media \
  only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1100px), \
  only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1100px), \
  only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1100px), \
  only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1100px), \
  only screen and (                min-resolution: 192dpi) and (min-width: 1100px), \
  only screen and (                min-resolution: 2dppx)  and (min-width: 1100px) { \
    /* Large screen, retina, stuff to override above media query */ \
    html .evidence-hero { \
      background-image: url(https://www.evidence.nhs.uk/content/nice/{{image}}3000.jpg); /* 3000px */ \
    } \
  } \
  @media only screen and (min-width: 1600px) { \
    /* Large screen, non-retina */ \
    html .evidence-hero { \
      background-image: url(https://www.evidence.nhs.uk/content/nice/{{image}}3000.jpg); /* 3000px */ \
    } \
  }';


 /* IMAGEROLL PUBLIC CLASS DEFINITION
  * ============================== */

  function ImageRoll ( element, options ) {
    this.$element = $(element);
    this.options = options;

    if ( typeof this.options.images === 'string' ) {
      this.options.images = (this.options.images || '').split(',');
    }
    if ( typeof this.options.sizes === 'string' ) {
      this.options.sizes = (this.options.sizes || '').split(',');
    }
  }

  ImageRoll.prototype = {

    roll: function() {
      this.injectStyles();
    },

    injectStyles: function() {
      $('head').append('<style>'+ this.generateStyles() +'</style>');
    },

    generateStyles: function() {
      return style.replace(/{{image}}/ig, this.rollImage() );
    },

    rollImage: function() {
      var max = this.options.images.length - 1;
      var rand = Math.round( Math.random() * max );
      return this.options.images[ rand ];
    }

  };


 /* IMAGEROLL PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.imageroll;

  $.fn.imageroll = function (option) {
      return this.each(function () {
        var $this = $(this)
        , data = $this.data('imageroll')
        , options = $.extend({}, $.fn.imageroll.defaults, $this.data(), options);

        if (!data) $this.data('imageroll', (data = new ImageRoll(this, options)));

        data.roll();
      })
  };

  $.fn.imageroll.defaults = {
  };

  $.fn.imageroll.Constructor = ImageRoll;


 /* IMAGEROLL NO CONFLICT
  * ================== */

  $.fn.imageroll.noConflict = function () {
      $.fn.imageroll = old;

      return this;
  };


 /* IMAGEROLL DATA-API
  * =============== */

  $(function()
  {
    $('[data-rotate="images"]').imageroll();
  });

}(window.jQuery);
