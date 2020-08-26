define(['underscore'], function(_){

    var app = {};
    if(typeof window.app !== 'undefined') {
        app = window.app;
        window.app = null; // прячем от глобальной области видимости
    }

    return {
        get: function () {
            return app;
        }
    };

});
