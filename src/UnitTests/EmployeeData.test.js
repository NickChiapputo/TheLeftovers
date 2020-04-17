const {functions} = require('./EmployeeData')

test('Makes sure the Employee receives the get request', () => {
   expect.assertions(1);
    return functions.fetchEmployees()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});

