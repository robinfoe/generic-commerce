Router.configure({
  // the default layout
  layoutTemplate: 'mainLayout'
});  


Router.onBeforeAction(function(){
	this.next();
});



/** STATIC PAGE ********************************/
Router.route('/about');
Router.route('/policy');
Router.route('/terms');
Router.route('/shipping');
Router.route('/contact');

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
	context:'home',
	action: function(){
		if (this.ready()){
			this.render('home');
		}else{
		}
	}
});

/** CART ******************************/
Router.route('/cart' , {
	context:'cart',
	action: function(){
		if (this.ready()){
			this.render('cart_preview');
		}else{
		}
	}
});


/** CATALOGUE ******************************/
Router.route('/catalogue/page/:pageNo' , {
	context:'catalogue',
	action: function(){
		if (this.ready()){
			this.render('catalogue');
		}else{
		}
	}
});

Router.route('/catalogue/tag/:tagName/page/:pageNo' , {
	context:'catalogue',
	action: function(){
		console.log('re-set');
		console.log(this.params.tagName);
		if (this.ready()){
			this.render('catalogue');
		}else{
		}
	}
});


Router.route('/catalogue/preview/:productCode' , {
	context:'catalogue',
	waitOn: function () {
		return [
				Meteor.subscribe("productByCode",this.params.productCode),
				Meteor.subscribe("productTypeByCode",this.params.productCode)
		];
	},
	action: function(){
		if (this.ready()){
			this.render('catalogue_preview');
		}else{
		}
	}
});

Router.route('/catalogue/maintain/:productCode' , {
	context: 'catalogue',
	waitOn: function () {
		return [
			Meteor.subscribe("productByCode",this.params.productCode),
			Meteor.subscribe('categories'),
			Meteor.subscribe("productTypeByCode",this.params.productCode)];
	},
	action: function(){
		if (this.ready()){
			this.render('catalogue_maintain');
		}else{
		}

	}
});






/** Admin Setup ********************************/







