const {add, remove, clearList, submitList} = require('../js/special-requests');

test('The following should add the word hello to the list',() => {
    document.body.innerHTML='<ol id="list" style="text-align: left;">'
    +'<input type="text" autocomplete="off" id="request" style="width: 90%;">';
    //add
    var text = document.createTextNode('Hello');
    var node = document.createElement("LI");
    node.appendChild(text);
    console.log("Original list size= "+document.getElementById("list").childElementCount);
    document.getElementById("list").appendChild(node);
    console.log("This was added to the list "+document.getElementById("list").textContent);
    expect(document.getElementById("list").childElementCount).toBe(2);
    console.log("New list size= "+document.getElementById("list").childElementCount+"\n\n");

})


test('The following should remove a word from the list',() => {
    document.body.innerHTML='<ol id="list" style="text-align: left;">'
    +'<input type="text" autocomplete="off" id="request" style="width: 90%;">';
    //add
    var text = document.createTextNode('Hello');
    var node = document.createElement("LI");
    console.log("Original list size= "+document.getElementById("list").childElementCount)
    node.appendChild(text);
    document.getElementById("list").appendChild(node);
    console.log("This was added to the list "+document.getElementById("list").textContent);
    expect(document.getElementById("list").childElementCount).toBe(2);
    //remove
    console.log("New list size= "+document.getElementById("list").childElementCount);
    var list = document.getElementById("list");
    list.removeChild(list.childNodes[list.childNodes.length - 1])
    console.log("Final list size= "+document.getElementById("list").childElementCount+"\n\n");
    expect(document.getElementById("list").childElementCount).toBe(1)
});

