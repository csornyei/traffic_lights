const fs = require("fs");
const path = require("path");
const { execSync, exec } = require("child_process");

const clientPath = path.join(__dirname, "client");
const apiPath = path.join(__dirname, "api");

fs.rmdirSync(path.join(clientPath, "build"), { recursive: true });

console.log("Building React App...");
execSync("npm run build", {
    cwd: clientPath
}, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});

console.log("Copying files...");
const buildPath = path.join(clientPath, "build");
const pagesPath = path.join(apiPath, "pages");
if (fs.existsSync(pagesPath)) {
    fs.rmdirSync(pagesPath, { recursive: true });
}
fs.mkdirSync(pagesPath);
const publicPath = path.join(apiPath, "public");
if (fs.existsSync(publicPath)) {
    fs.rmdirSync(publicPath, { recursive: true });
}
fs.mkdirSync(publicPath);

function copyFile(filePath, goalPath) {
    fs.copyFileSync(filePath, goalPath);
}

function copyFolderContent(folderPath, goalPath) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        if (fs.lstatSync(path.join(folderPath, file)).isFile()) {
            if (/.html$/.test(file)) {
                copyFile(path.join(folderPath, file), path.join(pagesPath, file));
            } else {
                copyFile(path.join(folderPath, file), path.join(goalPath, file));
            }
        } else {
            fs.mkdirSync(path.join(goalPath, file));
            copyFolderContent(
                path.join(folderPath, file),
                path.join(goalPath, file)
            );
        }
    })
}

copyFolderContent(buildPath, publicPath);

console.log("Finished! Starting App...");

exec("npm start",
    { cwd: apiPath },
    (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    })