    /**
     * 
     * @module data_access
     * 
     * @description Manager of the database. 
     *              In charge of communicating with the database to read and write person data.
     * 
    */

    const ERROR = require("../errors/errors");
    const db = require("./database.js.js");

    function getUser(email) {

        return db.collection("persons").where("email", "==", email).get()
        .then((snapshot) => {

            if(snapshot.docs.length > 0) {ç

                let result = snapshot.docs[0].data();
                result.id = snapshot.docs[0].id;

                return result;
            }
            else return null;
        }, error => { throw ERROR.server });
    }

    function getUserById(id) {

        return db.collection("persons").doc(id).get()
        .then((snapshot) => {

            if(!snapshot.exists) return null;
            else{

                let user = snapshot.data();
                user.id = snapshot.id;

                return user;
            }
        }, error => { throw ERROR.server });
    }

    function insertUser(newUser) {

        return db.collection("persons").add(newUser)
        .then(() => { return null }, error => { throw ERROR.server} );
    }


    module.exports = {
        
        getUser: getUser,
        insertUser: insertUser,
        getUserById:getUserById
    }
