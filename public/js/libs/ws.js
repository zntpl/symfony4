define([
    'underscore',
    'jrails/helper/func',
    'jrails/event/eventService',
    'libs/userService'
], function (
    _,
    FuncHelper,
    EventService,
    UserService
) {

    var Socket = {
        ws: null,
        onMessageHandlers: [],
        handlers: {},
        eventServicePrefix: 'webSocket_',
        init: function (url) {
            var identity = UserService.getIdentity();
            this.ws = new WebSocket(url + '?userId=' + identity.id);
            this.ws.addEventListener('message', this.onMessage);
        },
        attachOnMessageHandler: function (callback) {
            var name = this.eventServicePrefix + 'message';
            EventService.registerHandler(name, callback);
        },
        onMessage: function (event) {
            var EventEntity = JSON.parse(event.data);
            var name = Socket.eventServicePrefix + 'message';
            EventService.trigger(name, EventEntity);
        }
    };
    return Socket;

});
