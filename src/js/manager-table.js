function getTableList() {

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			var txt ="";
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
      //get total number of tables
      var numTables = Object.keys(obj).length;
      //loop through tables
      for (var i = 0; i < numTables; i++){
        //Shows the manager every table and their status
        var currentTable = obj[i];
        	placeTable(currentTable.table, currentTable.status);
      }

		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/tables/view
	xmlHttp.open( "GET", "http://64.225.29.130/tables/view", true );
	xmlHttp.send();
}

//places the table in the table of statuses
function placeTable(tableNum, status){
  var table = document.getElementById("table-table");


  //enter max amount of rows
  if (table.rows.length < 22){
    for (var i = table.rows.length; i < 22; i++){
      var r = table.insertRow(table.rows.length);
      r.style.backgroundColor = "lavender";
      r.style.color = "white";
      for (var j = 0; j < 4; j++){
        var c = r.insertCell(j);
        c.innerHTML = "";
      }
    }
  }
  
  var col = 0;
  //get correct column
  switch (status){
    case "sitting":
      col = 0;
      break;
    case "ordered":
      col = 1;
      break;
    case "eating":
      col = 2;
      break;
    case "partially paid":
      col = 3;
      break;
  }

console.log(status)
  //place table button in table
  for (var i = 1; i < table.rows.length; i++){
    if (table.rows[i].cells[col].innerHTML == "") {
      table.rows[i].cells[col].innerHTML = '<button type="button" class="col btn btn-primary menu-box" value="' +  tableNum  + '" onclick="store(this.value)" data-toggle="modal" data-target="#table" style="height: 200px; width: 200px;">' + tableNum + '</button></td>';
      //alert(table.rows[i].cells[col].innerHTML);
      break;
    }
  }





}

function store(value){
	Cookies.set('table-num', value, {path: '/', sameSite: 'strict'});
	alert(Cookies.get('table-num'));
}

module.exports = {store, getTableList, getTableList} ;
