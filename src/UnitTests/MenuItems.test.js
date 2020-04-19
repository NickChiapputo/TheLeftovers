const {functions} = require('./MenuItems')
const communication = require('../js/server-communication')

test('Makes sure the Menu receives the get request', () => {
   expect.assertions(1);
    return functions.fetchMenu()
        .then(data => {
            console.log("Trying to connect to database")
            expect(typeof(data)).toEqual("object");
        });
});

test('Can create a shift for an employee with a valid id',() => {
                const file = new File([''],'http://64.225.29.130/img/yd7b6zdowsr41.jpg',{
                    type: 'text/plain',
                    lastModified:new Date()
                })
                var formData = new FormData();
                formData.set("menu-item-create-name","UNITTEST");
                formData.set("menu-item-create-description","UNITTEST");
                formData.set("menu-item-create-category","drink");
                formData.set("menu-item-create-calories","100");
                formData.set("menu-item-create-price","2.99");
                formData.set("menu-item-create-ingredient-1","1");
                formData.set("menu-item-create-has-ingredient-1","1");
                formData.set("menu-item-create-ingredient-count-1","1");
                formData.append("fileToUpload",file)
                var url = "http://64.225.29.130/menu/create"
                var method = "POST";
                var response = communication.communicateWithServer(formData, method, url, false);
                console.log("Response text: "+response.status)
                expect(response.status).toBe(200);
})
