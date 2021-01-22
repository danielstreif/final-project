const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedimageboardbucket",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(404);
        });
};

exports.delete = (filename) => {
    const params = {
        Bucket: "spicedimageboardbucket",
        Key: filename,
    };

    const promise = s3
        .deleteObject(params, (err, data) => {
            if (err) {
                console.log(err);
            }
        })
        .promise();

    promise
        .then(() => {
            console.log("successfully deleted image");
        })
        .catch((err) => {
            console.log(err);
        });
};
