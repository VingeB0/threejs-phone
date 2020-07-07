const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();

// here you can setup name for project on FTP. For example "my-project-v2"
const folderName = __dirname.split('/').slice(-1)[0];

const ftpPath = "/website.com/www/webgl/" + folderName;
const productionLink = "http://website.com/webgl/" + folderName;

const config = {
    user: "user",
    password: "password",
    host: "host",
    port: 8080,
    localRoot: __dirname + '/dist',
    remoteRoot: ftpPath,
    include: ["*"],
    // here you can files that will not be pushed to ftp. For example "icons/*"
    exclude: [],
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: true,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: true
};

ftpDeploy.on("uploading", (data) => {
    console.log("Transferred: ", data.transferredFileCount + 1 + '/' + data.totalFilesCount, ' Filename: ' + data.filename);
});

ftpDeploy.on("upload-error", function (data) {
    console.log(data.err);
});

ftpDeploy
    .deploy(config)
    .then(res => console.log("All files uploaded. T3D production presents: " + productionLink))
    .catch(err => console.log(err));

