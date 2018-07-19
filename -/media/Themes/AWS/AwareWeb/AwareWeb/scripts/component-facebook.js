XA.component.facebook = (function($, document) {

    var api = {};

    api.init = function() {
        var facebook = $(".fb-comments:not(.initialized)");

        facebook.each(function() {

            (function(d, s, id) {
                var js, body = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7";
                body.insertBefore(js, body.firstChild);
            }(document, 'body', 'facebook-jssdk'));

            $(this).addClass("initialized");
        });
    };

    return api;
}(jQuery, document));

XA.register("facebook", XA.component.facebook);