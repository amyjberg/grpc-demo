const grpc = require('grpc');
const AnalyticsOperator = require('./analytics_operator');
const TrackAnalyticsEvent = require('./track_analytics_event');
let server;

const analyticsOperator = new AnalyticsOperator();
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

const trackEvent = async (call, callback) => {
    let req = call.request;

    // helper functions that will actually do something eventually?
    function ipToGeolocation(ip) {
        const geoloc = {};
        return geoloc;
    }

    function latLongToGeolocation(latLong) {
        const geoloc = {};
        return geoloc;
    }

    // if no session data and/or event queue is provided, they are undefined on req
    if (!req.session_data) {
        req.session_data = {};
    }

    if (!req.event_queue) {
        req.event_queue = {};
    }

    // check for user_id and slyce_id
    if (req.session_data.slyce_id) {
        req.session_data.account_id = req.session_data.slyce_id;
        delete req.session_data.slyce_id;
    }
    if (req.session_data.user_id) {
        req.session_data.fingerprint = req.session_data.user_id;
        delete req.session_data.user_id;
    }

    try {
        const command = new TrackAnalyticsEvent(req.session_data.account_id, req.session_data, req.session_data.fingerprint);
        let res = await analyticsOperator.eventTracking(command);
        callback(null, res);
    } catch (err) {
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

