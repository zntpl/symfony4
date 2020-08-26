define(['backbone'], function(Backbone){

	var ChatModel = Backbone.Model.extend({
		defaults: {
			is_active: false
		}
	});

	return  Backbone.Collection.extend({
		model: ChatModel,
		url: '/chat-list',
		_chatId: null,

		select: function (chatId) {
			if(chatId) {
				this._chatId = chatId;
			}
			var item = this.get(this._chatId);
			if(item) {
				//console.log(chatId);
				this.resetSelect();
				item.set('is_active', true);
			}
		},

		resetSelect: function () {
			this.each(function (item) {
				item.set({is_active: false});
			});
		}
	});

});
