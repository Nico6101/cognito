global.fetch = require('node-fetch');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var AWS = require('aws-sdk');

var lambda = new AWS.Lambda({region : 'ap-south-1'})
// var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

module.exports.authenticate_handler = (event,context,callback) =>
{
    console.log(event);

    var poolData = 
    {
        UserPoolId : 'ap-south-1_cwBC09n16',
        ClientId : '7b1aihqtga5b9bg6487bnjeoea'
    };
      
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    console.log(event);

    var body = JSON.parse(event.body);
    console.log(body);

    var userData = {
        Username : body.username,
        Pool : userPool
    }

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    var code = body.code;

    if(code===undefined) 
    {
        var Response = {
            statusCode : 200,
            body : JSON.stringify({message : 'Please enter code you received in your email.'+err})
        }
        console.log(JSON.stringify(Response));
    }

    if(code!==undefined) 
    {
        console.log('Found code...');

        cognitoUser.confirmRegistration(code, false, (err, result) => 
        {
            if (err) {
                console.log('Error while confirming registration : '+err.message || JSON.stringify(err));
                return;
            }
            console.log('ConfirmRegistration call result: ' + result);

            lambda.invoke({FunctionName : 'cognito-dev-signin', Payload: JSON.stringify(event,context,callback)},(err,data) =>
                {
                    if(err)
                    {
                        console.log('error came while invoking signin lambda :'+err);
                    }
                    else
                    {
                        console.log('Lambda invoked successfully : '+JSON.stringify(data));
                    }
                }
            );
        });
    }
}