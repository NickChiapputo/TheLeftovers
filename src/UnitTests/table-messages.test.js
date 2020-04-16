const {sendHelp} = require('../js/table-messages');

test('Should send a help message to a server from a valid table id', async()=>{
    sessionStorage.setItem('tableid',"5e955f4418fbb6212192c4b5");
    sessionStorage.setItem('tableid-messenger',"5e9488337a1cc1304fc4fe74");
  
    var note = "refill";

    function sendHelp(note){//I had mixed up the buttons on all the screens
        expect(note).toBe('help')
        console.log("Message should be refill. It is "+note)
    }

})

test('Should send a refill message', async() => {
    sessionStorage.setItem('tableid',"5e955f4418fbb6212192c4b5");
    sessionStorage.setItem('tableid-messenger',"5e9488337a1cc1304fc4fe74");
    note="help";
    expect(sendHelp(note)).not.toBe(undefined);

})

test('Should return false if invalid id is entered', async()=>{
    sessionStorage.setItem('tableid',"5e955f4418fbb6212192c4b5");
    sessionStorage.setItem('tableid-messenger',"5e94883371cc1304fc4fe74");
    var note = "help";
   console.log("I am expecting undefined as a message")
    expect(sendHelp(note)).toBe(undefined);
})