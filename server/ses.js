const aws = require("aws-sdk");

const ses = new aws.SES({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: "eu-central-1",
});

exports.sendEmail = function (recipient, message, subject) {
    return ses
        .sendEmail({
            Source: process.env.EMAIL,
            Destination: { ToAddresses: [recipient] },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => {
            console.log("Email sent");
        })
        .catch((err) => {
            console.log(err);
            throw new Error("Email not sent");
        });
};
