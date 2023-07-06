const {HelloRequest} = require('./pool_pb.js');
const {HelloWorldClient} = require('./pool_grpc_web_pb.js');

var client = new HelloWorldClient('http://chrissytopher.com:50051');

var request = new HelloRequest();
request.setName('Client');
request.setMessage("Hello, Server!")

client.hello(request, {}, (err, response) => {
  if (err) {
    console.log(`Unexpected error for sayHello: code = ${err.code}` +
                `, message = "${err.message}"`);
    console.log(err);
  } else {
    console.log(response.getMessage() + " from " + response.getName());
  }
});