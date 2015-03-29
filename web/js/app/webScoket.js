(function (app, window) {
    "use strict";
    
    if(!app){ 
        throw "App not initialized";
    }
    
//    var host = window.location.origin.replace(/^http/, 'ws');
    
    var host = 'ws://localhost:3000';
    
    app.webSocket = {};
    
    app.webSocket.new = function (path) {
        var ws = new WebSocket(host + path);
        app.mixins.eventsSupport.apply(ws);
        return ws;
    };
    
})(app, this);