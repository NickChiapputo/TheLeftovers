const {functions} = require('./OrdersData')
const communication = require('../js/server-communication.js')

test('Makes sure the Orders receives the get request', () => {
   expect.assertions(1);
    return functions.fetchOrders()
        .then(data => {
            console.log("Trying to connect to database ")
            expect(typeof(data)).toEqual("object");
        });
});

//create
test('Add an order to the order database', () => {
    console.log = jest.fn();
    var order = {"table":"2",
                "rewards":"",
                "status":"paid",
                "items":[{"_id":"5e8f91c1630c6b147e47748d","name":"Water","price":0.01,"calories":0,"ingredients":["Water"],"hasIngredient":[1],"ingredientCount":[1],"allergens":[],"description":"Collected from the pacific, boiled to perfection.",
                "category":"drink",
                "image":"http://64.225.29.130/img/waterglass_edit.jpg",
                "sent":"true","free_drink":"false"}],
                "subtotal":0.01,
                "tax":0,
                "total":0,
                "ready":1
            };

    var url = "http://64.225.29.130/orders/create"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(order), method, url, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(200);
});

//delete without id
test('Delete an order without id from the order database', () => {
    console.log = jest.fn();
    var query = { "_id":""
    };
    var url = "http://64.225.29.130/orders/delete"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(400);

});

//process payment without id
test('Process payment without id from the order database', () => {
    console.log = jest.fn();
    var query = { };

    query[ "_id" ] = "";
	query[ "amount" ] = "0.00";
	query[ "method" ] = "Card";
	query[ "receipt" ] = "Print";
	query[ "tip" ] = "0.00";
	query[ "feedback" ] = "feedback";
	query[ "email" ] = "lol@gmail.com";

    var url = "http://64.225.29.130/orders/delete"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response text: " + response.text)
    expect(response.status).toBe(400);

});
