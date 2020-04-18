const {functions} = require('./CouponsData')
const communication = require('../js/server-communication.js')

//Get
test('Makes sure the Coupons receives the get request', () => {
   expect.assertions(1);
    return functions.fetchCoupons()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});

//Create
test('Add a coupon to the Coupon database', () => {
    console.log = jest.fn();
    var query = {
                    "name" : "UNITTEST",
                    "discount" :"15",
                    "expiration" : "2020-05-16",
                    "rewards" : "UNITTEST"
                };
    var url = "http://64.225.29.130/coupons/create"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Delete
test('Cannot Delete with an invalid ID',() => {
    console.log = jest.fn(); 
    var query = {
        "_id" : ""
    };
    var url = "http://64.225.29.130/coupons/delete"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(400);
})