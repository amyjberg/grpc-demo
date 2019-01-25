const PROTO_PATH = __dirname + '/analytics.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})
const analytics_proto = grpc.loadPackageDefinition(packageDefinition).analytics;

const main = () => {
    const client = new analytics_proto.Events('localhost:50051', grpc.credentials.createInsecure());

    const event = {
        sessionData: {
            account_id: 'test',
            browser: 'Chrome',
        },
        eventQueue: {
            event_action: 'track',
            event_category: 'analytics',
            hit_number: 'string to see if this throws client error' // schema says this should be a number, so it gets converted to a 0
        },
        slyce_id: 'test',
        space_id: 'fake space id',
    }

    try {
        client.trackEvent(event, (err, res) => {
            // if there is a problem with a missing required schema field, it doesn't even hit the server
            if (err) {
                console.log('got an error :(!', err);
            } else {
                console.log('response from server:', res);
            }
        });
    } catch (err) {
        console.log('Error - make sure to check the schema against your request!', err)
    }
}

main();