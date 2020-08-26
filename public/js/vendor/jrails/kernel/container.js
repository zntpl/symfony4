define([], function() {

    /**
     * Контейнер
     */
    return window.container =  {
        /**
         * Создать экземпляр объекта
         *
         * @param className класс
         * @param attributes назначаемые атрибуты
         * @param params параметры конструктора
         * @returns {Object}
         */
        instance: function (className, attributes, params) {
            if(_.isString(className)) {
                className = use(className);
            }
            return bundle.helper.class.create(className, attributes, params);
        },

        /**
         * Объявлен ли класс в контейнере
         *
         * @param className
         * @returns {Boolean}
         */
        has: function (className) {
            return bundle.kernel.loader.isDefined(className, this);
        },

    };

});