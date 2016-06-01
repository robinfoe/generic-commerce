var CartUtil = {

	getItemIndex : function(items,code){
		var ptr = 1;
		items.every(function(item){
			if(item.code == code)
				return false;
			
			ptr++;
		})
		return (ptr > items.length) ? -1 : (--ptr);
	},

	constructItem : function(params){ //code,name,price,quantity
		var item = {code : params.code, name : params.name , price : params.price, quantity : params.quantity, totalPrice : 0 };
		item.totalPrice = item.quantity * item.price;
		return item;
	},

	sortByname : function(lhs, rhs){
		return (lhs.name < rhs.name) ?  -1 : ((lhs.name > rhs.name) ? 1 : 0);  
	},



};
Meteor.methods({
	'cart.generateCart' : function(){
		var cart = new Schema.entity.cart.construct();
		delete cart._id;
		var itemId = Carts.insert(cart);
		itemId = String(itemId);
		
		return itemId;
	},

	/*
	cartId
	items[{code , quantity}]
	*/
	'cart.bulkUpdate' : function(params){
		var cart = Carts.findOne({_id : new Mongo.ObjectID(params.cartId)});
		cart.grandTotal = 0;
		_.each(params.items, function(item){
			var cartItem = _.find(cart.items,function(tmp){return tmp.code == item.code});
			cartItem.quantity = item.quantity;
			cartItem.totalPrice = cartItem.quantity * cartItem.price;

			cart.grandTotal += cartItem.totalPrice;
		});

		Carts.update(cart._id, {$set : {
				items : cart.items,
				grandTotal :cart.grandTotal
				}
		});
		

	},

	'cart.deleteItem' : function(params){
		var cart = Carts.findOne({_id : new Mongo.ObjectID(params.cartId)});
		cart.grandTotal = 0;
		var index = CartUtil.getItemIndex(cart.items, params.code);
		if(index > -1)
			cart.items.splice(index,1);

		_.each(cart.items , function(item){
				cart.grandTotal += item.totalPrice;
		});

		Carts.update(cart._id, {$set : {
				items : cart.items,
				grandTotal :cart.grandTotal
				}
		});
	},

	/*
	cartId
	items : [{code, quantity}]
	*/
	'cart.updateItems' : function(params){
		var cart = Carts.findOne({_id : new Mongo.ObjectID(params.cartId)});
		cart.grandTotal = 0;
		cart.items = [];

		_.each(params.items , function(item){
			var prodItem = Products.findOne({code : item.code});
			if(prodItem){
				var cartItem = CartUtil.constructItem({code : prodItem.code, name : prodItem.name, price : prodItem.price, quantity : item.quantity});
				cart.items.push(cartItem);
				cart.grandTotal += item.totalPrice;
			}
		});
		cart.items.sort(CartUtil.sortByname);
		Carts.update(cart._id, {$set : {
				items : cart.items,
				grandTotal :cart.grandTotal
				}
			});
	},

	'cart.addItem' : function(params){ // params consist of cartId, code , value
		var cart = Carts.findOne({_id : new Mongo.ObjectID(params.cartId)});
		var item = Products.findOne({code : params.code});
		if(item){

			var cartItem = _.find(cart.items, function(tmp){return tmp.code == params.code});
			
			if(!cartItem){
				cartItem = CartUtil.constructItem({code : item.code, name : item.name, price : item.price, quantity : 0});
				cart.items.push(cartItem);
			}

			cartItem.quantity += Number(params.value);
			cartItem.totalPrice = cartItem.quantity * cartItem.price;
			cart.items.sort(CartUtil.sortByname);
			
			cart.grandTotal = 0;
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