    /**
     * 
     * @module service_application
     * 
     * @description Apply the logic application about the person functions.
     * 
     */

    const ERROR = require("../errors/errors");
    const originDAO = require("../data_access/person_DAO");

    function signIn(email, password) {

        return personDAO.getUser(email)
        .then(user => {

            if (user == null) throw ERROR.userDoesntExists;
            else if (user.password == password) return user;
            else throw ERROR.incorrectSignin;
        });
    }

    function signUp(newUser){

        return new Promise((resolve,reject) => {
        
            if (!checkRequirements(newUser)) reject(ERROR.badRequestForm);
            else resolve();
        })
        .then(()=>{ return personDAO.getUser(newUser.email); })
        .then(result => {

            if (result != null) throw ERROR.userAlreadyExists;
            else {

                newUser.number = Number(newUser.number);
                return personDAO.insertUser(newUser); 
            }    
        });
    }

    function checkUser(user, userType = null) {

        return new Promise((resolve, reject) => {
            if(user == null) reject(ERROR.necessaryDataIsNull);
            else resolve();
        })
        .then(() => signIn(user.email, user.password))
        .then((result) => {

            if(result == null || (userType != null && ( result.type == null || result.type != userType))) throw ERROR.noPermissions;
            else return result;
        });
    }

    /* **************************************************************************************************** */

    /**
     * @description Check sign up requirements.
     * 
     * @returns {Boolean} A confirmation about the data are correct or not.
     */
    function checkRequirements(newUser){

        return checkType(newUser.type) &&
        newUser.name != null && newUser.name.length > 0 &&
        newUser.surname != null && newUser.surname.length > 0 &&
        newUser.password != null && newUser.password.length >= 3 &&
        newUser.number != null && Number(newUser.number) != NaN;
    }

    /**
     * @description Check that you are signing up with the correct type
     * 
     * @returns {Boolean} A confirmation about the data are correct or not.
     */
    function checkType(type){ return type == "passenger" || type == "driver"; };


    module.exports = {
        
        signIn:signIn,
        signUp:signUp,
        checkUser:checkUser
    }
