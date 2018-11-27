/**
AWS Card Stack Gallery - jQuery Plugin
Author: Justin Herrera <jherrera@awareweb.com>
Author Notes: This is developed with the intention to work with a specific codebase that AWS controls.
Version: 1.1
**/

(function($){
	// Private Variables
	var _AWSCardStackInitialized = false;

	/**
	 * Tabs
	 * 
	 * @param options JSON obj; options set via JS
	 */
	$.fn.awsCardStack = function(options){

		/**
		 * Plugin Constructor
		 * 
		 * @param {jQuery selector} container; gallery wrapper
		 * @param {JSON obj} options; options set via JS
		 */
		var CardStack = function(container, options){
			this.container = $(container);
			this.options = options;
			this.metadata = this.container.data('options'); // options set via HTML
			this.timer = null;
			this.imagecounter = 0;
		}

		// Plugin Prototype
		CardStack.prototype = {
			settings:{
				activeClass: 'active', // class to highlight current heading/image
				autoplay: true, // enable this to run like a carousel
				breakpoint: 640, // point where gallery turns into a slideshow when window width is smaller than this
				callbackCycled: false, // callback triggered after gallery rotates
				headings: 'div.headings', // container that houses headings
				images: 'div.images', // container that houses images
				pager: 'div.pager', // container that houses pager, assumes ul li
				scaleDifference: 40, // percentage difference between largest image and smallest image
				speed: 6000 // time in ms each slide takes before transitioning to new one
			},

			// Init fired after checkImageLoad completes
			init: function(){
				var _This = this,
					_Config = _This.config,
					oContainer = _This.container;

				// Call Scale Images if window size isn't 'mobile'
				_This.scaleImages();

				// Hover over headings, highlight image
				oContainer.find(_Config.headings).on('mouseover focus', 'a', function(e, isSequential){
					var oThis = $(this),
						sTarget = oThis.data('target'),
						oTarget = $(sTarget),
						sActiveClass = _Config.activeClass;

					// Rotate Images
					_This.cycleImages(oThis, oTarget, isSequential);

					// Update Highlight Class
						// Headings
						oThis.parent().addClass(sActiveClass).siblings().removeClass(sActiveClass);

						// Pager
						oContainer.find(_Config.pager).find('li[data-target="'+ sTarget +'"]').addClass(sActiveClass).siblings().removeClass(sActiveClass);

						// Image
						oTarget.addClass(sActiveClass).siblings().removeClass(sActiveClass);

					// Reset Timer
					if(_Config.autoplay){ _This.handleAutoplay(e.type); }
						
					// Fire callback function
					if(_Config.callbackCycled){_This.handleCallback(_Config.callbackCycled, [oThis]);}
				})

				// Click on Non-Active image/pager to bring to front
				oContainer.find(_Config.images).add(_Config.pager).on('click', 'a, span', function(e){
					var oThis = $(this),
						oParent = oThis.closest('li'),
						sTarget = oThis[0].nodeName == 'SPAN' ? oParent.data('target') : '#' + oParent.attr('id');

					if(!oParent.hasClass(_Config.activeClass)){

						$(_Config.headings).find('a[data-target="'+ sTarget +'"]').trigger('mouseover');

						e.preventDefault();
					}
				});

				// Resize
				$(window).on('resize', function(){
					_This.scaleImages();
				});

				// Start autoplay
				if(_Config.autoplay){ _This.handleAutoplay(null, true); }

				// Set plugin to enabled/initialized
				_AWSCardStackInitialized = true;
				oContainer.addClass('awsInitialized');

				return this;
			},

			/**
			 * Calculate Image Spacing
			 * 
			 * @param  {jQuery obj} oImage; element image that needs to be positioned
			 * @param  {int} index; image's index
			 * @return {int} iPosition; position from right this image should be
			 */
			calculateImageSpacing: function(oImage, index){
				var oImageContainer = oImage.closest(this.config.images),
					oFirstImage = oImageContainer.find('img:eq(0)'),
					oPreviousImage = oImageContainer.find('img:eq('+ (index-1) +')'),
					iEmptySpace = oImageContainer.width() - oFirstImage.width(),
					iPosition = 0;

				// No need to perform any calcuations on first image
				if(index > 0){
					iPosition = ((oPreviousImage.width() - oImage.width()) + (iEmptySpace / (oImageContainer.find('li').length - 1))) * index;
				}

				return iPosition;
			},

			// Check Image Load
			checkImageLoad: function(){
				var _This = this,
					// initial setting of settings here instead of init
					_Config = _This.config = _This.setConfiguration(), 
					oContainer = _This.container,
					iImages = oContainer.find(_Config.images).find('img').length;

				// Run through all images to verify they are loaded
				$.each(oContainer.find(_Config.images).find('img'), function(){

					if(this.complete){
						_This.imagecounter++;
					}else{
						// Create load events
						$(this).on('load', function(i){
							_This.imagecounter++;

							// Initialize if all images are loaded
							if(_This.imagecounter == iImages){_This.init();}
						});
					}
				});

				// Initialize if all images are loaded
				if(_This.imagecounter == iImages){_This.init();}
			},

			/**
			 * Cycle Images
			 * 
			 * @param  {jQuery obj} oTrigger; element that triggered rotate
			 * @param  {jQuery obj} oTarget; element that becomes 'highlighted'
			 * @param  {boolean} isSequential; tells us the event is autoran and doesn't require a full reset
			 */
			cycleImages: function(oTrigger, oTarget, isSequential){
				var _Container = this.container,
					_Config = this.config,
					oImages = _Container.find(_Config.images),
					iCurrentHighlightImage = oImages.find('.' + _Config.activeClass),
					iCurrentHighlightHeading = _Container.find(_Config.headings).find('a[data-target="#'+ iCurrentHighlightImage.attr('id') +'"]').parent(),
					iCurrentHighlightHeadingIndex = iCurrentHighlightHeading.index(),
					iTargetCurrentIndex = oTarget.index();

				// Rotate Images in Order || Reverse
				if(iCurrentHighlightHeadingIndex < oTrigger.parent().index() || isSequential){
					// Loop backwards thru index
					for(var i = 0; i < iTargetCurrentIndex; i++){
						oImages.find('li:eq(0)').detach().appendTo(oImages.find('ul')).css({
							'zIndex': parseInt(oImages.find('li:last-child').prev().css('z-index')) - 1,
							'right': _Container.data('lastposition')
						});
					}
				}else if(iCurrentHighlightHeadingIndex > oTrigger.parent().index()){
					// Loop backwards thru index
					for(var i = 0; i <= ((oImages.find('li').length - 1) - iTargetCurrentIndex); i++){
						oImages.find('li:last-child').detach().prependTo(oImages.find('ul')).css({
							'zIndex': parseInt(oImages.find('li:first-child').next().css('z-index')) + 1,
							'right': 0
						});
					}
				}

				// Call Scale Images
				this.scaleImages();
				
			},

			// Handle Autoplay
			handleAutoplay: function(event, isForceStart){
				var _This = this,
					_Config = _This.config,
					_Container = _This.container;

				// Clear Timer
				clearTimeout(_This.timer);

				// Set Up Timeout as long as user isn't using keyboard to navigate
				if(event == 'mouseover' || isForceStart){
					_This.timer = setTimeout(function(){
						var oHeadings = _Container.find(_Config.headings),
							oActiveImage = oHeadings.find('li.' + _Config.activeClass);

						// Perform different action depending on if at the end or not
						if(oHeadings.find('li:last-child').hasClass(_Config.activeClass)){
							oHeadings.find('li:first-child').find('a').trigger('mouseover', [true]);
						}else{
							oActiveImage.next().find('a').trigger('mouseover');
						}
					}, _Config.speed)
				}
			},

			/**
			 * Handle Callback
			 *
			 * @param {str | function} callback; event or callback function to trigger
			 * @param {array} data; data to be passed to callback
			 * @param {obj} target; optional element to trigger event on
			 */
			handleCallback: function(callback, data, target){
				var oTarget = typeof target == 'undefined' ? this : target;

				// Run Callback
				typeof callback == 'function' ? callback.apply(this, data) : oTarget.trigger(callback, data);
			},

			/**
			 * Parse Options
			 * 
			 * @param {str} $options; data-options attribute consisting of key: value; pairs
			 */
			parseOptions: function(options){
				var oParsed = [];

				// Parse if options are present
				if(options){
					options = options.split(';');

					// Cycle thru
					$.each(options, function(index, option){
						option = $.trim(option);

						// Verify there is an option
						if(option !== ''){
							// Split property by ':' for JSON
							option = option.split(':');

							// Create new key/value varaibles and trim white space and adjoin extra ':' (urls)
							var key = $.trim(option.shift()),
								value = $.trim(option.join(':'));

							// Allow booleans
							switch(value){
								case 'true': case 'yes': value = true; break;
								case 'false': case 'no': value = false; break;
							}

							// Allow Numbers
							if(!isNaN(value) && typeof(value) != 'boolean'){
								value = parseFloat(value);
							}

							// Set key/value pair
							oParsed[key] = value;
						}
					});

					return oParsed;
				}
			},

			// Scale Images
			scaleImages: function(){
				var _This = this,
					_Container = this.container,
					_Config = _This.config,
					oImages = _Container.find(_Config.images).find('li'),
					iScaleStep = (_Config.scaleDifference/oImages.length)/100,
					iSpeed = 300;

				// Scale images down
				$.each(oImages, function(i){
					var oImage = $(this),
						iScale = i == 0 ? 0 : iScaleStep * i, // calculate how much to scale the image down
						iPosition = _This.calculateImageSpacing(oImage, i);

					// Initial Setup
					if(!_Container.hasClass('awsInitialized')){
						oImage.find('img').css({'transform': 'scale(1)'});
						oImage.css({'zIndex': 100000-i, 'right': 0})
					}

					// Scale Image
					oImage.find('img').css({
						'transform': 'scale('+ (1-iScale) +')'
					});

					// Set position
					oImage.stop().animate({
						'right': iPosition
					}, iSpeed);

					// Store Last Position
					_Container.data('lastposition', iPosition);
					
				});
			},

			// Set Configuration
			setConfiguration: function(){
				var tmpConfig = $.extend({}, this.settings, this.options, this.parseOptions(this.metadata));

				// Return object to configuration variable
				return tmpConfig;
			},
		}

		// Set Default Settings
		CardStack.settings = CardStack.prototype.settings;

		// Standard jQuery return for collections of elements triggering this plugin
		return this.each(function(){
			new CardStack(this, options).checkImageLoad();
		});
	}

	$('div.cardStack').awsCardStack();

}(jQuery));