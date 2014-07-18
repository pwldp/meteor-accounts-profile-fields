Package.describe({
    summary: "Profile fields based log in, extended version of loginWithPassword() function"
});

Package.on_use(function (api) {
    api.use(['accounts-base'], ['client', 'server']);
    api.add_files('accounts-profile-fields-server.js', 'server');
    api.add_files('accounts-profile-fields-client.js', 'client');
});
