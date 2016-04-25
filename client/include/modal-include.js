var CategoryEntity = {
	constructEntity : function(){
		var self = this;
		self.name = '123';
		self.description = '';
		self._id = null;
		return self;
	} 
};


Template.modalCategory.onCreated = function(){
	console.log('onCreate');
	this.dictionary = new ReactiveDict();
	this.dictionary.set('item' , new CategoryEntity.constructEntity());
};



Template.modalCategory.events({
    "click .action-submit": function (event, template) {
    	
    	console.log(template.dictionary.get('item'));


    }
});





Template.modalCategory.helpers({
    item : function () {
    	console.log('helpers');
    	return  Template.instance().dictionary.get( 'item');
    }   
});
