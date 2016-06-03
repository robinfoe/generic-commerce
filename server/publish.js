/** CATEGORIES ********************/
Meteor.publish('categories', function() {
	return Categories.find();
});

Meteor.publish('categoryById', function(id) {
	return  Categories.find({_id: id});
});


/** CARTS ********************/
Meteor.publish('cartByFilter', function(filter){ // filter should consist either id or username 
	filter = filter || {};
	// check is logged in....
	if(filter.id){
		filter._id = new Mongo.ObjectID(filter.id); 
		delete filter.id;
	}
	return Carts.find(filter);
});





/** PRODUCTS ********************/
Meteor.publish('productById', function(id) {
	//console.log(id);
	if(id != 0)
		id = new Mongo.ObjectID(id);
	
	return Products.find({_id: id});
});


Meteor.publish('productByCode', function(code) {
	return Products.find({code: code});
});

Meteor.publish('productTypeByCode', function(code) {
	var item = Products.findOne({code: code});
	if(item){
		return ProductTypes.find({productId : item._id});
	}
	return ProductTypes.find({productId : 0});
});



Meteor.publish('products', function(filter) {
	// todo :: if login is not admin, need to use publish  = true
	var offset = (filter.pageNo -1) * WebUtil.CONSTANT.PAGINATION.RECORD_LIMIT;
	delete filter.pageNo;
	filter = filter || {};
	//console.log(SecurityUtil.role.isWebAdmin());
	if(!SecurityUtil.role.isWebAdmin(this.userId))
		filter.published = 'Y';
	//if(Meteor.user())


	return Products.find(filter, {skip : offset , limit: WebUtil.CONSTANT.PAGINATION.RECORD_LIMIT, sort : {name : 1} });
});

Meteor.publish('productsCount', function(filter) {
	// todo :: if login is not admin, need to use publish  = true
	delete filter.pageNo;
	filter = filter || {};
	
	if(!SecurityUtil.role.isWebAdmin(this.userId))
		filter.published = 'Y';

	Counts.publish(this, 'productsCount', Products.find(filter));
//	return Products.find(filter);
});


