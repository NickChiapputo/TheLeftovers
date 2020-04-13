function viewStats()
{


	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
            var obj = JSON.parse(this.responseText);
            obj.forEach(function (d){
                getStats(d.name);
            });
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create menu item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/menu/create
	xmlHttp.open( "GET", "http://64.225.29.130/menu/view",true );
	xmlHttp.send();
}

function getStats(name)
{
    var params = {};
	params ['name'] = name;
	var date = new Date();
	var d = date.toISOString();
	alert(d);
    var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
            var obj = JSON.parse(this.responseText);
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create menu item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/menu/create
	xmlHttp.open( "POST", "http://64.225.29.130/menu/stats",true );
	xmlHttp.send(JSON.stringify(params));
}