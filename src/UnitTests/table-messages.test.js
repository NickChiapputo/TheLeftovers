const {sendHelp} = require('../js/table-messages');



test('Should change the word "help" to "refill" and "refill" to "help" ', ()=>{
   var  note = "help";
    expect(sendHelp(note)).toBe('refill');
    note = 'refill';
    expect(sendHelp(note)).toBe('help');
    console.log = jest.fn();
})

