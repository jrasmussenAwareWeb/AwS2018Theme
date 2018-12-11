XA.component.headerWatcher = function($) {
    var api = {},
        $header = $('#header');

    function isScrolling() {
        $(document).on("scroll", function(){
           $(document).scrollTop() >= 70 ? $header.addClass('scrolling') : $header.removeClass('scrolling');
        });
    }
    
    api.init = function() {
        isScrolling();
    };
    
    return api;
}(jQuery);
XA.register("headerWatcher", XA.component.headerWatcher);