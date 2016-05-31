Meteor.methods({
	'cart.generateCart' : function(){
		var cart = new Schema.entity.cart.construct();
		delete cart._id;
		var itemId = Carts.insert(cart);
		itemId = String(itemId);
		console.log(itemId);



		return itemId;
	},

	'cart.addItem' : function(params){
		var cart = Carts.findOne({_id : new Mongo.ObjectID(params.cartId)});
		//var cart = Carts.findOne({_id : params.cartId});
		var item = Products.findOne({code : params.code});
		if(item){
			
			var index = -1;
			var currPtr = 0;

			_.each(cart.items , function(prod){
				if(prod.code == item.code)
					index = currPtr;

				currPtr++;
			})

			var cartItem = (index > -1) ? cart.items[index] : null;


			if(!cartItem)
				cartItem = {code : item.code, name : item.name , price : item.price, quantity : 0};
			
			cartItem.quantity += params.value;
			cartItem.totalPrice = cartItem.quantity * cartItem.price;

			if(index > -1)
				cart.items.splice(index,1);

			cart.items.push(cartItem);
			cart.items.sort(function(lhs, rhs){
				return (lhs.name < rhs.name) ?  -1 : ((lhs.name > rhs.name) ? 1 : 0);  
			});

			_.each(cart.items , function(item){
				cart.grandTotal += item.totalPrice;
			});

			Carts.update(cart._id, {$set : {
				items : cart.items,
				grandTotal :cart.grandTotal
				}
			});
		}
	}
});