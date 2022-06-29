const fs = require('fs-extra');
const db = require('../db');
const pt = require('path');
let now = new Date();
let t = '' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
let channel = {};
let stm_findchannel = db.prepare('select id from channel where id=?');
let stm_build = db.prepare("select * from channel");
channel.log_miss = function (c) {
    return new Promise(function (resolve, reject) {
        stm_findchannel.get(c.id, (err, row) => {
            if (!row) {
                console.log(JSON.stringify(c));
            };
            resolve();
        });
    });
};
channel.build = async function () {
    return new Promise(function (resolve, reject) {
        stm_build.all((err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                let file = pt.join(__dirname, '../../data/iptv/channel.json');
                if (!fs.existsSync(file)) {
                    fs.createFileSync(file);
                }
                fs.writeJSONSync(file, rows, 'utf8', 'w');
                resolve();
            }
        });
    });
}
module.exports = channel;