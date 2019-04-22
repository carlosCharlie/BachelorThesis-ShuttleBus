    /**
     * 
     * @module controller
     * 
     * @description Controller all functions about origin object [create, delete, modify and read]
     * 
     * Example to build functions:
     * 
     *  getRoutesByUser({user:{email:"driv@gmail.com",password:"123"}}, {headers: {Authorization: 'Bearer $token'}});
     *  getRouteById({user:{email:"admin@gmail.com",password:"123"},{route:{id:"..."}}, {headers: {Authorization: 'Bearer $token'}});
     *  createRoute({user:{email:"driv@gmail.com",password:"123"},route:{max:2,origin:"i9BQCi6ovzC1pdBGoRYm(elOrigenDelId)",destination:"1234(codigoPostal)"}}, {headers: {Authorization: 'Bearer $token'}});
     *  searchRoute({route:{destination:"28008",origin:"loquesea"}}, {headers: {Authorization: 'Bearer $token'}});})
     *  getRoutePoints({user:{email:"driv@gmail.com",password:"123"},route:{id:"CwCBCrWiW2Ty6KrLyIyG"}}, {headers: {Authorization: 'Bearer $token'}});
     *  addToRoute({address:"passenger address",coordinates:"",route:{id:"7ptW7eHRPqtoaHL4SWae"},user:{email:"pass@gmail.com",password:"123"}}, {headers: {Authorization: 'Bearer $token'}});
     *  removeRoute({user:{email:"driv@gmail.com",password:"123"},route:{id:"N6ObwG7HYLpelukKi5qL"}}, {headers: {Authorization: 'Bearer $token'}});
     *  removePassengerFromRoute({user:{email:"pass@gmail.com",password:"123"},route:{id:"N6ObwG7HYLpelukKi5qL"}}, {headers: {Authorization: 'Bearer $token'}});
    */

    const functions = require("firebase-functions");
    const index = require("./common");
    const routeSA = require("../service_application/route_SA");

  exports.createRoute = functions.https.onCall((data, context) => {

    return index.checkData(data)
    .then(() => index.checkData(data.route))
    .then(() => index.checkUser(data.user, "driver"))
    .then((fullUser) => {

      data.route.driver = fullUser.id; 

      return routeSA.createRoute(data.route); 
    })
    .then((id) => { return {id: id} }, error => error);
  })
  
  exports.searchRoute = functions.https.onCall((data, context) => {

    return index.checkData(data)
    .then(() => index.checkData(data.route))
    .then(() => index.checkData(data.route.origin))
    .then(() => index.checkData(data.route.destination))
    .then(() => routeSA.searchRoutes(data.route.origin,data.route.destination))
    .then((routes) => { return {routes: routes}}, error => error);
  })

  exports.addToRoute = functions.https.onCall((data, context) => {

    return index.checkData(data)
    .then(() => index.checkData(data.route))
    .then(() => index.checkData(data.address))
    .then(() => index.checkUser(data.user))
    .then(() => index.checkData(data.coordinates))
    .then(() => routeSA.addToRoute(data.user, data.route, data.address, data.coordinates))
    .then(() => { return {added: true} }, error => error);

  });
  
  exports.getRouteById = functions.https.onCall((data, context) => {

    return index.checkData(data)
    .then(() => index.checkData(data.route))
    .then(() => index.checkData(data.route.id))
    .then(() => {

      if(data.user != undefined && data.user != null) return index.checkUser(data.user);
      else return null;
    })
    .then(() => routeSA.getRouteById(data.route.id,data.user != undefined && data.user != null ? data.user : null))
    .then((route) => route, error => error);
  })
  
  exports.removePassengerFromRoute = functions.https.onCall((data, context) => {

    return index.checkData(data)
    .then(() => index.checkData(data.route))
    .then(() => index.checkUser(data.user,"passenger"))
    .then(() => routeSA.removePassengerFromRoute(data.user,data.route))
    .then(() => { return { removed: true} }, error => error);
  })
  
  exports.removeRoute = functions.https.onCall((data, context) => {

    return index.checkData(data)
    .then(() => index.checkData(data.route))
    .then(() => index.checkUser(data.user,"driver"))
    .then(() => routeSA.removeRoute(data.user,data.route))
    .then(() => { return {removed: true} }, error => error);
  })
  
  exports.getRoutesByUser = functions.https.onCall((data, context) => {
     
    return index.checkData(data)
    .then(() => index.checkUser(data.user))
    .then(() => routeSA.getRoutesByUser(data.user))
    .then((routes) => { return {routes: routes[0]} }, error => error);
  })
  
  exports.getRoutePoints = functions.https.onCall((data, context) => {
     
    return index.checkData(data)
    .then(() => index.checkData(data.route))
    .then(() => index.checkUser(data.user,"driver"))
    .then(() => routeSA.getRoutePoints(data.route,data.user))
    .then((points) => { return {points: points}}, error => error);
  })
