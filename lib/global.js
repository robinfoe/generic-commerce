CONSTANT = {
	SESSION : {
		CART : 'cart'
	},
	METHOD : {
		CART : {
			GENERATE_CART : 'cart.generateCart',
			ADD_ITEM : 'cart.addItem'
		}
	}
};





CartUtil = {

	generate : function(){
		if(!Session.get(CONSTANT.SESSION.CART)){
			Meteor.call(CONSTANT.METHOD.CART.GENERATE_CART, function(error,result){
                if(error)
                    WebUtil.notify.error(error.reason);
                else
                	Session.setPersistent(CONSTANT.SESSION.CART,result);
                
            });
		}
	},

	getId : function(){
		return (Session.get(CONSTANT.SESSION.CART)) ? Session.get(CONSTANT.SESSION.CART) : null;
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







