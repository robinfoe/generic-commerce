Template.home.rendered = function(){
	if ($('.bxslider').exist()) {
	    $('.bxslider').bxSlider({
	        auto: true,
	        pause: 3000,
	        pager: false
	    });
	}
};