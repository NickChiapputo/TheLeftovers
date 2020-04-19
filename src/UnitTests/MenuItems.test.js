const {functions} = require('./MenuItems')
const communication = require('../js/server-communication')

test('Makes sure the Menu receives the get request', () => {
    expect.assertions(1);
     return functions.fetchMenu()
         .then(data => {
             console.log("Trying to connect to database")
             expect(typeof(data)).toEqual("object");
         });
 });
 

//  test('Can create a menu item',() => {
//                  const file = new File([''],'http://64.225.29.130/img/yd7b6zdowsr41.jpg',{
//                      type: 'text/plain',
//                      lastModified:new Date()
//                  })
//                  var formData = new FormData();
//                  formData.set("menu-item-create-name","UNITTEST");
//                  formData.set("menu-item-create-description","UNITTEST");
//                  formData.set("menu-item-create-category","drink");
//                  formData.set("menu-item-create-calories","100");
//                  formData.set("menu-item-create-price","2.99");
//                  formData.set("menu-item-create-ingredient-1","1");
//                  formData.set("menu-item-create-has-ingredient-1","1");
//                  formData.set("menu-item-create-ingredient-count-1","1");
//                  formData.append("fileToUpload",file)
//                  var url = "http://64.225.29.130/menu/create"
//                  var method = "POST";
//                  var response = communication.communicateWithServer(formData, method, url, false);
//                  console.log("Response text: "+response.status)
//                  expect(response.status).toBe(200);
//  })

 
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

