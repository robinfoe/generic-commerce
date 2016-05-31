
Template.catalogue.onCreated(function(){

    var self = this;
    self.autorun(function(){

        WebUtil.getCurrentParams();
        
        self.templateDictionary = new ReactiveDict();
        self.templateDictionary.set( 'stateControl', {isEdit : false, allowEdit : true});
        
        var parameters = WebUtil.getCurrentParams();
        var filter = {};
        if(parameters.tagName)
            filter.tags = parameters.tagName;

        filter.pageNo = parameters.pageNo;

        self.subscribe('products', filter);
        self.subscribe('productsCount', filter);

       // console.log(Counts.get("productsCount"))

        
    });   
});

/** LISTING PAGE **************************/
Template.catalogue.events({
    "click .catalogue-button-edit": function (event, template) {
    	var state = template.templateDictionary.get( 'stateControl');
    	state.isEdit = true;
    	template.templateDictionary.set( 'stateControl', state);
    },

    "click .catalogue-button-done": function (event, template) {
    	var state = template.templateDictionary.get( 'stateControl');
    	state.isEdit = false;
    	template.templateDictionary.set( 'stateControl', state);
    },

    "click .catalogue-button-add": function (event, template) {
        Router.go('/catalogue/maintain/0');
    },
    "click .catalog-edit" : function(event,template){
        Router.go('/catalogue/maintain/'+event.target.getAttribute('data'));
    },

    'click .add-to-cart' : function(event,template){
        event.preventDefault();
        var params = {
            cartId : CartUtil.getId(),
            code : event.target.getAttribute('data'),
            value : 1
        }
        Meteor.call(CONSTANT.METHOD.CART.ADD_ITEM,params, function(error,result){
             if(error){
                    WebUtil.notify.error(error.reason);
                }else{
                    WebUtil.notify.success('Record successfully updated');
                }
        });
    },
});


Template.catalogue.helpers({
	isEdit : function(){
        return Template.instance().templateDictionary.get( 'stateControl').isEdit;
    },

    stateControl : function(){
        return Template.instance().templateDictionary.get( 'stateControl');
    },

    products : function(){
        return Products.find({});
    }
});




/** PREVIEW PAGE **************************/
Template.catalogue_preview.onCreated(function(){
    var self = this;
    self.templateDictionary = new ReactiveDict();
    self.set


    var item = new Schema.entity.product.construct(Products.findOne());
    var details = ProductTypes.find().fetch();
    if(details){
        _.each(details , function(detail){
            item.details.push(new Schema.entity.product_info.construct(detail));
        });
    }else{
        //construct the dummy list
        item.details.push(Schema.entity.product_info.constructDescription());
        item.details.push(Schema.entity.product_info.constructSpecification());
    }

    self.templateDictionary.set('item',item);
});

Template.catalogue_preview.onRendered(function(){

    if ($('.product-main-image').exist()) {
        $('.product-main-image').zoom();
    }

    if ($('.input-qty').exist()) {
        $('.input-qty').TouchSpin();
    }

});

Template.catalogue_preview.events({
    "click .image-thumb": function (event, template) {
        
        $('.product-main-image img').attr('src',event.target.getAttribute('src'));
        $('.product-main-image img').load(function(){
            $('.product-loader').hide();
        })

        
    }
});


Template.catalogue_preview.helpers({
    'item' : function(){
        return Template.instance().templateDictionary.get('item');
    }
});















/** MAINTAIN PAGE **************************/
Template.catalogue_maintain.onCreated(function(){
    var controller = Iron.controller();
    this.templateDictionary = new ReactiveDict();
    
    var state = {};
    state.isEdit = (controller.params.prodId != 0);
    this.templateDictionary.set( 'state', state);
    //this.subscribe("productById",controller.params.prodId ).wait();
    var item = Products.findOne();

    item = new Schema.entity.product.construct(Products.findOne());
    var details = ProductTypes.find({}).fetch();
    if(details){
        _.each(details , function(detail){
            item.details.push(new Schema.entity.product_info.construct(detail));
        });
    }else{
        //construct the dummy list
        item.details.push(Schema.entity.product_info.constructDescription());
        item.details.push(Schema.entity.product_info.constructSpecification());
    }
    
    this.templateDictionary.set('item',item);

});


Template.catalogue_maintain.onRendered(function(){
    var item = this.templateDictionary.get('item');
    $('.summernote').summernote();
    $('.select2-tags').select2();

    if(item.published == 'Y')
        $('#published').prop('checked',true);

    var init = new Switchery(document.querySelector('#published'));
   
});


Template.catalogue_maintain.events({
    "submit .form-catalogue-maintain": function (event, template) {
        event.preventDefault();
        var sessionItem = Template.instance().templateDictionary.get('item');
        
        var item = new Schema.entity.product.construct(event.target);
        item._id = sessionItem._id;
        item.tags = $('#tags').select2().val();
        item.published = (event.target.published.checked) ? 'Y' : 'N';
        item.images = sessionItem.images;

        var detailItem = Schema.entity.product_info.constructDescription();
        detailItem.text = $('#Description').summernote('code');
        item.details.push(detailItem);

        detailItem = Schema.entity.product_info.constructSpecification();
        detailItem.text = $('#Specifications').summernote('code');
        item.details.push(detailItem);

        Meteor.call('product.upsert',item, function(error,result){
                if(error){
                    WebUtil.notify.error(error.reason);
                }else{
                    WebUtil.notify.success('Record successfully updated');
                }

            });
    },

   
    "click .action-catalogue-back": function (event, template) {
        Router.go('/catalogue/');
    },


    'click .action-remove' : function(event, template){
        var item = template.templateDictionary.get('item');
        item.images.splice(event.currentTarget.getAttribute('data-value') , 1);
        template.templateDictionary.set('item',item);
    },

    'click .action-splash' : function(event, template){
        var item = template.templateDictionary.get('item');
        $.each(item.images, function(){
            this.splash='N'
        });

        item.images[event.currentTarget.getAttribute('data-value') ].splash='Y';
        template.templateDictionary.set('item',item);
    },
});



Template.catalogue_maintain.helpers({
    'item' : function(){
        return Template.instance().templateDictionary.get('item');
    },
    'tags' : function(){
        return Categories.find();
    },
    uploadCompleted : function(){
        var dict = Template.instance().templateDictionary;

        return {
            formData: function() { return new Schema.entity.product_image.construct();},
            finished: function(index, fileInfo, context) {
                var item = dict.get('item');
                var imageItem = new Schema.entity.product_image.construct();
                imageItem.path = fileInfo.baseUrl + fileInfo.path;
                item.images.push(imageItem);
                dict.set('item',item);
            }

        } 
    }
});


Template.catalogue_detail_general.helpers({
    'selectedTag' : function(item,name){
        return ( _.contains(item.tags, name) ) ? 'selected' : '';
    }

});









