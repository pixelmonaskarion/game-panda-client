(async () => {
    var PROTO_PATH = __dirname + '/../proto/pool.proto';
    var grpc = require('@grpc/grpc-js');
    var protoLoader = require('@grpc/proto-loader');
    // Suggested options for similarity to existing grpc.load behavior
    var packageDefinition = protoLoader.loadSync(
        PROTO_PATH,
        {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
        });
    var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
    // The protoDescriptor object has the full package hierarchy
    var routeguide = protoDescriptor.pool;

    let stub = new routeguide.HelloWorld('localhost:50051', grpc.credentials.createInsecure());

    stub.hello({message: "Hello, how are you?", name: "Client"}, function (err, response) {
        if (err) {
            console.log("yo, there's an error: ");
            console.log(err);
        } else {
            console.log("got response:");
            console.log(response.message + " from " + response.name);
        }
    });
})()