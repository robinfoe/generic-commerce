Meteor.startup(function() {

	$(window).bind('beforeunload', function() {
		Session.setPersistent('unloadTime', new Date().getTime());
	});

	$(window).bind('load' , function(){
		// 1. check is this refresh or close browser... 
		var unloadTime = Number(Session.get('unloadTime'));
		unloadTime = (isNaN(unloadTime)) ? 0 : unloadTime;

		if(  ( (new Date().getTime()) -  unloadTime ) > 10000) // 10 seconds think time... 
			Session.clearPersistent();
		
		//2. generate id if empty... 
		//Session.clearPersistent();
		CartUtil.generate();

	});

});


UI.registerHelper('parseToJson', function(context, options) {
  if(context)
  	return JSON.stringify(context);
});


/** NOTIFICATIONS ******************/
GROWL = {
	TYPE : {
		SUCCESS : 'success', INFO : 'info',WARN : 'warning' , ERROR : 'error'
	},

	dictionary : new ReactiveDict('message',null),

	show : function(title,message,type){
		toastr[type](message,title);
	},

	success : function(message){
		GROWL.dictionary.set('message',{title:'Success' , text : message , type : GROWL.TYPE.SUCCESS});
	},

	info : function(message){
		GROWL.dictionary.set('message',{title:'Info' , text : message , type :  GROWL.TYPE.INFO});
	},

	warn : function(message){
		GROWL.dictionary.set('message',{title:'Warning' , text : message , type :  GROWL.TYPE.WARN});
	},

	error : function(message){
		GROWL.dictionary.set('message',{title:'Error' , text : message , type :  GROWL.TYPE.ERROR});
	},
}




Tracker.autorun(function () {
  var message = GROWL.dictionary.get('message');
 // console.log(message);
  if(message != null ){// if(!(typeof message === 'undefined') || message != null ){
  	GROWL.show(message.title,message.text,message.type);
  	GROWL.dictionary.set('message',null)
  }
  	
 });

Tracker.autorun(function () {
	var cartId = Session.get(CONSTANT.SESSION.CART);
	if(cartId){
		var filter = {};
		filter.id = cartId;
		Meteor.subscribe('cartByFilter',filter);
	}
});




