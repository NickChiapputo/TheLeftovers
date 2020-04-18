const {functions} = require('./MenuItems')

test('Makes sure the Menu receives the get request', () => {
   expect.assertions(1);
    return functions.fetchMenu()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});
