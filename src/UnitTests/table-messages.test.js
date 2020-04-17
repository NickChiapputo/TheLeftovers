const {sendHelp} = require('../js/table-messages');



test('Should change the word "help" to "refill" and "refill" to "help" ', ()=>{
   sessionStorage.setItem('tableid','55')
   sessionStorage.setItem('tableid-messenger','5e92d202d016150b8a388ac4')
   var  note = "help";
   console.log = jest.fn();
    expect(sendHelp(note)).toBe('refill');
    note = 'refill';
    expect(sendHelp(note)).toBe('help');
})

