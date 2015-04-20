/*globals window, define*/

(function (window, App) {
    
    //Lets Set Up the enviroment and check for compatibility.
    window = window || this;

    var app = new App();
    
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(app);
    } else {
        window.app = app;
    }


})(window, function () {
    this.init = function () {
        //        var ws = app.webSocket.new('/');
    };

    return this;
});