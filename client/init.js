Meteor.startup(function() {
  Uploader.finished = function(index, file) {
  	GROWL.info('Information is updated with new image');
    Uploads.insert(file);
  };
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

