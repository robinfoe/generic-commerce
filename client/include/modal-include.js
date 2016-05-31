
Template.modalCategory.onCreated (function(){
		var self = this;
		self.dictionary = new ReactiveDict();
        var item = Blaze.getData();
        self.dictionary.set('item' ,item);

        var state = {};
        state.isEdit = (item._id._str);
        state.isDeletePending = false;
        state.title = (!state.isEdit) ? 'Add' : 'Maintain';
        self.dictionary.set('state' ,state);
});

Template.modalCategory.onRendered(function(){
	this.$('#child').tagsinput('refresh');
});

Template.modalCategory.events({
    "submit .category-maintain": function (event, template) {
    	event.preventDefault();
    	var item = new Schema.entity.category.construct(event.target);
        item.child = $('#'+event.target.child.id).tagsinput('items');
        try{

    		if(WebUtil.isEmpty(item.name))
    			throw new Exception.validation('Please fill in name');

    		if(WebUtil.isEmpty(item.seq))
    			throw new Exception.validation('Please fill in Sequence');

    		Meteor.call('category.upsert',item, function(error,result){
                if(error){
                    WebUtil.notify.error(error.reason);
                }else{
                    WebUtil.notify.success('Record successfully updated');
                    Modal.hide('modalCategory');
                }

            });
    		
    	}catch(e){
    		WebUtil.notify.error(e.message);
    	}
    },

    'click .category-action-delete' : function(event,template){
        var state = template.dictionary.get('state');
        state.isDeletePending=true;
        template.dictionary.set('state',state);
    },

    'click .category-delete-proceed' : function(event,template){
        var item = Template.instance().dictionary.get('item');
        Meteor.call('category.delete',item._id._str, function(error,result){
            if(error)
                WebUtil.notify.error(error.reason);
            else{
                WebUtil.notify.success('Record successfully updated');
                Modal.hide('modalCategory');
            }

        });  
    },

    'click .category-delete-cancel' : function(event,template){
        var state = template.dictionary.get('state');
        state.isDeletePending=false
        template.dictionary.set('state',state);
    },

});

Template.modalCategory.helpers({
    item : function () {
    	return  Template.instance().dictionary.get('item');
    },

    childAsString : function(){
    	var item = Template.instance().dictionary.get('item');
    	return item.child.join(' , ');
    },

    stateControl:function() {
    	return  Template.instance().dictionary.get('state');
    }
});
