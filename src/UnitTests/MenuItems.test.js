const {functions} = require('./MenuItems')
const communication = require('../js/server-communication.js')

test('Makes sure the Menu receives the get request', () => {
   expect.assertions(1);
    return functions.fetchMenu()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});


//delete an empty menu item
test('Delete an empty item from the menu items database', () => {
    console.log = jest.fn();
    var menuItem = { "name":"?" };

    var url = "http://64.225.29.130/menu/delete"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(menuItem), method, url, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(200);
});


//get stat on a bad menu item
test('Reject stats on an item from the menu items database', () => {
    console.log = jest.fn();
    var menuItem = { "name":"Water" };

    var url = "http://64.225.29.130/menu/stats"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(menuItem), method, url, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(200);
});

//reject getting stat on a bad menu item
test('Reject stats on an item from the menu items database', () => {
    console.log = jest.fn();
    var menuItem = { "name":"bad" };

    var url = "http://64.225.29.130/menu/stats"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(menuItem), method, url, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(500);
});
