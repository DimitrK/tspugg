/** @module UIModule */

/** @class */
(function () {
    app.core.Module.extend({
        name: 'app.core.UIModule',

        /**
         *   @member {Object} The default options
         */
        defaults: {
            /**
             *
             * @member {String} The target element where the html of the module will be rendered indo.
             */
            target: 'body',

            /**
             * If no `htmlFragment` is present the html of the object will be the corresponded element
             */
            tag: 'div'
        },

        /** 
         * @member {String} The html string selector that will be used to construct the html of the component.
         *                  Since we do not use some templating mechanism as requested, the html required
         *                  for each UIModule will be hold in custom script tags and will be fetched throug
         *                  jQuery as text. If no htmlFragment selector is provided, then the $el will use the
         *                  `tag` property.
         */
        htmlFragment: undefined,

        /**
         * @member {Object} The jquery object that holds all the html for this module
         */
        $el: undefined,

        /**
         * @member {Object} Array of strings where each string defines one or multiple events for a
         * specific selector and a specific handler.  The format of such string is :
         * `'[selector on ]event[ event]': [handler | 'handlerString']` .
         * The selector could be ommited with the ' on ' statement. Then the events will be bound to `$el`
         * The handler could be a function or a string. If it is string then it will be bound to the
         * scope of this instance. E.g valid formats:
         * ```
         *      {
         *          'click' : actionfn,
         *          'click focus' : 'actionfnString',
         *          '.selector on click focus' : actionfn,
         *      }
         * ```
         */
        events: {},
        
        construct: function(){
            this.super.apply(this, arguments);
        },

        /**
         * Constructor function for UIModule. It accepts as parameter an object with all declared options.
         * It then defines the `html` property if not defined using the `tag` property.
         * It instantiates the `$el` property which holds a reference to the jQuery object for the given
         * `html`.
         * @param {Object} [options={}] Object with all necessary options as properties. UIModule is a generic
         *                              module and does not require any specific options other than `target`
         *                              which is used to render the `$el` to the defined target, `events` and .
         */
        create: function (options) {
            this.super.call(this, arguments);
            options = options || {};
            if (!app._.isObject(options)) {
                throw "Object or nothing is expected as passing parameter while creating an instance of a UI module.";
            }
            options = $.extend({}, this.defaults, options);


            this.$target = $(options.target);

            this.htmlFragment = $(this.htmlFragment+'[type="text/html-fragment"]').text() || '<' + this.tag + '></' + this.tag + '>';

            this.$el = $(this.htmlFragment);

            if( !app._.isEmpty(options.events) ) {
                $.extend(this.events, options.events);
            }

            this._bindEvents();

        },

        render: function () {
            this.$el.appendTo(this.$target);
        },

        addEvents: function (events) {
            if (app._.isEmpty(events)) {
                return;
            }

            if (!app._.isObject(events)) {
                throw "Failed to add events from a non object parameter";
            }

            Object.keys(events).forEach(function (eventKey) {
                this.events[eventKey] = events[eventKey];
            }.bind(this));

            this._bindEvents(events);
        },
        /**
         * @private
         * @param {Object} events The events object formatted as described in [events]{@link events}
         */
        _bindEvents: function (events) {
            Object.keys(events || this.events)
                .forEach(this._bindCompositeEvent.bind(this));
        },

        /**
         * Analyses the composite event string and decides which binding strategy to follow.
         * Analysis is based on wether a selector is passed (event propagation based binding)
         * where ` on ` term should be present, or not (direct event binding).
         *
         * @private
         * @param {String} selectorWithEventsString A string in format `.selector on event`
         */
        _bindCompositeEvent: function (selectorWithEventsString) {


            var handlerFunction = this.events[selectorWithEventsString];
            if (typeof handlerFunction === 'string') {
                handlerFunction = this[handlerFunction];
                handlerFunction = handlerFunction.bind(this);
            }

            var splitedSelectorWithEvents = selectorWithEventsString.split(' on ');
            var selectorString, eventsString;
            if (!splitedSelectorWithEvents.length) {
                return;
            }

            if (splitedSelectorWithEvents.length < 2) {

                eventsString = splitedSelectorWithEvents[0];

                //direct event binding
                this.$el.on(eventsString, handlerFunction);

            } else {

                selectorString = splitedSelectorWithEvents[0];
                eventsString = splitedSelectorWithEvents[1];

                if (!$.trim(selectorString).length) {
                    throw "No selector found while 'on' statement exists";
                }
                if (!$.trim(eventsString).length) {
                    throw "No selector found while 'on' statement exists";
                }
                //event propagation based binding
                this.$el.on(eventsString, selectorString, handlerFunction);
            }


        },
        /**
         * Removal of elements and cleaning up
         */
        destroy: function () {
            this.$el.off();
            this.$el.remove();
            this.$el = undefined;
            this.events = undefined;
        }
    });
})();