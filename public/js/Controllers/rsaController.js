define([
    'backbone',
    'jsencrypt',
    'jrails/helper/file',
    'vendor/jszip/jszip'
], function (
    Backbone,
    JSEncrypt,
    File,
    JSZip
) {

    var generateKeys = function () {
        var keySize = parseInt(2048);
        var crypt = new JSEncrypt.JSEncrypt({default_key_size: keySize});
        var dto = {};
        dto.privateKey = crypt.getPrivateKey();
        dto.publicKey = crypt.getPublicKey();
        return dto;
    };

    var zipKeyPair = function (dto) {
        var zip = new JSZip();
        zip.file('priv.rsa', dto.privateKey);
        zip.file('pub.rsa', dto.publicKey);
        //img = zip.folder("images");
        //img.add("smile.gif", imgData, {base64: true});
        return zip.generateAsync({type: 'blob'});
    };

    return Backbone.Router.extend({
        initialize: function (options) {
            //this.model = chatModel;
        },

        routes: {
            "": "index",
        },

        index: function () {
            //$('#content').html('Select dialog');
            $('#generate').click(function () {
                $('#content').html('Generating...');
                var dto = generateKeys();
                zipKeyPair(dto).then(function (zipContent) {
                    var btn = $('#downloadZip');
                    //File.assign(btn, 'key.zip', zipContent);
                    btn.click(function () {
                        File.downloadContent('key.zip', zipContent);
                    });
                });
                var out = dto.privateKey+ "\n\n" + dto.publicKey;
                out = '<code style="font-size: 9px;"><pre>' + out + '</pre></code>';
                $('#content').html(out);
            });

        },

    });

});
