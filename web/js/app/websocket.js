/**
* TODO: Has to change in accordance with the Module pattern employed to the rest of the app.
* Maybe submodule of a NetworkSource Module with corresponding Ajax implementation as well.
*/
(function (app, window) {
        
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