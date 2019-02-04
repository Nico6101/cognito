global.fetch = require('node-fetch');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var AWS = require('aws-sdk');
const user = require('./handlerFunction');

// var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

module.exports.signin_handler = (event,context,callback) =>
{
    console.log(event);

    var poolData = {
        UserPoolId : 'ap-south-1_cwBC09n16',
        ClientId : '7b1aihqtga5b9bg6487bnjeoea'
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
                IdentityPoolId : 'ap-south-1:a630b55a-ca35-4d64-9ca8-bb7293ef74d0', // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.ap-south-1.amazonaws.com/ap-south-1_cwBC09n16' : result.getIdToken().getJwtToken()
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