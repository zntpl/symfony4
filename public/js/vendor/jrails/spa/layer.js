define([], function() {

    /**
     *
     */
    return {

        wrapperId: 'app',
        wrapperInstance: null,

        getWrapperElement: function () {
            if( ! _.isObject(this.wrapperInstance)) {
                this.wrapperInstance = $('#' + this.wrapperId);
            }
            return this.wrapperInstance;
        },

        getElementId: function (id) {
            if(id) {
                return this.wrapperId + '-' + id;
            } else {
                return this.wrapperId;
            }
        },

        getModuleLayer: function (request) {
            var moduleElementId = this.getElementId(request.controller + '-' + request.action);
            return this.getWrapperElement().find('#' + moduleElementId);
        },

        has: function (request) {
            var layerWrapper = this.getModuleLayer(request);
            return layerWrapper.length;
        },

        show: function (request) {
            bundle.spa.layer.hideAll();
            var layerWrapper = this.getModuleLayer(request);
            layerWrapper.show();
        },

        add: function (data, request) {
            var moduleElementId = this.getElementId(request.controller + '-' + request.action);
            var layerHtml =
                '<div class="page-layer" id="' + moduleElementId + '">' +
                data +
                '</div>';
            this.getWrapperElement().append(layerHtml);
        },

        hideAll: function () {
            this.getWrapperElement().find('.page-layer').hide();
        },

    };

});

define([], function() {

    return {

        compileElement: function (moduleElement, params) {
            var template = moduleElement.html();
            var html = this.compile(template, params);
            moduleElement.html(html);
        },

        compile: function (template, params) {
            var templateHtml = bundle.helper.string.unescapeHtml(template);
            return _.template(templateHtml)(params);
        },

    };

});

define([], function() {

    return {

        /*getVueInstance: function (definition) {
            var el = definition.el;
            if( ! bundle.vue.vm.has(el)) {
                var vueInstance = new Vue(definition);
                bundle.vue.vm.set(el, vueInstance);
            }
        },*/

        getClassName: function (request, type) {
            var className = 'bundle.module.' + request.controller + '.'+type+'.' + request.action + _.startCase(_.toLower(type));
            return className;
        },

        getTemplateUrl: function (request) {
            var templateUrl = '/src/' + request.path + '/' + request.controller + '/view/' + request.action + '.html';
            return templateUrl;
        },

        isTemplate: function (data) {
            return data.search(/<!DOCTYPE html>/g) === -1;
        },

        prepareRequest: function (request) {
            request.action = _.defaultTo(request.action, 'index');
            request.path = _.defaultTo(request.path, 'module');
            request.namespace = request.controller + '.' + request.action;
        },

        registerEventHandlers: function (request) {
            var moduleElement = bundle.spa.layer.getModuleLayer(request);
            var elements = moduleElement.find($("*"));
            bundle.helper.dom.bindEventForList(elements, 'bundle.module.contact.store.contactStore.update');
            /*container.event.registerHandler('bundle.module.contact.store.contactStore.update', function (contactEntity) {
                moduleElement.find('#title').html(contactEntity.title);
                moduleElement.find('#content').html(contactEntity.content);
                moduleElement.find('#delete-action').attr('href', contactEntity.deleteAction);
                moduleElement.find('#update-action').attr('href', contactEntity.updateAction);
            });*/
        },

    };



});


define([], function() {

    /**
     *
     */
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
                controller.onLoadDepends(request);
                return;
            }
            var cbCount = 0;
            var cb = function () {
                cbCount++;
                if(cbCount === controller.depends.length) {
                    //d(cbCount);
                    controller.onLoadDepends(request);
                    controller.run(request);
                }
            };
            for(var k in controller.depends) {
                var dependClass = controller.depends[k];
                bundle.kernel.loader.requireClass(dependClass, cb);
            }
        },

        run: function (requestSource) {
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
                            bundle.spa.module.loadDepends(request, controller);
                        }
                    }
                    bundle.spa.helper.registerEventHandlers(request);
                };
                bundle.kernel.loader.requireClass(className, cb);
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


/*$("a").each(function(index, element) {
            $(element).click(function (event) {
                var el = $(event.target);
                var uri = el.attr('href');
                uri = _.trim(uri, '#/');
                uri = '/#' + uri;
                console.log(uri);
                bundle.helper.url.setUrl(uri);
                return false;
            });
        });*/