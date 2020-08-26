define(['jrails/spa/layer', 'jrails/helper/dom'], function(spaLayer, domHelper) {

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
            var moduleElement = spaLayer.getModuleLayer(request);
            var elements = moduleElement.find($("*"));
            domHelper.bindEventForList(elements, 'bundle.module.contact.store.contactStore.update');
            /*container.event.registerHandler('bundle.module.contact.store.contactStore.update', function (contactEntity) {
                moduleElement.find('#title').html(contactEntity.title);
                moduleElement.find('#content').html(contactEntity.content);
                moduleElement.find('#delete-action').attr('href', contactEntity.deleteAction);
                moduleElement.find('#update-action').attr('href', contactEntity.updateAction);
            });*/
        },

    };

});