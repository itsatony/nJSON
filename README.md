nJSON
=====

nJSON is a service to log json data to a redis-instance and display&filter it via a json web tree-view.

https://njson.itsatony.com is a public (and free) nJSON server instance anybody can use to log JS variables/json data to and explore it.

any kind of contributions are super welcome!



## the njson repository includes

- a simple server you can run on your own machine. ( alternatively, using https://njson.itsatony.com is free )

    - (with a http GET)  /?id={{id}} uses http://erffun.github.io/jsontree/ to show data stored in the given redis key (id)

    - (with a http POST or PUT)  /?id={{id}} checks for JSON data format and writes that into the redis key id

    - all submitted data is auto-deleted after 24h

- a simple nodejs client that can be used from any nodejs project to log variables to njson

    - it allows easily sending json to any njson server like this

````
	var nJSON = require('njson');
	var njsonClient = nJSON.client();
	sendJSON(variable, href, callback); 
	// href is optional and defaults to njson.itsatony.com .
	// callback is optional. you will receive the id to access your data.
	// check https://github.com/itsatony/nJSON/blob/master/client-example.js for details.
````


- a jQuery dependent client-library that allows sending of variables to njson from any browser-js app

````
	<head>
		<script src="https://njson.itsatony.com/lib/nJSON-jquery.js" type="text/javascript"></script>
		<script type="text/javascript">
			njson(someVariable, someId);
			// someId is optional. if you want to supply it, it needs to be 45 characters in length
		</script>
	</head>
````



## install

$ npm install njson


## demos

### server

$ node example-server <port> <hostname>


### client

$ node example-client <port> <hostname>

