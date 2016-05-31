
Template.cart_preview.helpers({
	'carts' : function(){
		return Carts.findOne();
	}

});


Template.cart_preview.onRendered(function(){
	var self = this;
	self.autorun(function(){
		Carts.findOne();
		Meteor.defer(function(){
			if ($('.input-qty').exist()) 
				$('.input-qty').TouchSpin();
		});
		
	});
	
});