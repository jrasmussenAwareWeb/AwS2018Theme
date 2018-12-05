XA.component.linklist = (function($) {
var api = {};	

	// jQuery reverse collection polyfill
	jQuery.fn.reverse = [].reverse;

	function getWidth(){
		return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}

	api.init = function() {
		$('div.component.trending').on('click', 'h3', function(e){
			var oThis = $(this),
				oContainer = oThis.closest('div.component-content'),
				oListItems = oThis.siblings('ul').find('li'),
				sOpenedClass = 'isMobileOpened',
				isOpen = oContainer.hasClass(sOpenedClass);

			// Don't proceed if not mobile
			if(getWidth() > 768){return;}
 
			// reverse array
			if(isOpen){oListItems.reverse();}

			// Run through list items and add/remove showing attribute
			$.each(oListItems, function(i){
				var oItem = $(this);

				setTimeout(function(){
					oItem.attr('data-animating', isOpen ? 'hide' : 'show');
				}, 150 * i);
			});

			// Toggle class
			oContainer.toggleClass(sOpenedClass);

			e.preventDefault();
		});
	};

	return api;
}(jQuery));

XA.register("linklist", XA.component.linklist);