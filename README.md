nJSON
=====

a service to log from nodeJS to a json web tree-view


## system

- a simple server that

  - opens a http port

  - route / assigns a id to a new connection and redirects to /?id={{id}}

  - route (with a http GET)  /?id={{id}} uses http://erffun.github.io/jsontree/ to show data stored in the given redis key (id)

  - route (with a http POST or PUT)  /?id={{id}} checks for JSON data format and writes that into the redis key id

  - all submitted data is auto-deleted after 24h


- a simple log client that

  - allows sendJSON(variable, href, callback) to deliver json objects to redis via the server 


## install

$ npm install njson


## demos

### server

$ node example-server <port> <hostname>


### client

$ node example-client <port> <hostname>

