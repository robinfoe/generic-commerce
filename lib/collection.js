//*====== CATEGORIES ======*//
Categories = new Mongo.Collection("category",{idGeneration:'MONGO'});
Categories.before.insert(function (userId, doc) {
	delete doc._id;
	doc.createdDate = new Date();
});

Categories.before.update(function(userId, doc, fieldNames, modifier, options){
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = Date.now();
});



				
				


//*====== PRODUCTS ======*//
Products = new Mongo.Collection("product",{idGeneration:'MONGO'});
Products.before.insert(function (userId, doc) {
	delete doc._id;
	doc.createdDate = new Date();
});

Products.before.update(function(userId, doc, fieldNames, modifier, options){
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = Date.now();
});

ProductTypes = new Mongo.Collection("product_type",{idGeneration:'MONGO'});


//*====== SHOPPING CART ======*//
Carts = new Mongo.Collection("cart",{idGeneration:'MONGO'});
Carts.before.insert(function (userId, doc) {
	console.log(doc);
	delete doc._id;
	doc.createdDate = new Date();
});



/*
Categories.allow({
	insert: function (userId, doc) {return (Meteor.user()) ? true : false;},
	update: function (userId, doc, fields, modifier) {return (Meteor.user()) ? true : false;},
	remove : function(userId, document){return (Meteor.user()) ? true : false;}
});
*/
