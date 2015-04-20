 (function() {
    app.Core.UIModule.extend({
        name: 'app.UI.ExpandMenu',
        htmlFragment: '#expand-menu',
        isOpen: false,
        events:{
            'span.svg-container on click': 'toggle'
        },
        toggle: function() {
            if (this.isOpen) {
                this.$el.removeClass('open');
            } else {
                this.$el.addClass('open');
            }

            this.isOpen = !this.isOpen;    
        }
    });
})();
//
//var ExpandMenu = (function () {
//    "use strict";
//
//    /**
//     * Constructor function of Expand Menu
//     * @param {[[Type]]} el           [[Description]]
//     * @param {[Object]} [options={}] [[Description]]
//     */
//    function Ctor(el, options) {
//        this.$el = el instanceof jQuery ? el : $(el);
//        this.isOpen;
//        this.events;
//        this.svgContainer;
//        this.init(options);
//    }
//
//
//    Ctor.prototype.init = function (options) {
//        options = options || {};
//
//        this.events = $.extend({}, options.events);
//
//        this.isOpen = false;
//
//        this.svgContainer = this.$el.find('span.svg-container');
//
//        this.initEvents();
//    };
//
//
//    Ctor.prototype.initEvents = function () {
//        this.svgContainer.on('click', this.toggle.bind(this));
//
//    };
//
//
//    Ctor.prototype.toggle = function () {
//
//        if (this.isOpen) {
//            this.$el.removeClass('open');
//        } else {
//            this.$el.addClass('open');
//        }
//
//        this.isOpen = !this.isOpen;
//    };
//
//    Ctor.prototype.addMenuOptions = function () {
//        var optionsFrag = document.createDocumentFragment();
//        var li, a, span;
//    };
//
//
//    Ctor.prototype.destroy = function () {
//        this.svgContainer.off('click', this.toggle.bind(this));
//        this.svgContainer = undefined;
//        this.el.remove();
//    }
//
//
//    Ctor.prototype._eventHandler = function (event, actionFn) {
//        event.preventDefault();
//        actionFn();
//    }
//
//    return Ctor;
//})();
