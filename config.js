// config.js

const { S3 } = require('@aws-sdk/client-s3');
require("dotenv").config();

const s3 = new S3({
  region: "us-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "todos-anastasia-bucket";

module.exports = { s3, BUCKET_NAME };
