Router.configure({
  // the default layout
  layoutTemplate: 'mainLayout'
});  


/*
Router.onBeforeAction(function(){
	var backendPrefix = "/backend";
	var backendLogin = backendPrefix+'/login'
	var isBackend = this.url.substring(0, backendPrefix.length) === backendPrefix;
	var isBackendLogin = this.url.substring(0, backendLogin.length) === backendLogin;

	if(isBackend && !isBackendLogin && !CREDENTIAL.isAdminUser())
		this.router.go(backendLogin);

	this.layout((isBackend) ? 'adminLayout': 'mainLayout');
	this.next();
});
*/

Router.route('/' , {
	action: function(){
		if (this.ready()){
			this.render('home');
		}else{
		}
	}
});



Router.route('/about' , {
	action: function(){
		if (this.ready()){
			this.render('about');
		}else{
		}
	}
});

Router.route('/policy' , {
	action: function(){
		if (this.ready()){
			this.render('policy');
		}else{
		}
	}
});


Router.route('/terms' , {
	action: function(){
		if (this.ready()){
			this.render('terms');
		}else{
		}
	}
});


Router.route('/shipping' , {
	action: function(){
		if (this.ready()){
			this.render('shipping');
		}else{
		}
	}
});

Router.route('/contact' , {
	action: function(){
		if (this.ready()){
			this.render('contact');
		}else{
		}
	}
});



