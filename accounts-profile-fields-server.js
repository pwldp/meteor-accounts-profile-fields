//
// meteor-auth_profile_fields-server.js
//
// Dariusz Pawlak <d.pawlak@wurth.pl>
// 2013.11.07                                                                                                                                                                                                      
//

//
// This method finds first user which satisfies the conditions:
// the 'fieldval' is equal to content of the one of fields from 'pfields' list.
//
// So be aware of using ONLY profile fields which have unique values.
// For example it might be: phone number.
//
var check = Package.check.check;

var allowedLoginFields = [];
// Server function to add one or more allowed fields that the client
// may use when submitting a login request.
//
// @param fields {Array} or {String}
Meteor.allowLoginWithFields = function(fields) {
  if (typeof fields === 'string')
    fields = [fields];
  allowedLoginFields = allowedLoginFields.concat(fields);
};

var selectorFromUserProfileQuery = function (user) {
  console.log(user);
  check(user, Object);

  var selector = [];
  allowedLoginFields.forEach(function(field) {
    var row = {};
    if (user.hasOwnProperty(field)) {
      row['profile.' + field] = user[field];
      selector.push(row);
    }
  });

  if (selector.length === 0)
    throw new Match.Error("No valid profile fields were provided.");

  console.log(selector);
  return { $or: selector };
};

// Step 1 of SRP password exchange. This puts an `M` value in the
// session data for this connection. If a client later sends the same
// `M` value to a method on this connection, it proves they know the
// password for this user. We can then prove we know the password to
// them by sending our `HAMK` value.
//
// @param request {Object} with fields:
//   user: list of profile field names for query selector
//   A: hex encoded int. the client's public key for this exchange
// @returns {Object} with fields:
//   identity: random string ID
//   salt: random string ID
//   B: hex encoded int. server's public key for this exchange
Meteor.methods({beginPasswordExchangeForProfileFields: function (request) {
  var self = this;
  console.log(request);
  try {
    var selector = selectorFromUserProfileQuery(request.user);

    var user = Meteor.users.findOne(selector);
    if (!user)
      throw new Meteor.Error(403, "User not found");

    if (!user.services || !user.services.password ||
        !user.services.password.srp)
      throw new Meteor.Error(403, "User has no password set");

    var verifier = user.services.password.srp;
    var srp = new SRP.Server(verifier);
    var challenge = srp.issueChallenge({A: request.A});

  } catch (err) {
    // Report login failure if the method fails, so that login hooks are
    // called. If the method succeeds, login hooks will be called when
    // the second step method ('login') is called. If a user calls
    // 'beginPasswordExchange' but then never calls the second step
    // 'login' method, no login hook will fire.
    Accounts._reportLoginFailure(self, 'beginPasswordExchange', arguments, {
      type: 'password',
      error: err,
      userId: user && user._id
    });
    throw err;
  }

  // Save results so we can verify them later.
  Accounts._setAccountData(this.connection.id, 'srpChallenge',
    { userId: user._id, M: srp.M, HAMK: srp.HAMK }
  );
  return challenge;
}});
