const AWS = require('aws-sdk');

const s3 = new AWS.S3()

const getObjectParams = {
    Bucket: process.env.BUCKET,
    Key: process.env.KEY
};

console.log(s3.config.endpoint)

console.log('calling s3.getObject with params: ' + JSON.stringify(getObjectParams))

s3.getObject(getObjectParams, (err, data) => {
    if (err) {
        throw(err)
    }
    console.log('Success!')
})