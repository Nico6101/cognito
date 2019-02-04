global.fetch = require('node-fetch');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var AWS = require('aws-sdk');
// var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const user = require('./handlerFunction')

module.exports.handler = async (event, context, callback) => 
{
    console.log(event);
    
    var poolData = {
        UserPoolId : 'your-user-pool-id',
        ClientId : 'your-client-id'
      }
      
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];
    
    var body = JSON.parse(event.body);
    console.log(body);
  
    var userRecord = user.userInfo(body);
    console.log(JSON.stringify(userRecord));
    console.log(JSON.stringify(userRecord.userEmail));

    var attributeEmail =  new AmazonCognitoIdentity.CognitoUserAttribute(userRecord.userEmail);
    var attributePhone = new AmazonCognitoIdentity.CognitoUserAttribute(userRecord.userPhone);
    var attributeGender = new AmazonCognitoIdentity.CognitoUserAttribute(userRecord.userGender);
    var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(userRecord.userName);

    attributeList.push(attributeEmail);
    attributeList.push(attributePhone);
    attributeList.push(attributeGender);
    attributeList.push(attributeName);
  
    console.log('before signup..');

    userPool.signUp(body.username,body.password,attributeList,null, (err,result)=> 
    {
        if(err) {
        console.log('error came while signing up :'+JSON.stringify(err));
        return;
        }
        console.log('inside signup...')
        var cognitoUser = result.user;
        console.log('username is : '+ cognitoUser.getUsername());
        
    });


};
