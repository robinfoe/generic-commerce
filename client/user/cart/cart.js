
Template.cart_preview.helpers({
	'carts' : function(){
		//console.log(Template.instance().templateDictionary.get( 'cart'));
		return Template.instance().templateDictionary.get( 'cart');
	}

});


Template.cart_preview.events({
	'click .remove_cart' : function(event,template){
		CartUtil.deleteItem(event.target.getAttribute('data'));
	},
	'submit .form-cart' : function(event,template){
		event.preventDefault();
		var items = [];
		if(event.target.code.length){
			for(var i = 0; i < event.target.code.length; i++){
				items.push({code : event.target.code[i].value , quantity : event.target.quantity[i].value});
			}
		}else{
			items.push({code : event.target.code.value , quantity : event.target.quantity.value});
		}

		CartUtil.bulkUpdate(items);
	}
});


Template.cart_preview.onCreated(function(){
	var self = this;
	self.templateDictionary = new ReactiveDict();

	self.autorun(function(){
		Carts.findOne();
		self.templateDictionary.set('cart' , Carts.findOne());
	});
	
});


Template.cart_preview.onRendered(function(){
	var self = this;
	self.autorun(function(){
		Carts.findOne();
		Meteor.defer(function(){
			if ($('.input-qty').exist()) 
				$('.input-qty').TouchSpin(CONSTANT.DEFAULT_PARAM.TOUCHSPIN);
		});
		
	});
	
});