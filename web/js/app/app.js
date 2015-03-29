(function(window){
    "use strict";
    var app = window.app = {};
    
    app.init = function(){
        var ws = app.webSocket.new('/');
    };
    
})(this);