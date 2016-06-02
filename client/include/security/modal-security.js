var ModalSecurityState = {
	construct : function(){
		var self = this;
		self.isSignIn = true;
		self.isForgetPass = false;
		self.isSignUp = false;
		return self;
	},

	toggleSignIn : function(dictionary){
		var item = dictionary.get('state');
		item.isSignIn = true;
		item.isForgetPass = false;
		item.isSignUp = false;
		dictionary.set('state',item);
	},

	toggleSignUp : function(dictionary){
		var item = dictionary.get('state');
		item.isSignIn = false;
		item.isForgetPass = false;
		item.isSignUp = true;
		dictionary.set('state',item);
	},

	toggleForgetPass : function(dictionary){
		var item = dictionary.get('state');
		item.isSignIn = false;
		item.isForgetPass = true;
		item.isSignUp = false;
		dictionary.set('state',item);
	}



}


Template.userSecurity.onCreated(function(){
	this.templateDictionary = new ReactiveDict();
	this.templateDictionary.set('state' ,new ModalSecurityState.construct());
});

Template.userSecurity.events({
	'click .sign-in-page' : function(event,template){
		ModalSecurityState.toggleSignIn(Template.instance().templateDictionary);
	},
	'click .sign-up-page' : function(event,template){
		ModalSecurityState.toggleSignUp(Template.instance().templateDictionary);
	},
	'click .forget-pass-page' : function(event,template){
		ModalSecurityState.toggleForgetPass(Template.instance().templateDictionary);
	}
});


Template.userSecurity.helpers({
	'state' : function(){
		return Template.instance().templateDictionary.get( 'state');
	},

	'generateNavigationButton' : function(){
		var state = Template.instance().templateDictionary.get( 'state');
		var html = [];
		html.push('<button class="btn btn-success sign-in-page"> Sign In </button>');
		html.push('<button class="btn btn-primary forget-pass-page"> Forget Password ?</button>');
		html.push('<button class="btn btn-success sign-up-page"> Sign Up </button>');
		html.splice(  (state.isSignIn ? 0 : (state.isSignUp ? 2 : 1)  ) , 1);

		return Spacebars.SafeString(html.join(''));
	},

	'generateTitle' : function(){
		var state = Template.instance().templateDictionary.get( 'state');
		return Spacebars.SafeString(
						(state.isSignIn) ? 'Sign In' : (state.isSignUp) ? 'Sign Up' : 'Forget Password'
				);
	}
});




Template.userSecuritySignUp.events({
	'submit .signup-form' : function(event, template){
		event.preventDefault();
		var params = {
			email : event.target.email.value,
			password : event.target.password.value,
			name : event.target.name.value
		};
		
		Meteor.call(CONSTANT.METHOD.SECURITY.SIGN_UP,params, function(error,result){
            if(error)
                WebUtil.notify.error(error.reason);
            else{
            	WebUtil.notify.success('You have successfully registered.');
            	Modal.hide('userSecurity');
            }
        });
	}
});




Template.userSecuritySignIn.events({
	'submit .signin-form' : function(event, template){
		event.preventDefault();
		var email = event.target.email.value;
		var password = event.target.password.value;
		var errors = [];

		if(WebUtil.isEmpty(email))
			errors.push('Please Key in Email');

		if(WebUtil.isEmpty(password))
			errors.push('Please Key in Password');

		if(errors.length > 0){
			WebUtil.notify.error(errors);
			return;
		}
//		console.log(email);

		Meteor.loginWithPassword({username : email }, password, function(message){
			console.log(message);
      		if(message)
      			WebUtil.notify.error('Invalid Login Information');
      		else{
      			WebUtil.notify.success('Welcome !!! ');
            	Modal.hide('userSecurity');
      		}
      	});
	}

});