define([
    'backbone',
    'jrails/crypto/axios'
], function (
    Backbone,
    axios
) {

    return Backbone.Router.extend({
        initialize: function (options) {
            //this.model = chatModel;
        },

        routes: {
            "": "index",
        },

        index: function () {
            var contentHtml = '';
            //$('#content').html('Select dialog');
            $('#send').click(function () {
                axios.post('/test', {
                    "text": "qwerty"
                }).then(function (response) {
                    contentHtml = contentHtml + "<br/>" + JSON.stringify(response.data);
                    $('#content').html(contentHtml);
                    console.log(response);
                });
            });

        },

    });

});
