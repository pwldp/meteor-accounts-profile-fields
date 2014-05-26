meteor-accounts-profile-fields
==========================

Smart package for [Meteor](http://www.meteor.com/) framework.

Provides function for Meteor framework to log in using "username" stored in specified profile fields.
Could be used as a replacement for `loginWithPassword()` function.


## Requirements

meteor-accounts-profile-fields needs to be installed with accounts-password package.

So, at first you need to install it by:
`meteor add accounts-password`



## Add Package 

`meteor add accounts-profile-fields`



## Example

In example below login name 'ABC123456' is checked against fields: 
['profile.register_plate', 'profile.phone_number', 'username', 'emails.email'] 
from 'users' collection. 
At first are checked fields from 'profile'. 

### on server
```js
Meteor.allowLoginWithFields(['register_plate', 'phone_number']);
```

### on client
```js
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
```





[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/pwldp/meteor-accounts-profile-fields/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

