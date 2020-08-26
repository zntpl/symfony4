define([], function() {

    return {

        downloadContent: function(filename, content, type) {
            var href = this.makeFunction(content, type);
            var link = document.createElement('a');
            link.download = filename;
            link.href = href;
            link.click();
        },

        makeFunction: function (content, type) {
            var blob = new Blob([content], {type: type || 'text/plain'});
            var href = window.URL.createObjectURL(blob);
            return href;
        },

        assign: function (element, filename, content, type) {
            var href = this.makeFunction(content, type);
            element.attr('download', filename);
            element.attr('href', href);
        }
    };

});