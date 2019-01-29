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
// const analyticsSchema = require('./analytics_pb.js');

const main = () => {
    const client = new analytics_proto.Events('localhost:50051', grpc.credentials.createInsecure());


    /* when we have the generated JS classes, we can use them to create our instances */
    // const request = new analyticsSchema.TrackEventRequest();
    // request.setAccountId('test');
    // request.setSpaceId('fake space id');
    // const session = new analyticsSchema.SessionData();
    // session.setBrowser('Chrome');
    // session.setAccountId('test');
    // request.setSessionData(session);
    // const queue = new analyticsSchema.EventQueue();
    // queue.setEventAction('track');
    // queue.setEventCategory('analytics');
    // queue.setHitNumber(6);
    // request.setEventQueue(queue);
    // console.log(request.toObject());

    const request = {
        session_data: {
            account_id: 'test',
            browser: 'Chrome',
        },
        event_queue: {
            event_action: 'track',
            event_category: 'analytics',
            hit_number: 'string to see if this throws client error' // schema says this should be a number, so it gets converted to a 0
        },
        slyce_id: 'test',
        space_id: 'fake space id',
    }

    try {
        client.trackEvent(request, (err, res) => {
            // if there is a problem with a missing required schema field, it doesn't even hit the server
            if (err) {
                console.log('::::::::::::: got an error :( :::::::::::::');
                console.log(err);
            } else {
                console.log('::::::::::: response from server :D :::::::::::');
                console.log(res);
            }
        });
    } catch (err) {
        console.log('Error - make sure your request matches the request interface in analytics.proto!', err)
    }
}

main();