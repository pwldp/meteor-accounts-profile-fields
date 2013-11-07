//
// meteor-auth_profile_fields-client.js
//
// Provides function loginWithProfileFields() which is designed to log in
// user by using specified 'profile' field(s).
//
// Dariusz Pawlak <d.pawlak@wurth.pl>
// 2013.11.07
//

//
// Run in client: Meteor.loginWithProfileField();
// var pfields = [ 'phone_number' ];
// Meteor.loginWithProfileField('+48123456789', 'P@ssw0rd', profields);
//
// First trying to log in using specified profile field, next if it fails,
// trying to log in using standard loginWithPassword function.
//
Meteor.loginWithProfileField = function(lname, password, pfields, callback){

    check(lname, String);
    check(password, String);
    check(pfields, [String]);

    if ( Meteor.userId() ){
	    callback( new Error("First logout current logged user ID="+Meteor.userId) );
    };

  Meteor.call('findFirstSpecificUser', lname, pfields, function (error, result) {
	  if (error || !result) {
      Meteor.loginWithPassword(lname, password, function(err){
		    if (err) console.log("login ERROR: "+err);
		    if (err) callback(err);
		    console.log("LoggedIn?");
		    callback()
      });

    } else {
	    // found user, so try to log in

      Meteor.loginWithPassword(result.username, password, function(err){
		    if (err) callback(err);
		    callback()
	    });
	  }
  });
  if (callback) callback;
  return;
};
//
// EOF
//
