const communication = require('../js/server-communication')
//Kitchen -> Manager w/ valid ids
test('Help messages can be sent from the kitchen to a valid-managerid',()=>{
    console.log = jest.fn();
    var query = {
                    "src":"",
                    "srcType":"kitchen",
                    "dest":"5e92d202d016150b8a388ac4",
                    "destType":"manager",
                    "request":  "help"
                }
                var url = "http://64.225.29.130/messages/send"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
})
//Kitchen -> Server w/ valid ids
test('Help messages can be sent from the kitchen to a valid-serverid',()=>{
    console.log = jest.fn();
    var query = {
                    "src":"",
                    "srcType":"kitchen",
                    "dest":"5e9488737a1cc1304fc4fe77",
                    "destType":"server",
                    "request":  "help"
                }
                var url = "http://64.225.29.130/messages/send"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
})

//Server -> Manager w/ valid ids
test('Help messages can be sent with a valid-serverid to a valid-managerid',()=>{
    console.log = jest.fn();
    var query = {
                    "src":"5e9488737a1cc1304fc4fe77",
                    "srcType":"server",
                    "dest":"5e92d202d016150b8a388ac4",
                    "destType":"manager",
                    "request":  "help"
                }
                var url = "http://64.225.29.130/messages/send"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
})

//Table -> Server w/ valid ids
test(' Help messages can be sent from a valid tablenum to a server', ()=>{
    console.log = jest.fn();
    var query = {
                    "src":"5",
                    "srcType":"table",
                    "dest":"5e9488737a1cc1304fc4fe77",
                    "destType":"server",
                    "request":  "help"
                }
                var url = "http://64.225.29.130/messages/send"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
});

//Kitchen -> manager w/o valid id
test('Help messages fail to send from kitchen to manager without a validid',()=> {
    console.log = jest.fn();
    var query = {
                    "src":"",
                    "srcType":"kitchen",
                    "dest":"5e9488737a1cc1304fc4fe",
                    "destType":"server",
                    "request":  "help"
                }
                var url = "http://64.225.29.130/messages/send"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(400);
});

//Kitchen -> server w/o valid id
test('Help messages fail to send from kitchen to manager without a validid', ()=> {
    console.log = jest.fn();
    var query = {
                    "src":"",
                    "srcType":"kitchen",
                    "dest":"5e9488737a1cc1304fc4fe",
                    "destType":"manager",
                    "request":  "help"
                }
                var url = "http://64.225.29.130/messages/send"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(400);
});

//Server -> manager w/o valid id
test('Help messages fail to send from server to managers without validids', ()=> {
    console.log = jest.fn();
    var query = {
                    "src":"4",
                    "srcType":"server",
                    "dest":"5e9488737a1cc1304fc4fe",
                    "destType":"manager",
                    "request":  "help"
                }
                var url = "http://64.225.29.130/messages/send"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(400);
});

//table -> server w/o valid id
test('Help messages fail to send from server to managers without validids', ()=> {
    console.log = jest.fn();
    var query = {
                    "src":"4",
                    "srcType":"table",
                    "dest":"5e9488737a1cc1304fc4fe",
                    "destType":"server",
                    "request":  "refill"
                }
                var url = "http://64.225.29.130/messages/send"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(400);
});

//Server checks inbox w/ valid id
test('Servers can get messages from anyone by checking their inbox with valid ids', ()=>{
    console.log = jest.fn();
    var query = {
                    "dest":"5e9488737a1cc1304fc4fe77",
                    "destType":"server"
                }
                var url = "http://64.225.29.130/messages/get"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
})

//Manager checks inbox w/ valid id
test('Managers can get messages from anyone by checking their inbox with valid ids', ()=>{
    console.log = jest.fn();
    var query = {
                    "dest":"5e92d202d016150b8a388ac4",
                    "destType":"manager"
                }
                var url = "http://64.225.29.130/messages/get"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
})

//Server checks inbox w/o valid id
test('Servers can get messages from anyone by checking their inbox with valid ids', ()=>{
    console.log = jest.fn();
    var query = {
                    "dest":"5e9488737a1cc134fc4fe77",
                    "destType":"server"
                }
                var url = "http://64.225.29.130/messages/get"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(400);
})

//Manager checks inbox w/o valid id
test('Managers can get messages from anyone by checking their inbox with valid ids', ()=>{
    console.log = jest.fn();
    var query = {
                    "dest":"5e92d202d01615b8a388ac4",
                    "destType":"manager"
                }
                var url = "http://64.225.29.130/messages/get"
                var method = "POST";
                var response = communication.communicateWithServer(JSON.stringify(query), method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(400);
})