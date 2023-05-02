const FtpDeploy = require("ftp-deploy"),
    config = require("./config/config.json"),
    ftpDeploy = new FtpDeploy();

const configs = {
    user: config.ftp.user,
    // Password optional, prompted if none given
    password: config.ftp.password,
    host: config.ftp.host,
    port: config.ftp.port,
    localRoot: __dirname + "/",
    remoteRoot: "/www/",
    // include: ["*", "**/*"],      // this would upload everything except dot files
    include: ["*.js", "views/*", "src/*", ".*", "views/partials/*", "src/*/*", "index.js", "package*","*.json"],
    // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
    exclude: [
        "dist/**/*.map",
        "node_modules/**",
        "node_modules/**/.*",
        ".git/**",
        "src/people/*",
    ],
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: false,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: true,
    // use sftp or ftp
    sftp: false,
};

ftpDeploy
    .deploy(configs)
    .then((res) => console.log("finished:", res))
    .catch((err) => console.log(err));