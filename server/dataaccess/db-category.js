Meteor.methods({

	'category.getById' : function(id){
		console.log("Calling Category.getById");
		return (!id) ?  null : Categories.find({_id : new Mongo.ObjectID(id)}).fetch();
	},
	'category.upsert' : function(item){
		// TODO :: find category by name
			var entity = Categories.findOne({name : item.name});
			var isAdd = (!item._id || 0 === item._id.length);
			
			// validation begin...
			if(entity){
				// same name exist
				if(isAdd)
					throw new Meteor.Error('duplicate-name','Name exist within the system');

				if(entity._id._str != item._id)
					throw new Meteor.Error('duplicate-name','Name exist within the system');

			}
			

			if(isAdd){
				delete item._id;
				Categories.insert(item);
			}else{
				item._id = new Mongo.ObjectID(item._id);
				Categories.update(item._id, {$set : { 
					name : item.name,
					seq : item.seq,
					child : item.child
				}});
			}

	},

	'category.delete' : function(id){
		id = new Mongo.ObjectID(id);
		Categories.remove(id);
	}
	
});