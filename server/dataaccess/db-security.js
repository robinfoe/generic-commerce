
Meteor.methods({

	'security.signup' : function(params){

		var errors = [];

		if(WebUtil.isEmpty(params.email))
			errors.push('Email is required');

		if(!WebUtil.isEmail(params.email))
			errors.push('Please key in correct email format eg : hello@hello.com');

		if(WebUtil.isEmpty(params.password))
			errors.push('Password is require');

		if(WebUtil.isEmpty(params.name))
			errors.push('Name is require');

		if(errors.length > 0)
			throw new Meteor.Error('required-field','<ul><li>'+errors.join('</li><li>')+'</li></ul>');
		


		var id = Accounts.createUser({
					username:params.email , 
					password:params.password,
					profile:{name:params.name , email : params.email}
				});

		Roles.addUsersToRoles(id, 'storeFrontUser'); 
	},

	'security.signin' : function(params){
		
		Meteor.loginWithPassword(params.email, params.password, function(message){
			console.log(message);
      		if(message)
      			throw new Meteor.Error('Error','Invalid Login Information');
      	});
	},


});
