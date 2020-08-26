define(['underscore', 'libs/appService'], function(_, AppService){

    var app = AppService.get();

    return {
        isAuth: function () {
            return _.isObject(app.user);
        },
        getIdentity: function () {
            return app.user;
        }
    };

});
