const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuid } = require("uuid");
const { createReadStream } = require("fs");

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const bucketName = process.env.S3_BUCKET;

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

exports.uploadFile = async (filePath) => {
    // Upload a file to the S3 bucket

    const fileStream = createReadStream(filePath);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: `generated/${uuid()}.png`,
    };

    const s3Result = await s3Client.send(new PutObjectCommand(uploadParams))

    console.log(JSON.stringify(s3Result));
}