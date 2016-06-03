CONSTANT = {
	SESSION : {
		CART : 'cart',
		STATE_CONTROL : 'stateControl'
	},
	METHOD : {
		CART : {
			GENERATE_CART : 'cart.generateCart',
			ADD_ITEM : 'cart.addItem',
			DELETE_ITEM : 'cart.deleteItem',
			BULK_UPDATE : 'cart.bulkUpdate',
			MERGE_CART : 'cart.mergeCart'
		},
		SECURITY : {
			SIGN_UP : 'security.signup',
			SIGN_IN : 'security.signin'
		}
	},
	DEFAULT_PARAM : {
		TOUCHSPIN : {min:1 , max : 50}
	},
	ROLE : {
		ADMIN : 'admin'
	}
};


SecurityUtil = {
	
	generateState : function(template){
		if(!template.templateDictionary)
			template.templateDictionary = new ReactiveDict();

		var stateControl = {isEdit : false , isAllowEdit : false}
		if(Meteor.user()){
			if(Roles.userIsInRole(Meteor.user()._id, [CONSTANT.ROLE.ADMIN]))
				stateControl.isAllowEdit = true;
		}
		template.templateDictionary.set(CONSTANT.SESSION.STATE_CONTROL , stateControl);
	},

	enableEdit : function(template){
		var stateControl = template.templateDictionary.get(CONSTANT.SESSION.STATE_CONTROL);
		if(stateControl.isAllowEdit)
			stateControl.isEdit = true;
		template.templateDictionary.set(CONSTANT.SESSION.STATE_CONTROL , stateControl);

	},

	disableEdit : function(template){
		var stateControl = template.templateDictionary.get(CONSTANT.SESSION.STATE_CONTROL);
		stateControl.isEdit = false;
		template.templateDictionary.set(CONSTANT.SESSION.STATE_CONTROL , stateControl);
	},

	getStatecontrol : function(template){
		return template.templateDictionary.get(CONSTANT.SESSION.STATE_CONTROL);
	},

	role : {
		isWebAdmin : function(userId){
			if(!(typeof userId === "undefined") )
				return (!userId) ? false : Roles.userIsInRole(userId, [CONSTANT.ROLE.ADMIN]);
			else
				return (!Meteor.user()) ? false : ( Roles.userIsInRole(Meteor.user()._id, [CONSTANT.ROLE.ADMIN]) );
		}

	}

}

CartUtil = {
	generate : function(callback){
		if(!Session.get(CONSTANT.SESSION.CART)){
			Meteor.call(CONSTANT.METHOD.CART.GENERATE_CART, function(error,result){
                if(error)
                    WebUtil.notify.error(error.reason);
                else{
                	Session.setPersistent(CONSTANT.SESSION.CART,result);
                	if (typeof callback === "function") 
                		callback();
                }
                	
                
            });
		}
	},

	getId : function(){
		return (Session.get(CONSTANT.SESSION.CART)) ? Session.get(CONSTANT.SESSION.CART) : null;
	},

	deleteItem : function(code){
		var params = {
            cartId : CartUtil.getId(),
            code : code
        };
        Meteor.call(CONSTANT.METHOD.CART.DELETE_ITEM,params, function(error,result){
             if(error){
                    WebUtil.notify.error(error.reason);
                }else{
                    WebUtil.notify.success('Record successfully updated');
                }
        });
		
	},
	bulkUpdate : function(items){
		var params = {
			cartId : CartUtil.getId(),
            items : items
		}
		Meteor.call(CONSTANT.METHOD.CART.BULK_UPDATE,params, function(error,result){
             if(error){
                    WebUtil.notify.error(error.reason);
                }else{
                    WebUtil.notify.success('Record successfully updated');
                }
        });

	},
	addToCart : function(code , value ){
		var params = {
            cartId : CartUtil.getId(),
            code : code,
            value : value
        };

		Meteor.call(CONSTANT.METHOD.CART.ADD_ITEM,params, function(error,result){
             if(error){
                    WebUtil.notify.error(error.reason);
                }else{
                    WebUtil.notify.success('Record successfully updated');
                }
        });
	}
};



WebUtil = {

	CONSTANT : {
		CURRENT_PATH : 'CURP',
		PAGINATION : {
			RECORD_LIMIT : 3,
			PAGE_LIMIT : 3
		},
	},


	getCurrentController : function () {
	  return Router && Router.current();
	},

	getCurrentParams : function () {
		var controller = WebUtil.getCurrentController();
		return controller && controller.getParams();
	},

	getCurrentRoute : function () {
		//var absPath = Meteor.absoluteUrl();
		//var url = WebUtil.getCurrentController().url;
		//console.log(WebUtil.getCurrentController().path);

		//if(url.indexOf(absPath) > -1)
		//	url = url.substring(0,absPath.length)
		
		return WebUtil.getCurrentController().location.get().path;
	},

	getBlankIfEmpty : function(item, name){
		if(!item || !item[name])
			return '';

		return (!(item[name] instanceof HTMLElement) ) ? item[name] : (  (item[name].value) ? item[name].value : '' );
	},

	getZeroIfEmpty : function(item, name){
		if(!item || !item[name])
			return 0;

		return (!(item[name] instanceof HTMLElement) ) ? item[name] : (  (item[name].value) ? item[name].value : 0 );
	},

	isPriceFormat : function(value){
		//var expression = ;
		return /^[0-9]+\.?[0-9]*$/.test(value);
	},

	isEmail : function(text){
		var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
		///^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
		return regex.test(text);
	},
	

	isEmpty : function(text){
		return (!text || 0 === text.length);
	},

	castArrayToHtmlList : function(text){
		var message = '';
		if(Array.isArray(text))
			message='<ul><li>'+text.join('</li><li>')+'</li></ul>';
		else
			message = text;

		return message;
	},

	extractSplashImage : function(item){
		var url = '';
	    if(!item.images)
	        return url;

	    var url;
	    var image = _.find(item.images,function(image){
	        return (image.splash =='Y');
	    });

	    return (image) ? image.path : (item.images && item.images.length > 0) ?  item.images[0].path : 'no image';

	},

	notify : {
		error : function(text){
			GROWL.error(WebUtil.castArrayToHtmlList(text));
		},
		success : function(text){
			GROWL.success(WebUtil.castArrayToHtmlList(text));
		},
		info : function(text){
			GROWL.info(WebUtil.castArrayToHtmlList(text));
		}
	},

	menuPath : {
		isHome : function(url){
			return (url === '/' || url.startsWith('/home'))
		},
		isCatalogue : function(url){
			return (url.startsWith('/catalogue'));
		}
	}


};

Exception = {
	validation : function(message){
		this.message = message;
	}
};







