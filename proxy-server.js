
// proxy is listening on port 8080
const grpcGateway = require('grpc-dynamic-gateway')
const express = require('express')
const bodyParser = require('body-parser')
const grpc = require('grpc');


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', grpcGateway(['analytics.proto'], '0.0.0.0:50051', grpc.credentials.createInsecure(), true, '.', grpc));

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Listening on http://0.0.0.0:${port}`)
});