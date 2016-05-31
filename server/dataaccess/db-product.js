Meteor.methods({
	'product.getById' : function(id){
		Products.find({_id : new Mongo.ObjectID(id)}).fetch();
	},

	'product.upsert' : function(item){
		//console.log(item);
		var isAdd = (!item._id || 0 === item._id.length);
		var errors = [];
		if(WebUtil.isEmpty(item.code))
			errors.push('Please key in code');

		if(WebUtil.isEmpty(item.name))
			errors.push('Please key in name');

		if(WebUtil.isEmpty(item.price))
			errors.push('Please key in price');

		if(item.tags == null)
			errors.push('Please key in tags');


		if(errors.length > 0)
			throw new Meteor.Error('required-field','<ul><li>'+errors.join('</li><li>')+'</li></ul>');
		
		if(!WebUtil.isPriceFormat(item.price))
			throw new Meteor.Error('format-error','Please enter corrert format for Price, eg : 9999.99');


		var entity = Products.findOne({code : item.code});
		if(entity){
				// same name exist
				if(isAdd)
					throw new Meteor.Error('duplicate-name','Code exist within the system');

				if(entity._id._str != item._id)
					throw new Meteor.Error('duplicate-name','Code exist within the system');
		}

		var itemDetails = item.details;
		delete item.details;
		var id = null;
		


		var updateDetails = function(error,data){
			ProductTypes.remove({productId : data});
			_.each(itemDetails, function(prodDetail) {
				delete prodDetail._id;
				prodDetail.text = _.escape(prodDetail.text);
				prodDetail.productId = data;
				ProductTypes.insert(prodDetail);
			});

			
		};


		if(isAdd){
			delete item._id;
			Products.insert(item,updateDetails);
		}else{
			//console.log(item._id);
			//item._id = new Mongo.ObjectID(item._id);
				Products.update(item._id, {$set : { 
					code : item.code,
					name : item.name,
					stock : item.stock,
					price : item.price,
					status : item.status,
					shortDescription : item.shortDescription,
					published : item.published,
					tags : item.tags,
					images : item.images,
					updatedDate : new Date(),
				}}, updateDetails);
		}
	},

	'product.delete' : function(id){
		id = new Mongo.ObjectID(id);
		Products.remove(id);
	}
	
});