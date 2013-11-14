meteor-accounts-profile-fields
==========================

Provides function for Meteor framework to log in using "username" stored in specified profile fields


## Requirements

meteor-accounts-profile-fields needs to be installed with accounts-password package.

So, at first you need to install it by:
`meteor add accounts-password`



## Add Package 

`meteor add accounts-profile-fields`



## Example

`
var login = 'ABC123456';
var password = '123456';
var profile_fields_to_check_login = ['register_plate', 'phone_number'];
Meteor.loginWithProfileField(login, password, profile_fields_to_check_login, function(err) {
  if(Meteor.loggingIn()) {
    console.log("logging in...");
  } else {
    if(err) {
      console.log("log.err= " + err);
    } else {
      console.log("loggged in!");
    }
  }
});
`



