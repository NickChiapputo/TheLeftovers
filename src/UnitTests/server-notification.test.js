const {getMessages,updateNotifications} = require('../js/server-notification');

test('Messages can be accessed with a valid ID and type', async() => {
    sessionStorage.setItem('employee-id',"5e9488337a1cc1304fc4fe74");
    sessionStorage.setItem('employee-type','server');
    expect(getMessages()).not.toBe(undefined);
})