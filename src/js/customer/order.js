function setData()
{
    // Get table ID
	var tab = sessionStorage.getItem('tableid');

    // Check if table ID is not set or invalid
	if ( tab === null || tab === "" || isNaN( parseInt( tab ) ) || parseInt( tab ) < 1 || parseInt( tab ) > 20 ) 
    {
        console.log( "Bad table ID: " + tab );

        location = "login.html";
	}
    else
    {
        document.getElementById( "table-id" ).innerHTML = "Table " + tab;
        console.log( "Table ID: " + tab );
    }
}