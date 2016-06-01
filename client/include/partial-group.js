if (Meteor.isClient) {
	Template.includeHeader.rendered = function () {
		
		
		
	}
}


Template.includeNagivation.onCreated(function(){
//	console.log(Router.current());
//	console.log(Router.current().route.path(this))
});

Template.includeNagivation.helpers({
	'menuHighlightState' : function(text){
		return  Spacebars.SafeString(   (Router.current().route.options.context == text) ? 'active' : '' );
	}
});


Template.includeHeader.helpers({
	'carts' : function(){
		return Carts.findOne();
	}

});


Template.includeHeader.events({
	'click #cart-header' : function(event, template){
		if($('#cart-header').hasClass('open'))
			$('#cart-header').removeClass('open');
		else
			$('#cart-header').addClass('open');
			
		//return Carts.findOne();
	}

});



Template.includeHeader.onRendered(function(){
    $('.dropdown-toggle').dropdown()

});









