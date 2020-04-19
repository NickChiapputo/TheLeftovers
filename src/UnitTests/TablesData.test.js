const {functions} = require('./TablesData')
const communication = require('../js/server-communication.js')

test('Makes sure the Tables receives the get request', () => {
   expect.assertions(1);
    return functions.fetchMenu()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});

//Create
test('Create a table that already exists', () => {
    console.log = jest.fn();
    var query = {
                    "table":"1"
                };
    var url = "http://64.225.29.130/tables/create"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(500);
});

//Update a table's status to 'sitting'
test('Update table status to sitting', () => {
    console.log = jest.fn();
    var query = {
                    "table":"1",
                    "status":"sitting"
                };
    var url = "http://64.225.29.130/tables/update"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Update a table's status to 'ordered'
test('Update table status to ordered', () => {
    console.log = jest.fn();
    var query = {
                    "table":"1",
                    "status":"ordered"
                };
    var url = "http://64.225.29.130/tables/update"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Update a table's status to 'eating'
test('Update table status to eating', () => {
    console.log = jest.fn();
    var query = {
                    "table":"1",
                    "status":"eating"
                };
    var url = "http://64.225.29.130/tables/update"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Update a table's status to 'paid'
test('Update table status to paid', () => {
    console.log = jest.fn();
    var query = {
                    "table":"1",
                    "status":"paid"
                };
    var url = "http://64.225.29.130/tables/update"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Update a table's status to invalid status
test('Update table status to invalid status', () => {
    console.log = jest.fn();
    var query = {
                    "table":"1",
                    "status":"blah"
                };
    var url = "http://64.225.29.130/tables/update"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(400);
});
