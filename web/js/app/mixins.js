(function (app, window) {
    
    if (!app) {
        throw "App not initialized yet";
    }

    function extractEventProperties(sourceObj, eventTerm, actionTerm) {
        var events = {};

        Object.keys(sourceObj).forEach(function (key) {
            var val = sourceObj[key];
            var eventName;
            if (key.indexOf(eventTerm) === 0) {
                eventName = key.replace(eventTerm, '');
                events[eventName] = [val];
                sourceObj[key] = (function (eventName) {
                    return function () {
                        var args = Array.prototype.slice.apply(arguments);
                        args.unshift(eventName); //Add event name
                        sourceObj[actionTerm].apply(sourceObj, args);
                    };
                })(eventName);
            }
        });
        return events;
    }

    app.mixins = {};
    app.mixins.eventsSupport = function () {
        if (this === window) {
            throw "Winow is passed as context";
        }

        var events = extractEventProperties(this);

        // In case of prepublished events will do some clean up of null and undefined stated callbacks.
        (function sanitizePrePublishedEvents() {
            events = (events && typeof events === "object") ? events : {};
            return Object.keys(events).forEach(function (event) {
                var callbacks = events[event];
                if (callbacks.length > 0) {
                    events[event] = callbacks.filter(function (callback) {
                        return typeof callback === "function";
                    });
                } else {
                    events[event] = [];
                }
            });
        })();

        // Only named functions can be removed later on.
        this.on = function (eventname, callback, context) {
            var filterCalbackNotExistsAlready = function (existingcallback) {
                return existingcallback.toString() !== callback.toString();
            };
            events[eventname] = events[eventname] || [];
            if (typeof callback === "function" && events[eventname].every(filterCalbackNotExistsAlready)) {
                var boundedFn = callback.bind(context);
                boundedFn.constructor = callback;
                events[eventname].push(boundedFn);
            }
            return;
        };

        // ['do'] = .do - A favor to Linter
        this['do'] = function (eventname) {
            var args = Array.prototype.slice.apply(arguments);
            args.shift(); // remove the eventname
            events[eventname] && events[eventname].forEach(function (fn) {
                if (fn) {
                    return fn.apply(fn, args);
                }
            });
        };

        this.off = function (eventname, fn) {
            if (fn) {
                events[eventname] && events[eventname].forEach(function (callback, index, arr) {
                    if (callback.constructor === fn) {
                        arr.splice(index, 1);
                    }
                });
            } else {
                events[eventname] = [];
            }
        };
    };

})(app, this);