    /**
     * 
     * @module controller
     * 
     * @description Check login and register the user to application
     * 
     * Example to build functions:
     * 
     *  signin({user:{email:"jose@gmail.com"});
     *  signup({user:{email:"jose@gmail.com", password:"...jk132k4j1kj23h4l...", name:"Jose", surname:"Ramirez", number:123456789, type:"driver", }});
     * 
     */

    const functions = require("firebase-functions");
    const index = require("./index");
    const personSA = require("../service_application/personSA");

    /**
     * @description Check the correct login of a user in the application.
     * 
     * @returns {Promise} A promise with user data in the correct case and error in the wrong case.
     */
    exports.signin = functions.https.onCall((data, context) => {

        return index.checkData(data)
        .then(() => index.checkUser(data.user))
        .then(() => personSA.signIn(data.user.email))
        .then(result => result, error => error);
    });
    
    /**
     * @description Signs up a new user if not exists.
     * 
     * @returns {Promise} A promise that returns "signedUp:true" if its correct(it allows client to check if connection goes well) or an error.
     */
    exports.signup = functions.https.onCall((data, context) => {

        return index.checkData(data)
        .then(() => index.checkData(data.user))
        .then(() => personSA.signUp(data.user))
        .then(() => { return {signedUp: true} }, error => error);
    });
