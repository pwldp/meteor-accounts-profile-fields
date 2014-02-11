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
Meteor.loginWithProfileField = function(lname, password, pfields, callback) {

  check(lname, String);
  check(password, String);
  check(pfields, [String]);

  if (Meteor.userId()) {
    callback(new Meteor.Error(400, "At first logout current logged user ID="+Meteor.userId()));
    return;
  }

  Meteor.call('findFirstMatchUser', lname, pfields, function (err, data) {
    if (err || !data) {
      callback(new Meteor.Error(400, 'Could not find user'));
    } else {
      Meteor.loginWithPassword(data.email, password, function(err) {
        if (err) { callback(err); }
        return;
      });                                                                                                                                                                                                          
    }   
  }); 
}

