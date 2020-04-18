const {sendHelp} = require('../js/table-messages');

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

test('Should change the word "help" to "refill" and "refill" to "help" ', ()=>{
   console.log = jest.fn();
   sessionStorage.setItem('tableid','1')
   sessionStorage.setItem('tableid-messenger','5e92d202d016150b8a388ac4')
   var  note = "help";
   console.log = jest.fn();
    expect(sendHelp(note)).toBe('refill');
    note = 'refill';
    expect(sendHelp(note)).toBe('help');
})

test('Should change the word "help" to "refill"', ()=>{//I had mixed up the buttons
    console.log = jest.fn()
    console.log = jest.fn()
   sessionStorage.setItem('tableid','1')
   sessionStorage.setItem('tableid-messenger','5e92d202d016150b8a388ac4')
   var  note = "help";
    expect(sendHelp(note)).toBe('refill');
})

