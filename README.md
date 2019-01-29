# gRPC Analytics Event Tracking

### "npm run start"
Starts the grpc server on 50051

### "npm run client"
Makes request to grpc server

### "npm run proxy"
Runs proxy server on 8080
Make a HTTP1 request to /accounts/{account_id}/spaces/{space_id}/analytics/events
REST request body will get mapped to TrackEventRequest
