define(['backbone'], function(Backbone){

	return Backbone.Model.extend({
		defaults: {
			username: "",
			chatId: ""
		}
	});

});
