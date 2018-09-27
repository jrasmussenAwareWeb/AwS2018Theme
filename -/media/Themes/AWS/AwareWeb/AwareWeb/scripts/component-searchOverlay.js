XA.component.searchOverlay = function($) {
    var api = {},
        mainContainer = $('#wrapper'),
        searchContainer = $('#searchWrap > .component-content'),
        openCtrl = mainContainer.find('.searchOverlay a');
    
    function initEvents() {
        createOverlay();
        var closeCtrl = $('.search-overlay').find('.overlay-close');

        openCtrl.click(function(e) {
            e.preventDefault();
            openSearch();
        });

        closeCtrl.click(function(c) {
            c.preventDefault();
            closeCtrl.removeClass('show');
            closeSearch();
        });
        $("body").keyup(function(args) {
            args.stopPropagation();
            if (args.which == 27 || args.which == 13) {
                closeSearch();
            }
        });
    }

    function createOverlay() {
        var modal = "<div class='search-overlay'>" +
            "<div class='component-content'>" +
            "<div class='overlay-close'><a tabIndex='1' class='overlay-close-link' href='#'>×</a></div>" +
            "<div class='overlay-inner' tabIndex='2'></div>" +
            "</div>" +
            "</div>";

        $("body").append(modal);
    }

    function openSearch() {
        var modal = $('.search-overlay'),
            content = modal.find('.overlay-inner'),
            inputSearch = content.find('.search-box-input');
        content.append(searchContainer);
        modal.animate({opacity:1},100,
            function() {
                modal.addClass('search-open');
                content.addClass('content-open');
                modal.find('.overlay-close').addClass('show');
                mainContainer.addClass('wrap-hide');
            }
        );
        //modal.addClass('search-open');
        setTimeout(function() {
            inputSearch.focus();
        }, 500);
    }

    function closeSearch() {
        var modal = $('.search-overlay'),
            content = modal.find('.overlay-inner'),
            inputSearch = content.find('.search-box-input');     
        content.removeClass('content-open');
        modal.find('.overlay-close').removeClass('show');
        modal.animate({opacity:0},100,
            function() {
                modal.removeClass('search-open');
                mainContainer.removeClass('wrap-hide');
            }
        );
        inputSearch.blur();
        inputSearch.value = '';
    }

    api.init = function() {
        initEvents();
    };
    return api;
}(jQuery);
XA.register("searchOverlay", XA.component.searchOverlay);
