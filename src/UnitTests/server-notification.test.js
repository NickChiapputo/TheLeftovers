const {getMessages,updateNotifications} = require('../js/server-notification');

test('Messages can be accessed with a valid ID and type', async() => {
    console.log = jest.fn()
    sessionStorage.setItem('employee-id',"5e9488337a1cc1304fc4fe74");
    sessionStorage.setItem('employee-type','server');
    expect(getMessages()).toBe("5e9488337a1cc1304fc4fe74server");
    console.log("Im expecting "+sessionStorage.getItem("employee-id")+" and "+sessionStorage.getItem('employee-type')+" to be returned\n");
})
