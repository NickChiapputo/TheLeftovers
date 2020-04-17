const {functions} = require('./CouponsData')

test('Makes sure the Coupons receives the get request', () => {
   expect.assertions(1);
    return functions.fetchMenu()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});