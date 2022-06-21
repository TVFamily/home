const fs = require('fs-extra');
const pt = require('path');

async function main() {
    if (process.argv.length>2) {
        let path = pt.join(__dirname, '../src/data/version.json')
        let now = new Date();
        let newVersion = '' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
        var j = fs.readJSONSync(path);

        if (process.argv[2] == 'iptv') {
            j["iptv"] = newVersion;
        }
        fs.writeJSONSync(path,j,'utf8','w');
    }
}
main();