const {functions} = require('./MenuItems')
const communication = require('../js/server-communication')
const frisby = require('frisby')
const fs = require('fs')


test('Makes sure the Menu receives the get request', () => {
    expect.assertions(1);
     return functions.fetchMenu()
         .then(data => {
             console.log("Trying to connect to database")
             expect(typeof(data)).toEqual("object");
         });
 });
 

test('Can create a new menu item',()=> {
    let formData = frisby.formData();
    formData.append("menu-item-create-name","UNITTST");
    formData.append("menu-item-create-description","UNITTEST");
    formData.append("menu-item-create-category","drink");
    formData.append("menu-item-create-calories","100");
    formData.append("menu-item-create-price","2.99");
    formData.append("menu-item-create-ingredient-1","1");
    formData.append("menu-item-create-has-ingredient-1","1");
    formData.append("menu-item-create-ingredient-count-1","1");

    var pathToImage = "/home/nick/Pictures/Litterbug.jpg";

    formData.append("fileToUpload", fs.createReadStream(pathToImage));
    var url = "http://64.225.29.130/menu/create"
    return frisby.post(url, {body:formData})
                .expect('status',200)
                .then(
                    function( res )
                    {
                        expect(res.status).toBe(200);
                    }
                )
                .catch(err)
})

 
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
 test('Receive stats on an item from the menu items database', () => {
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

