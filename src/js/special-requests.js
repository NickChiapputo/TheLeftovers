function add() {
    var req = document.getElementById("request").value;
    var text = document.createTextNode(req);
    var node = document.createElement("LI");
    node.appendChild(text);
    document.getElementById("list").appendChild(node);
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
}