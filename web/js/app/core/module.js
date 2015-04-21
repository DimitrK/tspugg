/** @module app.core.Module */
function __Module__() {}


/**
 * Module lifecycle . Construct method will be triggered after initialization.
 * Any submodule can override it to handle individual initialization logic
 * preferably after calling `super` so it will propagate the initialization 
 * in parent modules first.
 */
__Module__.prototype.construct = function () {};

/**
 * Extend method provides inheritance ability
 * @param   {Object}   [obj={}] The definition of the submodule.
 * @returns {Function} The submodule constructor function
 */
__Module__.extend = function (obj) {
    var objType = Object.prototype.toString.call(obj);
    if (objType !== '[object Object]') {
        throw '`extend` accepts object as parameter. ' + objType + ' was given.';
    }

    var Module = function () {
        if (arguments[0] !== __Module__) {
            this.construct.apply(this, arguments);
        }
    };


    var proto = new this(__Module__);

    $.extend(true, proto, obj);

    
    Object.keys(obj).forEach(function (prop) {    
        if (obj[prop] instanceof Function) {
            obj[prop].__name__ = prop;
        }
    });

    Module.prototype = proto;
    Module.extend = this.extend;

    if (proto.name) {
        app._.setToPath(proto.name, Module);
    }

    return Module;
};

// Define `super` property that locates the parent implementation of the submodule.
// The function name that invoked the `super` property is used for the look up.
Object.defineProperty(__Module__.prototype, "super", {
    get: function get() {
        var implementation = get.caller,
            name = implementation.__name__,
            existingImplementation = this[name] === implementation,
            proto = this;

        while (proto = Object.getPrototypeOf(proto)) {
            if (!proto[name]) {
                break;
            } else if (proto[name] === implementation) {
                existingImplementation = true;
            } else if (existingImplementation) {
                return proto[name];
            }
        }

        if (!existingImplementation) {
            throw "there is no `super` implementation for the invoked method";
        }
    }
});

app._.setToPath('app.core.Module', __Module__);