const communication = require('../js/server-communication')
const frisby = require( 'frisby' );
const fs = require( 'fs' );
var id
test('Get the list of menuitems from the menu database', () => {
    console.log = jest.fn();
    var url = "http://64.225.29.130/menu/view"
    var method = "POST";
    var response = communication.communicateWithServer("", method, url, false);

    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});

//Create
test('Can create a new menu item',() => {
    let formData = frisby.formData();
    formData.append("menu-item-create-name","GUNIT9");
    formData.append("menu-item-create-description","UNITTEST");
    formData.append("menu-item-create-category","drink");
    formData.append("menu-item-create-calories","100");
    formData.append("menu-item-create-price","2.99");
    formData.append("menu-item-create-ingredient-1","1");
    formData.append("menu-item-create-has-ingredient-1","1");
    formData.append("menu-item-create-ingredient-count-1","1");

    var pathToImage = "../Images/cbs.png";

    formData.append( "fileToUpload", fs.createReadStream( pathToImage ) );

    var url = "http://64.225.29.130/menu/create"
    
    return frisby.post( url, { body : formData } )
                .expect( 'status', 200 )
                .then( 
                    function( res ) 
                    {
                        id = JSON.parse( res[ "_body" ] )[ "_id" ];
                        console.log(res);
                        expect( res.status ).toBe( 200 );
                    } 
                );
});

test('Can edit a menu item', ()=>{
    let formData = frisby.formData();
    formData.append("menu-item-edit-id",id)
    formData.append("menu-item-edit-name","UNIT87");
    formData.append("menu-item-edit-description","UNITTEST");
    formData.append("menu-item-edit-category","drink");
    formData.append("menu-item-edit-calories","100");
    formData.append("menu-item-edit-price","2.99");
    formData.append("menu-item-edit-ingredient-1","1");
    formData.append("menu-item-edit-has-ingredient-1","1");
    formData.append("menu-item-edit-ingredient-count-1","1");

    var pathToImage = "../Images/cbs.png";

    formData.append( "fileToUpload", fs.createReadStream( pathToImage ) );

    var url = "http://64.225.29.130/menu/edit"
    
    return frisby.post( url, { body : formData } )
                .expect( 'status', 200 )
                .then( 
                    function( res ) 
                    {
                        
                        expect( res.status ).toBe( 200 );
                    } 
                );
})

//Delete
test('Delete a menu item from the database',()=>{
    console.log = jest.fn();
    var menuItem = {"name":"UNIT87"}
    var url = "http://64.225.29.130/menu/delete"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(menuItem), method, url, false);
    console.log("Response text: " + response.text)
    var outcome;
    if(JSON.parse(response.responseText)["n"]=="1"&&JSON.parse(response.responseText)["ok"]=="1")
    {
        outcome=1;
    }
    else
    {
        outcome=0
    }
    expect(outcome).toBe(1);

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

