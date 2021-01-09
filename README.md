0. Update your next auth server as per [this issue](https://github.com/nextauthjs/next-auth/issues/569).
1. `yarn install`
2. Make a `.env` file that looks like the following:
```
GOOGLE_ID=(key).apps.googleusercontent.com
API_DOMAIN=https://yourdomain.com
TEST_PATH=/some/path/to/test/that/requires/authentication
```
3. `expo start`
4. Start the app. Login. You should see "Successfully authenticated! Response: (whatever the response was from your server)"