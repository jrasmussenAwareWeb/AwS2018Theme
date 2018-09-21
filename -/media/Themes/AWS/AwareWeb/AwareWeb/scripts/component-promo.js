XA.component.promo = (function($) {
    $('.promo-work').focusin(function() {
        $(this).focus();
    });
    $('.promo-work').on('click','.promo-body, img, .promo-hover', function(){
        $(this).parents('.promo-work').toggleClass('focus').focus();
    });
    $('.promo-work').on('mouseleave', function() {
        $(this).removeClass('focus');
    });
})(jQuery, _);

XA.register("promo", XA.component.promo);