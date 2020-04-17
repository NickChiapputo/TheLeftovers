const {functions} = require('./CouponsData')
const {}

test('Makes sure the Coupons receives the get request', () => {
   expect.assertions(1);
    return functions.fetchCoupons()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});

/*test('Makes sure the a new coupon was create',  () => {
   // expect.assertions(1);
    return functions.appendCoupon()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        })
})*/