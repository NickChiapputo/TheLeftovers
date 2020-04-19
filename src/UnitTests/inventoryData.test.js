const communication = require('../js/server-communication.js')

test('Get the list of inventoryitems from the inventory database', () => {
    console.log = jest.fn();
    var url = "http://64.225.29.130/inventory/view"
    var method = "POST";
    var response = communication.communicateWithServer("", method, url, false);

    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
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
test('Add a duplicate item to the inventory', () => {
    console.log = jest.fn();
    var params = "name=test" + "&count=1";

    var url = "http://64.225.29.130/inventory/create?"
    var method = "POST";
    var response = communication.communicateWithServer(params, method, url + params, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(500);
});


//create item with negative count
test('Add an item with a negative count to the inventory', () => {
    console.log = jest.fn();
    var params = "name=n" + "&count=-5";

    var url = "http://64.225.29.130/inventory/create?"
    var method = "POST";
    var response = communication.communicateWithServer(params, method, url + params, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(400);
});

//edit item
test('Edit an item in the inventory', () => {
    console.log = jest.fn();
    var params = {
                "name":"test",
                "count":"200"
    };

    var url = "http://64.225.29.130/inventory/edit"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(params), method, url, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(200);
});

//edit item with negative count
test('Edit an item in the inventory', () => {
    console.log = jest.fn();
    var params = {
                "name":"test",
                "count":"-5"
    };

    var url = "http://64.225.29.130/inventory/edit"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(params), method, url, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(400);
});

//delete item
test('Delete an item from the inventory', () => {
    console.log = jest.fn();
    var params = "name=test";

    var url = "http://64.225.29.130/inventory/delete?"
    var method = "POST";
    var response = communication.communicateWithServer(params, method, url + params, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(200);
});

//delete empty item
test('Delete an item from the inventory', () => {
    console.log = jest.fn();
    var params = "";

    var url = "http://64.225.29.130/inventory/delete?"
    var method = "POST";
    var response = communication.communicateWithServer(params, method, url + params, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(400);
});
