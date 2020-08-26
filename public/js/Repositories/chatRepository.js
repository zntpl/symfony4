define(['restClient'], function(Client){

	return {
		all: function () {
			var url = '/chat-list/';
			var axiosPromise = Client.get(url);
			var promiseCallback = function(resolve,reject){
				axiosPromise
					.then(function (response) {
						resolve(response.data);
					});
			};
			return new Promise(promiseCallback);
		}
	};

});
