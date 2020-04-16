const {sendHelp} = require('../js/table-messages');

test('Should send a help message to a server from a valid table id', async()=>{
    sessionStorage.setItem('tableid',"5e955f4418fbb6212192c4b5");
    sessionStorage.setItem('tableid-messenger',"5e9488337a1cc1304fc4fe74");
  
    var note = "refill";
    console.log=jest.fn();

        expect(sendHelp(note)).toBe("sent")
        console.log("Message should be refill. It is "+note)

})

