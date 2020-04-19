const {functions} = require('./RewardsData')
const communication = require('../js/server-communication.js')

test('Makes sure the Menu receives the get request', () => {
   expect.assertions(1);
    return functions.fetchMenu()
        .then(data => {
            console.log("Trying to connect to database ")
            expect(typeof(data)).toEqual("object");
        });
});

//Create
test('Create rewards account', () => {
    console.log = jest.fn();
    var query = {
                    "phone":"1231231234",
                    "name":"testytest"
                };

    var url = "http://64.225.29.130/rewards/create"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Create with no data
test('Create rewards account', () => {
    console.log = jest.fn();
    var query = {
                    "phone":"",
                    "name":""
                };

    var url = "http://64.225.29.130/rewards/create"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(400);
});

//Create duplicate rewards account
test('Cannot create duplicate rewards account', () => {
    console.log = jest.fn();
    var query = {
                    "phone":"1231231234",
                    "name":"testytest"
                };

    var url = "http://64.225.29.130/rewards/create"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(500);
});

//Search for rewards account
test('Search for rewards account', () => {
    console.log = jest.fn();
    var query = {
                    "phone":"1231231234",
                };

    var url = "http://64.225.29.130/rewards/search"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Search for rewards account - invalid
test('Search for rewards account with invalid number', () => {
    console.log = jest.fn();
    var query = {
                    "phone":"1231231234123123123",
                };

    var url = "http://64.225.29.130/rewards/search"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(400);
});

//Search for rewards account - none
test('Search for rewards account with no phone number', () => {
    console.log = jest.fn();
    var query = {
                    "phone":"",
                };

    var url = "http://64.225.29.130/rewards/search"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(400);
});

//Delete rewards account
test('Delete rewards account', () => {
    console.log = jest.fn();
    var query = {
                    "phone":"1231231234",
                };

    var url = "http://64.225.29.130/rewards/delete"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Delete rewards account with empty phone number
test('Delete rewards account with empty phone number', () => {
    console.log = jest.fn();
    var query = {
                    "phone":"",
                };

    var url = "http://64.225.29.130/rewards/delete"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(400);
});
