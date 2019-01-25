const grpc = require('grpc');
const AnalyticsOperator = require('./analytics_operator');
const TrackAnalyticsEvent = require('./track_analytics_event');
let server;

const analyticsOperator = new AnalyticsOperator();
// use @grpc/proto-loader to load JS version
const PROTO_PATH = __dirname + '/analytics.proto';
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const analytics_proto = grpc.loadPackageDefinition(packageDefinition).analytics;

const trackEvent = async (call, callback) => { // anything that hits the server should fit the schema
    let req = call.request;
    console.log('what is our hit_number?', req.eventQueue.hit_number);

    function ipToGeolocation(ip) {
        const geoloc = {};
        return geoloc;
    }

    function latLongToGeolocation(latLong) {
        const geoloc = {};
        return geoloc;
    }

    // we don't have to add space id because it will be on the request as per the message schema...

    // check for user_id and slyce_id because they aren't in the message proto
    if (req.sessionData.slyce_id) {
        req.sessionData.accountId = req.sessionData.slyce_id;
        delete req.sessionData.slyce_id;
    }
    if (req.sessionData.user_id) {
        req.sessionData.fingerprint = req.sessionData.user_id;
        delete req.sessionData.user_id;
    }

    try {
        const command = new TrackAnalyticsEvent(req.sessionData.account_id, req.sessionData, req.sessionData.fingerprint);
        let res = await analyticsOperator.eventTracking(command);
        // how to check if we get an error back?
        callback(null, res);
    } catch (err) {
        console.log('Server error in trackEvent');
        callback(err, null);
    }
}

const startServer = () => {
    server = new grpc.Server();
    server.addService(analytics_proto.Events.service, {
        trackEvent: trackEvent
    });
    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('Server started...');
}

startServer();

