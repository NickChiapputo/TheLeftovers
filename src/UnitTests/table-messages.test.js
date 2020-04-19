const {sendHelp} = require('../js/table-messages');

test('Should send a refill message', async() => {
    sessionStorage.setItem('tableid',"5e955f4418fbb6212192c4b5");
    sessionStorage.setItem('tableid-messenger',"5e9488337a1cc1304fc4fe74");
    note="help";
    expect(sendHelp(note)).not.toBe(undefined);

})
