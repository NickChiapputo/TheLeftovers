const communication = require('../js/server-communication.js')
var id;

//Get
test('Get the list of coupons from the Coupon database', () => {
    console.log = jest.fn();
    var url = "http://64.225.29.130/coupons/view"
    var method = "POST";
    var response = communication.communicateWithServer("", method, url, false);

    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Create
test('Add a coupon to the Coupon database', () => {
    console.log = jest.fn();
    var query = {
                    "name" : "UNITTTEST",
                    "discount" :"15",
                    "expiration" : "2020-05-16",
                    "rewards" : "UNITTEST"
                };
    var url = "http://64.225.29.130/coupons/create"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);

    id = JSON.parse(response.responseText)[ "_id" ];

    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Verify (valid)
test('Verfiy with a valid ID',() => {
    console.log = jest.fn();
    var query = {
        "_id" : id
    };
    var url = "http://64.225.29.130/coupons/verify"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
})

//Verify (invalid)
test('Cannot Verfiy with an invalid ID',() => {
    console.log = jest.fn();
    var query = {
        "_id" : ""
    };
    var url = "http://64.225.29.130/coupons/verify"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(400);
})


//Delete (valid)
test('Delete with a valid ID',() => {
    console.log = jest.fn();
    var query = {
        "_id" : id
    };
    var url = "http://64.225.29.130/coupons/delete"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
})

//Delete (invalid)
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
