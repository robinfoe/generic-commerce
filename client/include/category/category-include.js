Template.includeCategory.onCreated(function(){
    this.templateDictionary = new ReactiveDict();
    SecurityUtil.generateState(this);
    //this.templateDictionary.set( 'stateControl', {isEdit : false, allowEdit : true} );
    this.subscribe("categories");
});



Template.includeCategory.events({
    "click .category-button-edit": function (event, template) {
        SecurityUtil.enableEdit(template);
       // var state = template.templateDictionary.get( 'stateControl');
        //state.isEdit = true;
    	//template.templateDictionary.set( 'stateControl', state);
    },

    "click .category-button-done": function (event, template) {
        SecurityUtil.disableEdit(template);
        //var state = template.templateDictionary.get( 'stateControl');
    	//state.isEdit = false;
    	//template.templateDictionary.set( 'stateControl', state);
    },

     "click .category-button-add": function (event, template) {
        Modal.show('modalCategory', new Schema.entity.category.construct());
    },

    "click .cat-category-edit" : function(event , template){
        Modal.show('modalCategory',Categories.findOne({_id : new Mongo.ObjectID(event.target.getAttribute('data')) }));
    },
    "click .cat-category-caret" : function(event,template){
        $(".cat-child").collapse('hide');
        $(event.target.getAttribute('data')).collapse('show');
    }


});


Template.includeCategory.helpers({
	isEdit : function(){
        return SecurityUtil.getStatecontrol(Template.instance()).isEdit;
    },
    stateControl : function(){
        return SecurityUtil.getStatecontrol(Template.instance());
    },
    categories : function(){
        return Categories.find();
    },

    generateCaret : function(item){
        return (item.child.length > 0) ?  Spacebars.SafeString('<i data="#'+item._id._str+'"  class="cursor-pointer fa fa-caret-down pull-right cat-category-caret"  ></i>') : '';
    },

    generateChild : function(item){
        if(item.child.length < 1)
            return '';

        var html = [];
        $.each(item.child, function(e,k){
            html.push('<a href="/catalogue/tag/'+k+'/page/1" class="list-group-item">'+k+'</a>');
        });
        var element = '<div id="'+item._id._str+'" class="collapse list-group-sub cat-child" >' + html.join('') + '</div>'
        return Spacebars.SafeString(element);
    },
    hasChild : function(item){
        return (item.child.length > 0);
    }


});