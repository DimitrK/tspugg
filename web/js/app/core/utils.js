app._ = {
    
    /**
     * Check if the given parameter is an object
     * @param   {Mixed}   subject The subject under investigation
     * @returns {Boolean} Wether subject under investigation is object or not
     */
    isObject: function(subject){
        return Object.prototype.toString.call(subject) === '[object Object]';
    },
    
    /**
     * Checks if the given parameter is empty. Handles String, Array, Object
     * otherwise returns false
     * @param   {Mixed}   subject The subject under investigation
     * @returns {Boolean} Indicates wether the subject is empty
     */
    isEmpty: function(subject){
        var type = Object.prototype.toString.call(subject);
        switch(type) {
            case '[object Object]':
                return Object.keys(subject).length === 0;
            case '[object Array]':
            case '[object String]':
                return subject.length === 0;
            case '[object ArrayBurffer]':
                return subject.byteLength === 0;
            case '[object Undefined]':
            case '[object Null]':
                return true;
            default:
                if( !!~type.indexOf('Array') ) {
                    // Assuming typed arrays like Uint8Array
                    return subject.length;
                } else {
                    // Assuming Number
                    return false;
                }
        }
    },
    
    /**
     * Navigates or creates(if not exists) a specific path and assigns the given
     * value. A string path 'some.test' would translate to an object `some.test`
     * where property test would hold the parameter `value`
     * @param {String} path  A string representing the path that the value should
     *                       be assigned to.
     * @param {Mixed}  value A value to assign to the given path.
     */
    setToPath: function (path, value) {
        var next = window,
            prev,
            parts,
            part,
            lastpart;

        if (path[0] == '.') path = path.replace(/^\.+/, '');

        // here's where we check to make sure we have a truthy string-ish
        if (!path) return;

        parts = path.split('.');
        part = parts.shift();
        lastpart = parts[parts.length - 1];

        do {
            prev = next;
            next[part] = next[part] ? next[part] : {};
            next = next[part];
        } while (next && (part = parts.shift()));

        prev[lastpart] = value;
    }
};