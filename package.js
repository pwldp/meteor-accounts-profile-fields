Package.describe({
  summary: "Profile fields based log in"
});

Package.on_use(function (api) {
  var both = ['client', 'server'];
  api.use(['accounts-base' , 'accounts-password'], both);

  //api.export && api.export('Roles');

  api.add_files('auth_profile_fields-server.js', 'server');
  api.add_files('auth_profile_fields-client.js', 'client');
});
/*
Package.on_test(function (api) {
  // include accounts-password so Meteor.users exists
  api.use(['roles','accounts-password','tinytest'], 'server');

  api.add_files('tests/server.js', 'server');
  api.add_files('tests/client.js', 'client');
});
*/
