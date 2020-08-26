define(['backbone'], function (Backbone) {

    var ItemView = Backbone.View.extend({

        template: _.template($('#chatItem').html()),

        initialize: function () {
            this.model.on('destroy', this.remove, this);
        },

        events: {
            'click .chat_list': 'select'
        },

        select: function () {
            var id = this.model.get('id');
            window.location.href = '#chat/' + id;
        },

        render: function () {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            return this;
        }
    });

    return Backbone.View.extend({
        el: $("#chatList"),

        initialize: function () {
            this.collection.on('add', this.addOne, this);
            this.collection.on('change', this.render, this);
        },

        render: function () {
            this.$el.empty();
            this.collection.each(this.addOne, this);
            return this;
        },

        addOne: function (taskItem) {
            var task = new ItemView({model: taskItem, collection: this.collection});
            this.$el.append(task.render().el);
        }
    });

});
