import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
	// create admin user.. 
	if(typeof Accounts.findUserByUsername('poly@admin') == 'undefined'){
    	var id = Accounts.createUser({username:'poly@admin' , password:'jarvis',profile:{name:'Polyplast'}});
    	Roles.addUsersToRoles(id, 'admin');
  	}


	var guidGenerator = {
		generate : function(s){
			var p = (Math.random().toString(16)+"000000000").substr(2,8);
        	return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
		},
		uniqueKey : function(){
			return guidGenerator.generate() + guidGenerator.generate(true) + guidGenerator.generate(true) + guidGenerator.generate();
		}

	};



	UploadServer.init({
    	tmpDir: process.env.PWD + '/upload/images/tmp',
    	uploadDir: process.env.PWD + '/upload/images',
    	checkCreateDirectories: true, //create the directories for you
    
		getDirectory: function(fileInfo, formData) {return "catalogue/";},
    
	    getFileName: function(fileInfo, formData) {
	      return guidGenerator.uniqueKey() + fileInfo.name;//formData._id +'_'+fileInfo.name;
	    },
	    finished: function(fileInfo, formData) {
	    	//fileInfo.url = Meteor.settings.path.upload + 
	    	//console.log(fileInfo);
	    	//console.log(formData);
	    }
	});



});
