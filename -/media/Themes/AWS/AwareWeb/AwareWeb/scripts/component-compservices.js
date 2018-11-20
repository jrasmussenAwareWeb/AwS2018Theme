$(document).ready(function(){
    $('.comp-services').on('click', 'a.js-trigger', function(e){
        var oThis = $(this),
            oClasses = {
                trigger: 'js-isTriggered', // assigned to triggering button for style/js-hooks
                enlarge: 'enlarge', // assigned to oCircle when expanded
                active: 'isActive', // assigned to expanded service
                inactive: 'isNotActive', // assigned to hidden services
                revealed: 'isRevealed' // assigned to things that come into-visibility
            },
            oContainer = oThis.closest('.service'),
            oComponent = oContainer.closest('.comp-services'),
            oCircle = oComponent.find('span.bg-circle'),
            isMobile = getWidth() > 799 ? false : true;

        // Determine if Triggered or not
        if(!oThis.hasClass(oClasses.trigger)){
            // Position element behind the button
            oCircle.addClass(oClasses.enlarge);

            // On mobile, loosely-center circle, else line up with triggerer
            if(isMobile){
                oCircle.css({
                    top: 'calc(50% - 20px)',
                    left: 'calc(50% - 20px)'
                }).data({ // store location to 'close' into the circle on close
                    top: oThis.offset().top - oComponent.offset().top,
                    left: oThis.offset().left
                });
            }else{
                // Position circle based on user's click
                oCircle.css({
                    top: oThis.offset().top - oComponent.offset().top,
                    left: oThis.offset().left
                });
            }

            // Switch out active/inactive service sections
            oContainer.addClass(oClasses.active).siblings().addClass(oClasses.inactive);

            // Loop thru link-list cascading them visually in with class
            setTimeout(function(){
                var i = 0,
                    oTimer = setInterval(function(){
                        var oListItems = oComponent.find('.' + oClasses.active).find('li:eq('+ i+')');

                        if(oListItems.length > 0){
                            oListItems.addClass(oClasses.revealed);
                            i++;
                        }else{
                            clearInterval(oTimer);
                        }
                    }, 50);
            }, 200);

            // Scroll window
            if(isMobile){
                $('html,body').animate({
                    scrollTop: $('#comp-services').offset().top
                }, 250);
            }

            // Mark as Triggered
            oThis.addClass(oClasses.trigger);
        }else{					
            // Cause bg-circle to shrink
            oCircle.removeClass(oClasses.enlarge);

            // Reset position to where the button was located when opened so the bg circle collapses into the button
            if(isMobile){
                oCircle.css({
                    top: oCircle.data('top'),
                    left: oCircle.data('left')
                });
            }

            // Hide li's immediately
            oContainer.find('li').hide();

            // Remove updated styles/class once animation is finished
            setTimeout(function(){
                oContainer.find('li').removeClass(oClasses.revealed).removeAttr('style');
            }, 350);

            // Scroll window on mobile
            if(isMobile){
                setTimeout(function(){
                    $('html,body').animate({
                        scrollTop: $(oThis.attr('href')).offset().top
                    }, 250);
                }, 200);
            }

            // Remove classes so all services become visible
            oContainer.removeClass(oClasses.active).siblings().removeClass(oClasses.inactive);

            // Unmark as Triggered
            oThis.removeClass(oClasses.trigger);
        }

        e.preventDefault();
    }).on('mouseenter', 'a.js-trigger', function(e){
        var oThis = $(this),
            sClass = 'js-hovered';

        // Make sure 'js-hovered' cannot trigger multiple times resetting animation before it completes
        if(!oThis.hasClass(sClass)){
            oThis.addClass(sClass);

            // Remove class after it finishes animating
            setTimeout(function(){
                oThis.removeClass(sClass);
            }, 350);
        }
    });

    // Scroll Monitor (trigger pulse-effect on buttons when they appear)
    $.each($('.comp-services').find('div.service'), function(i){
        var oThis = $(this),
            oWatcher = scrollMonitor.create(oThis, -300),
            iServiceDelay = getWidth() > 799 ? i*200 : 200,
            iButtonDelay = getWidth() > 799 ? 1200 : 600;

        // Enter Viewport
        oWatcher.enterViewport(function(){
            // Fade in sections one at a time
            setTimeout(function(){
                oThis.addClass('isRevealed');
                oWatcher.destroy(); // we only want to trigger once, so destroy this watcher
            }, iServiceDelay);

            // Trigger all buttons at same time after services are loaded 
            setTimeout(function(){
                oThis.addClass('enableTransitions');
                oThis.find('a.js-trigger').trigger('mouseenter');
            }, iButtonDelay);
        });
    });
});

/*
 * Get Browser Width
 * @return {int} browser pixel width
*/
function getWidth(){
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}
