const {functions} = require('./EmployeeData')
const communication = require('../js/server-communication')


//Grabs object Data
test('Makes sure the Employee receives the get request', () => {
   expect.assertions(1);
    return functions.fetchEmployees()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});

//Create
test('Add a employee to the Employee database', () => {
    console.log = jest.fn();
    var query = {
                    "first" : "UNIT",
                    "middle" : "J",
                    "last" : "Test",
                    "type" : "manager",
                };
    var url = "http://64.225.29.130/employees/create"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response status: "+response.status)
    expect(response.status).toBe(200);
});


//Delete w/ invalid ID
test('Cannot delete an employee with an invalid ID', () =>{
    console.log = jest.fn();
    var query = {
                    "id" : ""
                };
    var url = "http://64.225.29.130/employees/delete"
    var method = "POST";
    var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
    console.log("Response text: "+response.status)
    expect(response.status).toBe(400);
})


//Login Verification
test('Login passes for an existing employee',() => {
    console.log = jest.fn();
    var query = {
                    "_id" : "5e92d202d016150b8a388ac4",
                    "pin" :"2568"
                }
                var url = "http://64.225.29.130/employees/login"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
})

//Logout Verification
test('Logout passes for an existing employee', () =>{
    console.log = jest.fn();
    var query = {
                    "_id" : "5e92d202d016150b8a388ac4",
                    "pin" : "2568"

                }
                var url = "http://64.225.29.130/employees/logout"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
})


//Create Shift
test('Can create a shift for an employee with a valid id',() => {
    console.log = jest.fn();
    var query = {
                    "_id" : "5e92d202d016150b8a388ac4",
                    "date":"2020-14-12","start":"10:30","end":"14:30"
                    
                }
                var url = "http://64.225.29.130/employees/shift/create"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
})


//Delete Shift
test('Can delete a shift for an employee with a valid id, that is scheduled',() => {
    console.log = jest.fn();
    var query = {
        "_id" : "5e92d202d016150b8a388ac4",
        "date":"2020-14-12","start":"10:30","end":"14:30"
        
    }
                var url = "http://64.225.29.130/employees/shift/remove"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
})