function add() {
    var req = document.getElementById("request").value;
    req += '\n';
    var text = document.createTextNode(req);
    var node = document.createElement("LI");
    node.appendChild(text);
    document.getElementById("list").appendChild(node);
    document.getElementById("request").value = "";
}

function remove() {
    var list = document.getElementById("list");
    if (list.childNodes.length > 0) {
      list.removeChild(list.childNodes[list.childNodes.length - 1]);
    }
}
  
function clearList() {
    var list = document.getElementById("list");
    while (list.childNodes.length > 0) {
      list.removeChild(list.childNodes[list.childNodes.length - 1]);
    }
    var obj=Cookies.getJSON('current_order');
    obj['notes'] = '';
    Cookies.set('current_order', JSON.stringify(obj), { path: '/Customer%20App', sameSite: 'strict'});
}

function submitList(ordItem) {
    var list = document.getElementById('list');
    var str = list.textContent;
    arr = str.split('\n');
    var specRequest = "";
    var temp
    for (i=1; i < (arr.length - 1); i++) {
      temp = arr[i];
      while (temp[0] == ' ') {
        temp = temp.slice(1);
      }
      specRequest = specRequest.concat(i, '. ', temp, '. ');
    }
    if (ordItem == 1) {
      var obj=Cookies.getJSON('current_item');
      obj['notes'] = specRequest;
      Cookies.set('current_item', JSON.stringify(obj), { path: '/Customer%20App', sameSite: 'strict'});
    }
    else {
      var obj=Cookies.getJSON('current_order');
      obj['notes'] = specRequest;
      Cookies.set('current_order', JSON.stringify(obj), { path: '/Customer%20App', sameSite: 'strict'});
    }
}