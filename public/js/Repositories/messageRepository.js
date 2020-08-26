define(['restClient'], function(Client){

	return {
		allByChatId: function (chatId) {
			var url = '/message-list/' + chatId;
			var axiosPromise = Client.get(url);
			var promiseCallback = function(resolve,reject){
				axiosPromise
					.then(function (response) {
						resolve(response.data);
					});
			};
			return new Promise(promiseCallback);
		},
		sendMessage: function (chatId, data) {
			var url = '/messenger/' + chatId;
			var axiosPromise = Client.post(url, data);
			var promiseCallback = function(resolve,reject){
				axiosPromise
					.then(function (response) {
						if (response.data == '' && response.status == 200) {
							resolve();
						}
					});
			};
			return new Promise(promiseCallback);
		}
	};

});
