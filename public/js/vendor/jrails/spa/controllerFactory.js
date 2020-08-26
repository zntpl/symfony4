define(['jrails/vue/vm', 'jrails/spa/layer', 'jrails/spa/query', 'lodash'], function(vm, spaLayer, spaQuery, _) {

    var initTemplate = function (controller, templateHtml) {
        spaLayer.hideAll();
        //if( ! vm.has(controller.el)) {
            var id = controller.el.replace('#', '');
            spaLayer.add222(templateHtml, id);
            vm.ensure(controller);
        //}
        $(controller.el).show();
        if(_.isFunction(controller.onShow)) {
            controller.onShow();
        }
    };

    var loadTemplate = function (controller, templateFileName) {
        var templateFileAlias = 'text!' + templateFileName;
        require([templateFileAlias], function (templateHtml) {
            initTemplate(controller, templateHtml);
        });
    };

    var onReady = function (controller) {
        if(_.isFunction(controller.onReady)) {
            controller.onReady();
        }
        if(_.isFunction(controller.run)) {
            controller.run();
        }
        if( ! _.isEmpty(controller.templateFile)) {
            loadTemplate(controller, controller.templateFile);
        }
        if( ! _.isEmpty(controller.templateCode)) {
            initTemplate(controller, controller.templateCode);
        }
    };

    return {
        loadTemplate: function (controller, templateFileName) {
            loadTemplate(controller, templateFileName);
        },
        createByClassName: function (controllerClassName, query) {
            spaQuery.set(query);
            require([controllerClassName], onReady);
        },
        createByClass: function (controllerClass, query) {
            spaQuery.set(query);
            onReady(controllerClass);
        },
    };

});