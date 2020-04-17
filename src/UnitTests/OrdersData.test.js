const {functions} = require('./OrdersData')

test('Makes sure the Orders receives the get request', () => {
   expect.assertions(1);
    return functions.fetchOrders()
        .then(data => {
            console.log("Trying to connect to database ")
            expect(typeof(data)).toEqual("object");
        });
});
