/* global XAContext:false, mejs:false */
XA.component.searchOverlay = function($) {

    var api = {},
        href = window.location.href,
        host = location.host,
        label,
        overlayPlaceholder = false;
        //marginTop = 100;

    function isPreviewMode() {
        if (href.indexOf("sc_mode=preview") > -1) {
            return true;
        }
        var $hdPageMode = $('#hdPageMode');

        return $hdPageMode.length > 0 && $hdPageMode.attr('value') == 'preview';
    }

    function isEditMode() {
        if (href.indexOf("sc_mode=edit") > -1) {
            return true;
        }
        var $hdPageMode = $('#hdPageMode');
        return $hdPageMode.length > 0 && $hdPageMode.attr('value') == 'edit';
    }

    function isOverlayPage() {
        return $('#wrapper').hasClass('overlay-page');
    }
    function hasOverlayContent() {
        return $(".searchOverlay").length;
    }
    /*
    function resizeOverlay(inner, content, options) {
        var unit = "px";
        var css = {
            "width": "",
            "height": ""
        };
        var wh = $(window).height();

        if (options.percent) {
            unit = "%";
            inner.addClass("overlay-percent");
            if (isEditMode()) {
                inner.addClass("edit")
            }
        } else {
            inner.removeClass("overlay-percent");
            if (isEditMode()) {
                inner.removeClass("edit")
            }
        }
        
        if (options.width) {
            css["width"] = options.width + unit;
        }
        if (options.height) {
            css["height"] = options.height + unit;
        }
        css["max-height"] = (wh - marginTop - 0.1 * wh) + "px";
        
        content.css(css);
    }
    */
    function getUrlVariables(url) {
        var q = url.split('?')[1],
            vars = [],
            hash;
        if (q != undefined) {
            q = q.split('&');
            for (var i = 0; i < q.length; i++) {
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }
        return vars;
    }

    function getSize(vars) {
        var obj = {};
        if (vars["width"] !== null) {
            obj["width"] = vars["width"];
        }
        if (vars["height"] !== null) {
            obj["height"] = vars["height"];
        }
        return obj;
    }

    function checkInternal(url) {
        if (url.indexOf(host) > -1) {
            return true;
        }
        return false;
    }

    function checkImage(url) {
        var ext = url.split("?")[0].split('.').pop();
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) > -1) {
            return true;
        }
        return false;
    }

    function loadOverlay(url, overlay) {
        var content = overlay.find(".overlay-inner"),
            //overlayContent = overlay.find(".component-content"),
            vars = getUrlVariables(url),
            internalLink = checkInternal(url),
            overlaySize = getSize(vars),
            suffix;
        content.removeAttr('style');

        if (internalLink) {
            if (checkImage(url)) {
                content.empty().append($("<img>", { src: url }));
                content.css(overlaySize);
                showOverlay(overlay);
            } else if (url.indexOf("overlaytype=iframe") > -1) {
                content.empty().append($("<iframe>", { src: url, style: "width: 100%; height: 100%" }));
                content.css(overlaySize);
                showOverlay(overlay);
            } else {
                if (isPreviewMode()) {
                    suffix = "cf_overlay=1";
                    url = url.replace("sitecore/shell/");
                    url += (url.indexOf("?") == -1 ? "?" : "&") + suffix;
                }
                $.get(url, function(data) {
                    /*var overlayData = $(data).before().first();
                    resizeOverlay(content, overlayContent, {
                        width: overlayData.attr("data-width"),
                        height: overlayData.data("height"),
                        percent: overlayData.data("percent")
                    });
                    */
                    content.empty().append(data);
                    XA.init();
                    showOverlay(overlay);
                });
            }
        } else {
            if (checkImage(url)) {
                content.empty().append($("<img>", { src: url }));
            } else {
                content.empty().append($("<iframe >", { src: url, style: "width: 100%; height: 100%" }));
            }
            content.css(overlaySize);
            showOverlay(overlay);
        }

    }

    function preShowOverlay(overlay) {
        //overlay.css({"opacity": 1}).show();
        overlay.addClass('open').show();
    }

    function showOverlay(overlay) {
        var i, q, links, close, content;
        //overlay.show().animate({opacity: 1});
        overlay.addClass('open').show();

        close = overlay.find(".overlay-close-link");
        setTimeout(function() { close.focus(); }, 0);
        links = overlay.find("a:not(.overlay-close-link)");
        i = 2;
        for (q = 0; q < links.length; q++) {
            $(links[q]).attr("tabIndex", i++);
        }
        content = overlay.find(".overlay-inner");
        content.attr("tabIndex", i);
        content.blur(function(args) {
            args.preventDefault();
            args.stopPropagation();
            setTimeout(function() { close.focus() }, 0);
        });

        XAContext.Tracking.track(
            XAContext.Domain.TrackingTypes().event, {
                category: "Overlay",
                event: "open",
                label: label,
                data: 0
            },
            "sync"
        );
        return overlay;
    }

    function hideOverlay(overlay) {
        var content = overlay.find(".overlay-inner");
        overlay.removeClass('open').hide();
        content.empty();

        if (mejs) {
            for (var p in mejs.players) {
                if ($("#" + mejs.players[p].id).parents(".overlay").length == 1) {
                    $("#" + mejs.players[p].id + ' video').attr('src', '');
                    mejs.players[p].remove();
                    mejs.players.splice(p, 1);
                }
            }
        }
        

        XAContext.Tracking.track(
            XAContext.Domain.TrackingTypes().event, {
                category: "Overlay",
                event: "close",
                label: label,
                data: 0
            },
            "sync"
        );
        return overlay;
    }

    function createOverlay() {
        var overlay = "<div class='search-wrap'>" +
            "<div class='overlay component'>" +
            "<div class='component-content'>" +
            "<div class='overlay-close'><a tabIndex='1' class='overlay-close-link' href='#'>×</a></div>" +
            "<div class='overlay-inner' tabIndex='2'></div>" +
            "</div>" +
            "</div>" +
            "</div>";

        $("body").append(overlay);
    }

    api.init = function() {
        var overlayContent,
            overlaySource,
            overlayInner,
            overlayCloseLink,
            closeAction,
            overlayClickSource;
        if (!overlayPlaceholder && hasOverlayContent()) {
            createOverlay();
        }

        if (isOverlayPage()) {
            var page = $(".overlay-page"),
                overlay = $("#spnOverlay");
                //content = overlayContent.children(".overlay-inner");
            overlayContent = page.children(".component-content");
            /*
            resizeOverlay(content, overlayContent, {
                width: overlay.data("width"),
                height: overlay.data("height"),
                percent: overlay.data("percent")
            });
            */
            overlayContent.on("click", function(event) {
                event.stopPropagation();
            });
            page.on("click", function() {
                if (isPreviewMode()) {
                    location.href = location.href.replace("sc_mode=preview", "sc_mode=edit")
                }
            });
        }
        overlay = $(".search-wrap > .overlay");
        overlayContent = overlay.find(".component-content");
        overlaySource = $(".searchOverlay a:not(.initialized), a.searchOverlay:not(.initialized)");
        overlayInner = $(".overlay-inner");
        overlayCloseLink = overlay.find(".overlay-close-link");
        closeAction;
        overlayClickSource;

        closeAction = function() {
            hideOverlay(overlay);
            overlayInner.off("blur");
            setTimeout(function() {
                if (overlayClickSource != null) {
                    //overlayClickSource.focus();
                }
            }, 0);
        };

        if (!overlayPlaceholder) {
            overlayContent.on("click", function(event) {
                event.stopPropagation();
            });

            overlay.on("click", function() {
                closeAction();
            });

            $("body").keyup(function(args) {
                args.stopPropagation();
                if (args.which == 27) {
                    closeAction();
                }
            });

            overlayCloseLink.on("click", function(args) {
                args.preventDefault();
                closeAction();
            });
            /*
            $(window).on("resize", function() {
                var height = $(window).height();
                height = height - marginTop - 0.1 * height;
                //overlayContent.css("max-height", height + "px");
            });
            */
            overlayPlaceholder = true;
        }


        overlaySource.each(function() {
            if (isEditMode()) {
                return;
            }

            $(this).on("click", function(event) {
                overlayClickSource = event.currentTarget;
                if (!isEditMode()) {
                    event.preventDefault();
                    event.stopPropagation();
                    preShowOverlay(overlay, overlayContent);

                    var uri = this.href;
                    loadOverlay(uri, overlay);

                    var href = this.href.split('/');
                    for (var i = 0; i <= href.length; i++) {
                        label = href.pop();
                        if (label.length == 0) {
                            continue;
                        }
                        break;
                    }
                }
            });

            // $(this).on('focus', function(args) {
            //     args.preventDefault();
            //     if (args.currentTarget === overlayClickSource) {
            //         overlayClickSource = null;
            //     }
            // });

            $(this).addClass("initialized");
        });


    };

    return api;

}(jQuery);

XA.register("searchOverlay", XA.component.searchOverlay);

/*
;(function(window) {

	'use strict';

	var mainContainer = document.querySelector('.main-wrap'),
		openCtrl = document.getElementById('btn-search'),
		closeCtrl = document.getElementById('btn-search-close'),
		searchContainer = document.querySelector('.search'),
		inputSearch = searchContainer.querySelector('.search__input');

	function init() {
		initEvents();	
	}

	function initEvents() {
		openCtrl.addEventListener('click', openSearch);
		closeCtrl.addEventListener('click', closeSearch);
		document.addEventListener('keyup', function(ev) {
			// escape key.
			if( ev.keyCode == 27 ) {
				closeSearch();
			}
		});
	}

	function openSearch() {
		mainContainer.classList.add('main-wrap--hide');
		searchContainer.classList.add('search--open');
		setTimeout(function() {
			inputSearch.focus();
		}, 500);
	}

	function closeSearch() {
		mainContainer.classList.remove('main-wrap--hide');
		searchContainer.classList.remove('search--open');
		inputSearch.blur();
		inputSearch.value = '';
	}

	init();

})(window);
*/