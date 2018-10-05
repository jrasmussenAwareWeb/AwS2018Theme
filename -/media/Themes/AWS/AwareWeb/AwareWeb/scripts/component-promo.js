XA.component.promo = (function($) {
    /*
    $('.promo-work').focusin(function() {
        $(this).focus();
    });
    $('.promo-work').on('click','.promo-body, img, .promo-hover', function(){
        $(this).parents('.promo-work').toggleClass('focus').focus();
    });
    $('.promo-work').on('mouseleave', function() {
        $(this).removeClass('focus');
    });
    */

    var pub = {};
    pub.init = function() {
        var $promos = $('.promo-work');
        $promos.each(function() {
            $(this).focusin(function() {
                $(this).focus();
            });
            $(this).on('click','.promo-body, img, .promo-hover', function(){
                $(this).parents('.promo-work').toggleClass('focus').focus();
            });
            $(this).on('mouseleave', function() {
                $(this).removeClass('focus');
            });
            $(this).addClass("initialized");
        });
    }

    return pub;
})(jQuery);
XA.register("promo", XA.component.promo);