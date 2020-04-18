const {functions} = require('./inventoryData')
const communication = require('../js/server-communication.js')

test('Makes sure the Employee receives the get request', () => {
   expect.assertions(1);
    return functions.fetchInventory()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});

//create
test('Add an item to the inventory', () => {
    console.log = jest.fn();
    var params = "name=test" + "&count=1";

    var url = "http://64.225.29.130/inventory/create?"
    var method = "POST";
    var response = communication.communicateWithServer(params, method, url + params, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(200);
});

//create duplicate
test('Add an item to the inventory', () => {
    console.log = jest.fn();
    var params = "name=test" + "&count=1";

    var url = "http://64.225.29.130/inventory/create?"
    var method = "POST";
    var response = communication.communicateWithServer(params, method, url + params, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(500);
});

//delete
test('Delete an item from the inventory', () => {
    console.log = jest.fn();
    var params = "name=test";

    var url = "http://64.225.29.130/inventory/delete?"
    var method = "POST";
    var response = communication.communicateWithServer(params, method, url + params, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(200);
});

//delete empty
test('Delete an item from the inventory', () => {
    console.log = jest.fn();
    var params = "";

    var url = "http://64.225.29.130/inventory/delete?"
    var method = "POST";
    var response = communication.communicateWithServer(params, method, url + params, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(400);
});
