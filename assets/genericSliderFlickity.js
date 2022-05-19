/**
 * Flickity slider - https://flickity.metafizzy.co/
**/
'use strict';

class GenericSliderFlickity {
	constructor(container, type, id) {
		this._container 		= container;
		this._type 				= type;
		this._id 				= id;

        // SELECTORS
		this._selectors = {
			slider				: '[data-generic-slider]'
		};
		
		// ELEMENTS
		this.sliders			= this._container.querySelectorAll(this._selectors.slider);
		this.flkty				= [];
		
		// SLIDER OPTIONS
		this.sliderOptions = {
			// options
			cellAlign: 'center',
			contain: true,
			accessibility: false,
			watchCSS: true,
			percentPosition: false,
			arrowShape: { 
				x0: 10,
				x1: 80, y1: 70,
				x2: 85, y2: 65,
				x3: 20
			}
		};

		// CHECK IF HERO SLIDER EXISTS
		if (!this.sliders.length) return;
		
		// INIT
		this.sliders.forEach((slider, id) => this.initSlider(slider, id));
	}
	
	/**
	 * Initialize each slider
	 *
	 * @param {DOM} slider
	 * @param {Integer} id
	 *
	**/
	initSlider(slider, id) {
		const loop = (this.sliders[id].getAttribute('data-loop') === 'false') ? false : true,
		  freeScroll = (this.sliders[id].getAttribute('data-free-scroll') === 'true') ? true : false,
		  wheel = (this.sliders[id].getAttribute('data-wheel') === 'true') ? true : false,	
		  arrowShape = (this.sliders[id].getAttribute('data-arrow-shape')) ? true : false,
		  groupCells = (this.sliders[id].getAttribute('data-group-cells')) ? true : false,
		  options = Object.assign(this.sliderOptions, {
			pageDots: (this.sliders[id].getAttribute('data-dots') === 'false') ? false : true,
			prevNextButtons: (this.sliders[id].getAttribute('data-arrows') === 'false') ? false : true,
			freeScroll: freeScroll,
			wrapAround: loop,
			groupCells: groupCells
		});
		
		// Arrow Shape
		if (arrowShape)
			options.arrowShape = this.sliders[id].getAttribute('data-arrow-shape');
		
		this.flkty[id] = new Flickity(this.sliders[id], options);
		window.addEventListener('resize', (e) => this.resizeSlider(id));

        // PATCH iOS 15 horizontal drag bug
		this.flkty[id].on('dragStart', () => (document.ontouchmove = (e) => e.preventDefault()));
		this.flkty[id].on('dragEnd', () => (document.ontouchmove = () => true));
        
		// Check for Offset Arrows Position
		if (this.sliders[id].getAttribute('data-offset-arrows') === 'true')
			this.offsetArrows(id);
			
		// Wheel control
		if (wheel)
			this.wheelControl(id);
	}
	
	
	/**
	 * Wheel control
	 * Control the scroll with mouse wheel / magic mouse
	 *
	 * @param {Integer} id 
	 *
	**/
	wheelControl(id) {
		const flkty = this.flkty[id];
		
		flkty.element.addEventListener('wheel', (e) => {
			if (e.deltaX > 5) {
				e.preventDefault();
				flkty.next();
			} else if (e.deltaX < -5) {
				e.preventDefault();
				flkty.previous();
			}
		});
	}
	
	
	/**
	 * Offset Arrows
	 * Move arrows up to align with the image
	 * regardless of the real slide height
	 *
	 * @param {Integer} id
	 *
	**/
	offsetArrows(id) {
		if (!this.flkty[id].slides || !this.flkty[id].slides.length) return;
		
		const slideHeight = this.flkty[id].slides[0].height,
		  imageWrapper = this.sliders[id].querySelector('.lazywrapper'),
		  imageHeight = (imageWrapper.style.height | imageWrapper.clientHeight) || null,
		  buttons = this.sliders[id].querySelectorAll('button.flickity-button');
		
		// Define the translateY to center on Image
		if (!imageHeight || !buttons.length) return;
		
		buttons.forEach((button) => { 
			const style = window.getComputedStyle(button),
			  h = parseInt(style.getPropertyValue('height'));
			
			button.style.top = (imageHeight/2)+(h/2)+'px';
		});
	}
	
	
	/**
	 * Resize Slider
	 *
	 * @param {Integer} id
	 *
	**/
	resizeSlider(id) {
		this.flkty[id].resize();
	}
}


// Export to theme namespace
window.theme.GenericSliderFlickity = GenericSliderFlickity;

//Init Hero Slider
(function () {
    const flickityContainer = document.querySelector(".generic-slider-flickity");
    const flickityType = "genericFlickitySlider";
    const flickityId = flickityContainer.getAttribute('data-section-id');
    new window.theme.GenericSliderFlickity(flickityContainer, flickityType, flickityId);
})();
