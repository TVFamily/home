const fs = require('fs-extra');
const db = require('../db');
const pt = require('path');
let stream = {};
let stm_add = db.prepare('INSERT or ignore INTO stream(channel,url,http_referrer,user_agent,resolution) select id,$url,$http_referrer,$user_agent,$resolution from channel where id=$id',
    (err) => {
        if (err) console.log(err);
    });
let stm_build = db.prepare("select s.* from stream s join channel c on c.id=s.channel where c.country=?",
    (err) => {
        if (err) console.log(err);
    });
stream.add = function (s) {
    return new Promise(function (resolve, reject) {
        stm_add.run({
            $id: s.channel,
            $url: s.url,
            $http_referrer: s.http_referrer,
            $user_agent: s.user_agent,
            $resolution: s.resolution
        }, (err) => {
            if (err) { console.log(err); reject(err); }
            else resolve();
        });
    });
};
stream.build = async function (country) {
    return new Promise(function (resolve, reject) {
        if (country) {
            stm_build.all(country.name, (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    let file = pt.join(__dirname, '../../src/data/iptv/', country.code, '/stream.json');
                    if (!fs.existsSync(file)) {
                        fs.createFileSync(file);
                    }
                    fs.writeJSONSync(file, rows, 'utf8', 'w');
                    resolve();
                }
            });
        } else {
            db.all('select code,name from country',async (err, rows) => {
                for (let i = 0; i < rows.length; i++) {
                    await stream.build(rows[i]);
                }
            });
        }
    });
}
module.exports = stream;