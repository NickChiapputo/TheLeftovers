function communicateWithServer( data, request, url, asynchronous )
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( request, url, asynchronous );
	xmlHttp.send( data );
	return xmlHttp;
}