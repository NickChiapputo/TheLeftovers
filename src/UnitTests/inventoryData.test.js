const {functions} = require('./inventoryData')

test('Makes sure the Employee receives the get request', () => {
   expect.assertions(1);
    return functions.fetchInventory()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});
