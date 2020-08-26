define([], function() {

    var helper = {

        checkAccess: function (controller) {
            var access = controller.access();
            if(_.isEmpty(access)) {
                return true;
            }
            if(access.auth === '@' && ! container.authService.isLogin()) {
                bundle.module.user.service.authService.authRequired();
                return false;
            }
            if(access.auth === '?' && container.authService.isLogin()) {
                container.notify.info(lang.user.auth.alreadyAuthorizedMessage);
                bundle.spa.router.goBack();
                return false;
            }
            return true;
        },

        runController: function (controller, request) {
            var isAllow = false;
            if(_.isFunction(controller.access)) {
                isAllow = this.checkAccess(controller);
            }
            if(_.isFunction(controller.run) && isAllow) {
                controller.run(request);
            }
        },

    };

    return {

        request: null,

        loadTemplate: function (request, callback) {
            var templateUrl = window.bundle.spa.helper.getTemplateUrl(request);
            $.ajax({
                url: templateUrl,
                success: function (data) {
                    callback();
                    if (window.bundle.spa.helper.isTemplate(data)) {
                        bundle.spa.layer.add(data, request);
                    }
                }
            });
        },

        loadDepends: function (request, controller) {
            if(_.isEmpty(controller.depends)) {
                //d(controller);
                bundle.vue.vm.ensure(controller);
                //bundle.spa.helper.getVueInstance(controller);
                //controller.onLoadDepends(request);
                helper.runController(controller, request);
                return;
            }
            var cbCount = 0;
            var cb = function () {
                cbCount++;
                if(cbCount === controller.depends.length) {
                    //d(cbCount);
                    //d(controller);
                    //bundle.spa.helper.getVueInstance(controller);
                    bundle.vue.vm.ensure(controller);
                    //controller.onLoadDepends(request);
                    helper.runController(controller, request);
                }
            };
            for(var k in controller.depends) {
                var dependClass = controller.depends[k];
                if(dependClass.search(/\//g) !== -1) {
                    bundle.kernel.loader.requireScript(dependClass, cb);
                } else {
                    bundle.kernel.loader.requireClass(dependClass, cb);
                }
            }
        },

        run: function (requestSource) {
            //d(requestSource);
            var request = _.clone(requestSource);
            this.request = request;
            bundle.spa.helper.prepareRequest(request);
            var callback = function () {
                var className = window.bundle.spa.helper.getClassName(request, 'controller');
                bundle.spa.layer.show(request);
                var cb = function () {
                    var controller = use(className);
                    if( ! _.isEmpty(controller)) {
                        if(_.isEmpty(controller.isInit)) {
                            controller.isInit = true;
                            controller.el = '#app-'+request.controller+'-'+request.action;
                            bundle.vue.loader.loadDepends(request, controller);
                        }
                    }
                    bundle.spa.helper.registerEventHandlers(request);
                };
                if(bundle.kernel.loader.isDefined(className)) {
                    cb();
                } else {
                    bundle.kernel.loader.requireClass(className, cb);
                }
            };
            this.doRequest(request, callback);
        },

        doRequest: function (request, callback) {
            var isExists = bundle.spa.layer.has(request);
            if (isExists) {
                callback();
            } else {

                this.loadTemplate(request, callback);
            }
        },

    };

});