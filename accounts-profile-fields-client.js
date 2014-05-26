//
// meteor-auth_profile_fields-client.js
//
// Provides function loginWithProfileFields() which is designed to log in
// user by using specified 'profile' field(s).
//
// Dariusz Pawlak <d.pawlak@wurth.pl>
// 2013.11.07
//

// Attempt to log in with a password and one of an allowed list of profile
// fields.
//
// @param selector {Object} selector based on one or more profile fields.
// fields will be prepended with "profile." before searching the user object
// and are checked against a whitelist set on server.
//   example:
//   - {phone: (phonenumber)}
// @param password {String}
// @param callback {Function(error|undefined)}
Meteor.loginWithProfileField = function (value, password, fields, callback) {
  var srp = new SRP.Client(password);
  var request = srp.startExchange();

  request.fields = fields;
  request.value = value;

  // Normally, we only set Meteor.loggingIn() to true within
  // Accounts.callLoginMethod, but we'd also like it to be true during the
  // password exchange. So we set it to true here, and clear it on error; in
  // the non-error case, it gets cleared by callLoginMethod.
  Accounts._setLoggingIn(true);
  Accounts.connection.apply(
    'beginPasswordExchangeForProfileFields', [request], function (error, result) {
      if (error || !result) {
        Accounts._setLoggingIn(false);
        error = error ||
          new Error("No result from call to beginPasswordExchange");
        callback && callback(error);
        return;
      }

      var response = srp.respondToChallenge(result);
      Accounts.callLoginMethod({
        methodArguments: [{srp: response}],
        validateResult: function (result) {
          if (!srp.verifyConfirmation({HAMK: result.HAMK}))
            throw new Error("Server is cheating!");
        },
        userCallback: callback});
    });
};

Meteor.loginWithProfileFieldPlain = function (value, password, fields, callback) {
  Accounts._setLoggingIn(true);
  Accounts.callLoginMethod({
    methodArguments: [{fields: fields, value: value, password: password}],
    userCallback: callback
  });
};
