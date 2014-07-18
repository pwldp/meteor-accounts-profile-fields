//
// meteor-auth_profile_fields-client.js
//
// Provides function loginWithProfileFields() which is designed to log in
// user by using specified users profile field(s).
//
// Dariusz Pawlak <d.pawlak@wurth.pl>
//

// Attempt to log in with a password and one of allowed field(s) from profile fields
// defined in settings.json on server, example:
//
// {
//    "login_with_profile_fields": ["phone","registration_plate"]
// }
//
//

// @param password {String}
var hashPassword = function(password) {
  return {
    digest: SHA256(password),
    algorithm: "sha-256"
  };
};
// @param loginName {String}
// @param password {String}
// @param callback {Function(error|undefined)}
Meteor.loginWithProfileField = function(loginName, password, callback){

    var options = {
	    profileFields: true,
	    loginName: loginName,
	    password: hashPassword(password)
	};
    
    Accounts.callLoginMethod({
	methodName: 'login',
	methodArguments: [options],
	userCallback: callback
    });

};

