define([
    'backbone',
    'Models/chatModel',
    'Repositories/messageRepository',
    'Views/chatListView',
    'libs/userService',
    'libs/ws',
    'toastr',
    'Models/chatCollection'
], function (
    Backbone,
    ChatModel,
    messageRepository,
    ChatListView,
    UserService,
    ws,
    toastr,
    ChatCollection
) {

    var chatCollection = new ChatCollection();
    var chatModel = new ChatModel();
    chatCollection.fetch().then(function () { chatCollection.select(); });

    var updateMessageList = function () {
        var chatId = chatModel.get("chatId");
        if (chatId) {
            chatCollection.select(chatId);
            messageRepository.allByChatId(chatId)
                .then(function (htmlData) {
                    $('#messageList').html(htmlData);
                    var element = document.getElementById("messageList");
                    element.scrollTop = element.scrollHeight;
                });
        }
    };

    ws.attachOnMessageHandler(function (EventEntity) {
        if(EventEntity.name === 'sendMessage') {
            var chatId = chatModel.get("chatId");
            if(chatId == EventEntity.data.chatId) {
                updateMessageList();
            }
            if(EventEntity.data.direction === 'in' && chatId != EventEntity.data.chatId) {
                var text = 'Новое сообщение!<br/>' + EventEntity.data.text + '<br/><a href="/messenger#chat/'+EventEntity.data.chatId+'">Открыть</a>';
                toastr.info(text);
                //toastr.info(JSON.stringify(EventEntity));
            }
            console.log('EventEntity: ', EventEntity);
        }
    });

    var sendMessage = function (chatId, data) {
        messageRepository.sendMessage(chatId, data)
            .then(function (response) {
                $('#messageInput').val('');
                //updateMessageList();
            });
    };

    $('#messageForm').submit(function (e) {
        e.preventDefault();
        var data = $(this).serialize();
        var chatId = chatModel.get("chatId");
        sendMessage(chatId, data);
    });


    var chatListView = new ChatListView({ collection: chatCollection });

    //chatListView.render();

    return Backbone.Router.extend({
        initialize: function (options) {
            this.model = chatModel;
        },

        routes: {
            "": "index",
            "chat/:chatId": "showChat"
        },

        index: function () {
            $('#messageList').html('Select dialog');
        },

        showChat: function (chatId) {
            this.model.set({chatId: chatId});
            updateMessageList();
        }
    });

});
