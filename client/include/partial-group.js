if (Meteor.isClient) {
	Template.includeHeader.rendered = function () {
		
	}
}


Template.includeNagivation.onCreated(function(){
//	console.log(Router.current());
//	console.log(Router.current().route.path(this))
//	$('.dropdown-toggle').dropdown();
//	$('.user-drop').click(function(){});
//
});


Template.includeNagivation.onRendered(function(){
    $('.dropdown-toggle').dropdown()
});

Template.includeNagivation.helpers({
	'menuHighlightState' : function(text){
		return  Spacebars.SafeString(   (Router.current().route.options.context == text) ? 'active' : '' );
	}
});


Template.includeNagivation.events({
	'click .sign-in-btn' : function(event,template){
		Modal.show('userSecurity');
	},

	'click #user-dropdown' : function(event, template){
		if($('#user-dropdown').hasClass('open'))
			$('#user-dropdown').removeClass('open');
		else
			$('#user-dropdown').addClass('open');
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
	}
});


Template.includeHeader.onRendered(function(){
    $('.dropdown-toggle').dropdown();
});









