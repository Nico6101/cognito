global.fetch = require('node-fetch');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var AWS = require('aws-sdk');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

// getting user signup information from the request
const userInfo =  (body) =>
{
    var record =
    {
        userName : {Name : 'name', Value : body.username },
        userEmail : { Name : 'email', Value : body.email },
        userPhone : { Name : 'phone_number', Value : body.phone},
        userGender : { Name : 'gender', Value : body.gender}
    }
    return (record);
}

// user login info
const loginInfo = (body) =>
{
    var authenticationData = 
    {
        Username : body.email,
        Password : body.password
    };

    return authenticationData;
}

exports = module.exports = 
{
    userInfo,
    loginInfo
}