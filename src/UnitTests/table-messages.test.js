const {sendHelp} = require('../js/table-messages');



test('Should change the word "help" to "refill"', ()=>{//I had mixed up the buttons
    console.log = jest.fn()
    console.log = jest.fn()
   sessionStorage.setItem('tableid','1')
   sessionStorage.setItem('tableid-messenger','5e92d202d016150b8a388ac4')
   var  note = "help";
    expect(sendHelp(note)).toBe('refill');
})

