global.fetch = require('node-fetch');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var AWS = require('aws-sdk');
const user = require('./handlerFunction');

// var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

module.exports.signin_handler = (event,context,callback) =>
{
    console.log(event);

    var poolData = {
        UserPoolId : 'your-user-pool-id',
        ClientId : 'your-client-id'
      }
      
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var body = JSON.parse(event.body);
    console.log(body);

    var loginDetails = user.loginInfo(body);
    var authenticationDetails =  new AmazonCognitoIdentity.AuthenticationDetails(loginDetails);

    var userData = {
        Username : body.username,
        Pool : userPool
    }

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            console.log('Here is the access token : '+accessToken);

            AWS.config.region = 'ap-south-1';

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : '****', // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.<your-region>.amazonaws.com/<your-user-pool-id>' : result.getIdToken().getJwtToken()
                }
            });
            console.log('Here is the id token : '+result.getIdToken().getJwtToken());

            //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
            AWS.config.credentials.refresh((error) => {
                if (error) {
                    console.error(error);
                } else {
                    // Instantiate aws sdk service objects now that the credentials have been updated.
                    // example: var s3 = new AWS.S3();
                    console.log('Successfully logged!');
                }
            });
            
        },

        onFailure: function(err) {
            console.log('error came while authenticating :'+JSON.stringify(err));
        }
    });
}
