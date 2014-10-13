nJSON
=====

a service to log from nodeJS to a json web tree-view


## system

- a simple server that

  - opens a http port

  - route / assigns a uuid to a new connection and redirects to /get/{{uuid}}

  - route (with a http GET)  /{{uuid}} uses http://erffun.github.io/jsontree/ to show data stored in the given redis key (uuid)

  - route (with a http POST or PUT)  /{{uuid}} checks for JSON data format and writes that into the redis key uuid

  - all submitted data is auto-deleted after 24h


- a simple log client that

  - allows njson.send(object, config) to deliver json objects to redis via the server 


## install

$ npm install njson


## demos

### server

$ node example-server <port> <hostname>


### client

$ node example-client <port> <hostname>

