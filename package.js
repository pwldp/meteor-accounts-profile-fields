Package.describe({
  summary: "Profile fields based log in, extended version of loginWithPassword() function"
});

Package.on_use(function (api) {
  api.use(['accounts-base' , 'accounts-password'], ['client', 'server']);
  api.use('srp', ['client', 'server']);
  api.add_files('accounts-profile-fields-server.js', 'server');
  api.add_files('accounts-profile-fields-client.js', 'client');
});
