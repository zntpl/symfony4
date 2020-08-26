requirejs.config({
    urlArgs: "bust=" + (new Date()).getTime(), // отмена кэширования скриптов браузером
    //baseUrl: "/js",
    paths: {
        module: '/spa/module',
        widget: '/spa/widget',
        app: '/spa',

        jrails: '/js/vendor/jrails',
        jquery: '/js/vendor/jquery/jquery.min',
        text: '/js/vendor/text/text',
        axios: '/js/vendor/axios.min',
        bootstrap: '/js/vendor/bootstrap/bootstrap.min',
        backbone: '/js/vendor/backbone.min',
        underscore: '/js/vendor/underscore.min',
        lodash: '/js/vendor/lodash/lodash.min',
        storage: '/js/vendor/jstorage',
        json: '/js/vendor/json2',
        jszip: '/js/vendor/jszip/jszip',
        toastr: '/js/vendor/toastr/toastr.min',
        'crypto-js': '/js/vendor/crypto-js/crypto-js',
        jsencrypt: '/js/vendor/jsencrypt/jsencrypt',
        restClient: '/js/vendor/jrails/rest/clientAxiosDriver',

        director: '/js/vendor/director/director.min',
        redux: '/js/vendor/redux/redux.min',
        vue: '/js/vendor/vue/vue.min',
        'jquery-ui': '/js/vendor/jquery-ui/jquery-ui.min',
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'lodash': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'json': {
            exports: 'JSON'
        },
        'axios': {
            exports: 'axios'
        },
        'storage': {
            deps: ['json', 'jquery']
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});

require([
    '/spa/init',
    /*"toastr",
    "bootstrap",
    'config/main',
    'libs/userService',
    'jrails/event/eventService',
    'restClient',
    //'Models/chatModel',
    'libs/ws',
    'jrails/crypto/session'*/
], function (
    App
    /*toastr,
    Bootstrap,
    MainConfig,
    UserService,
    EventService,
    Client,
    //ChatModel,
    ws,
    Session*/
) {

    App.run();


    /*window.dd = function(value1, value2, value3) {
        if(typeof value3 !== 'undefined') {
            console.log(value1, value2, value3);
            return;
        }
        if(typeof value2 !== 'undefined') {
            console.log(value1, value2);
            return;
        }
        console.log(value1);
    };

    toastr.options = {"positionClass": "toast-bottom-left"};

    Client.baseUrl = MainConfig.apiHost;

    if(UserService.isAuth()) {
        ws.init(MainConfig.webSocketHost);
    }

    EventService.registerHandler('api.request.send.error', function (response) {
        var text = '<h4>' + response.response.statusText + '</h4>';
        text = text + '<span onmousemove="$(\'#toastrErrorData\').show()">Show data</span>';
        text = text + '<div id="toastrErrorData" style="display: none;">'+response.response.data+'</div>';
        toastr.error(text);
    });*/

});
