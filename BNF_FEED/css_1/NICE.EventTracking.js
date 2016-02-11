
/* Google event tracking interface */

/*jshint -W030 */
!(function ( $, undefined ) {

    'use strict';


 /* TRACK EVENT PUBLIC CLASS DEFINITION
  * =================================== */

    var EventTracker = function ( element, options ) {
        this.$element = $(element);
        this.options = options;

        this.$trackingElement = this.$element;
        if (!this.$trackingElement.is('[data-track]')) {
            var first = this.$trackingElement.parents('[data-track]').first();

            this.$trackingElement = first;
        }
    };

    // private methods




    // Tracking helpers

    function sendTrackedEvent( category, action, label, value, cb ) {
        if (cb) window.setTimeout( cb, 50 );

        if ( window.dataLayer && typeof window.dataLayer.push === 'function' ) {
            return sendDataLayerEvent( category, action, label, value, cb );
        }

        if ( window._gaq && typeof window._gaq.push === 'function' ) {
            return sendGAEvent( category, action, label, value, cb );
        }

        if ( typeof window.ga === 'function' ) {
            return sendUAEvent( category, action, label, value, cb );
        }

        logEventToConsole( category, action, label );
    }

    function sendDataLayerEvent( category, action, label, value ) {
      var data = {
        event: 'GAevent',
        eventCategory: category,
        eventAction: action,
        eventLabel: label
      };

      if ( value ) {
        data.eventValue = value;
      }

      window.dataLayer.push( data );
    }

    function sendGAEvent( category, action, label, value ) {
        var data = [ '_trackEvent', category, action, label ];

        if (value) {
            data.push( value );
        }

        window._gaq.push( data );
    }

    function sendUAEvent( category, action, label, value ) {
        var data = {
            category: category,
            action: action,
            label: label
        };

        if (value) {
            data.value = value;
        }

        window.ga( 'send', 'event', data );
    }

    function logEventToConsole( category, action, label ) {
        var console = window.console;

        if ( console && console.log ) {
            console.log( 'track', category, action, label );
        }
    }

    function determineActualCategory( tracker, c ) {
        var category = c || tracker.options.track
          , alternative = tracker.options[ category ];

        return alternative ? alternative : category;
    }

    function determineAppropriateLabel( tracker ) {
        var page = window.location.href
          , rel = tracker.$element.attr('rel')
          , title = tracker.$element.attr('title')
          , attr = tracker.$element.is('form') ? 'action' : 'href'
          , href = tracker.$element.attr( attr );

        if ( rel ) {
            return rel;
        }
        if ( title ) {
            return title;
        }
        if ( href ) {
            return href;
        }

        return page;
    }

    function calculateAction( el ) {

    }

    // public interface

    EventTracker.prototype = {
        constructor: EventTracker

        // data attributes will overide all but the category parameter
      , track: function( c, a, l, v ) {
            var $el = this.$element;

            var ev = $.Event( 'track', {
                category: determineActualCategory( this, c )
              , action: this.options.action || a || (this.$trackingElement.is('form') ? 'submitted' : this.$element.attr('rel') || 'clicked')
              , label: this.options.label || l || determineAppropriateLabel( this )
              , value: this.options.value || v || undefined
            });

            $(document).trigger( ev );

            sendTrackedEvent( ev.category, ev.action, ev.label, ev.value, this.options.after );
        }

    };

    $.fn.trackevent = function ( type, opt ) {
        return this.each(function () {
          var $this = $(this)
            , $parent = $this.parents('[data-track]').first()
            , data = $this.data('eventtracker')
            , options = $.extend({}, $.fn.trackevent.defaults, typeof type === 'object' && type, typeof opt === 'object' && opt, $parent.data() || {}, $this.data())
            , method = typeof type === 'string' ? type : options.track;

          if (!options.label && $parent.is('form') && typeof $this.attr('href') !== 'string') {
              options.label = $parent.attr('action');
          }

          if (!data) {
              $this.data('eventtracker', (data = new EventTracker(this, options)));
          }

          if ( method && $.fn.trackevent.handlers[ method ] ) {
              return $.fn.trackevent.handlers[ method ].call( data );
          }

          data.track( method );
        });
    };

    $.fn.trackevent.defaults = {
        searchresult: 'search link'
      , glossary:     'a-z link'
      , navigation:   'navigation link'
      , subsection:   'navigation expandable'
    };

    $.fn.trackevent.handlers = {

        // Category: download slide, Action: title or href, Label: current page
        slidedownload: function() {
            $.fn.trackevent.handlers.download.call( this, 'slide' );
        }


        // Category: download type, Action: title or href, Label: current page
      , download: function( dltype ) {
            var category = 'download' + ( dltype ? ' ' + dltype : '' )
              , action = this.$element.attr('title') || this.$element.attr('href')
              , label = window.location.href;

            this.track( category, action, label );
        }

        // Category: pagination, Action: title or href, Label: current page
      , pagination: function() {
            var category = 'pagination'
              , action = this.$element.attr('rel')
              , label = window.location.href;

            this.track( category, action, label );
        }

        // Category: tophat, Action: tophat service menu opened / closed, Label: page clicked from
        // Category: tophat, Action: tophat menu name, Label: page clicked from
      , tophat: function() {
            var category = 'tophat'
              , action = this.$element.attr('title')
              , label = window.location.href;

            if (this.$element.is('.menu-item-evidence a')) {
                var isCollapsed = this.$element.hasClass('collapsed');

                action = action += isCollapsed ? ' expanded' : ' collapsed';
            }

            this.track( category, action, label );
        }

      , ajax: function( url ) {
            var remote = (url || this.options.label).toLowerCase()
              , isSearch = ~remote.indexOf('/search?') && ~remote.indexOf('q=')
              , category = isSearch ? 'search results' : 'ajax request'
              , action = 'loaded'
              , label = url;

            this.track( category, action, label );
        }

    };


   /* LOGGER NO CONFLICT
    * ================== */

    $.fn.trackevent.noConflict = function () {
        $.fn.trackevent = old;

        return this;
    };

    // events

    $(document)
        .on('click.data-api.bs', 'a[data-track], button[data-track], [type="submit"][data-track], [type="reset"][data-track], [type="image"][data-track], [data-track] a, [data-track] button, .tophat a', function ( e ) {
            var $link = $(this);

            if ( $link.is('.tophat a') ) {
                $link.trackevent( 'tophat' );

                return;
            }

            $link.trackevent();
        })
        .on('submit.data-api.bs', '[data-track]', function ( e ) {
            var $form = $(this);
        })
        .ajaxSuccess(function( e, xhr, settings ) {
            $(e.target).trackevent( 'ajax', { label: settings.url });
        });

})( window.jQuery );
