'use strict';
const AWS = require('aws-sdk');
const amplify = require('amplify');
const Auth = require('amplify');


amplify.configure({
  Auth : {
    identityPoolId : 'ap-south-1_EH2MHYIvK',
    region : 'ap-south-1',
    userPoolWebClientId : '77gl4cfbss6h423firj4ou296i',
    mandatorySignIn : true
  }
});

module.exports.hello = async (event, context,callback) => {

  var body = JSON.parse(event.body);
  console.log(event.body);

  Auth.signUp({
    username : body.username,
    password : body.password,
    attributes: {
      email
    }
  }).then(data => console.log('retrieved signup details : '+data))
  .catch(err => console.log('error while retrieving signup data : '+err));

  Auth.confirmsSignUp(body.username,code,{forceAliasCreation : false})
  .then(data => {
    console.log('sign up successful : '+data);
    var Response = {
      statusCode : 200,
      body : JSON.stringify({message : 'Sign Up successful'})
    }
    callback(err,Response);
  })
  .catch(err => console.log('error while signing up : '+err));

  Auth.resendSignUp(body.username).then(()=>
  {
    console.log('code sent successfully');
  })
  .catch(err =>
    {
      console.log('error while resending code : '+err);
    })  
};
