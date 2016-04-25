

Template.includeCategory.created = function() {
	this.templateDictionary = new ReactiveDict();
	this.templateDictionary.set( 'stateControl', {isEdit : false, allowEdit : true} );
};

Template.includeCategory.events({
    "click .button-edit": function (event, template) {
    	var state = template.templateDictionary.get( 'stateControl');
    	state.isEdit = true;
    	template.templateDictionary.set( 'stateControl', state);
    },

    "click .button-done": function (event, template) {
    	var state = template.templateDictionary.get( 'stateControl');
    	state.isEdit = false;
    	template.templateDictionary.set( 'stateControl', state);
    },


     "click .button-add": function (event, template) {
    	Modal.show('modalCategory');
    }    
});


Template.includeCategory.helpers({
	isEdit : function(){
		return Template.instance().templateDictionary.get( 'stateControl').isEdit;
	}
});