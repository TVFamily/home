const iptv_org = require('./iptv-org');
const channel = require('./channel');
const stream = require('./stream');
const fs = require('fs-extra');
const db = require('../db');
const pt = require('path');
let build_metadata = async function (sql, par, file) {
    return new Promise(function (resolve, reject) {
        db.all(sql, par, (err, rows) => {
            if (err) { console.log(err); reject(); }
            else {
                if (!fs.existsSync(file)) {
                    fs.createFileSync(file);
                }
                fs.writeJSONSync(file, rows, 'utf8', 'w');
                resolve(rows);
            }
        })
    });
};
let build_all_meta = async function () {
    await build_metadata('select * from country where 1=?;', 1, pt.join(__dirname, '../../src/data/iptv/country.json'))
        .then(async (countrys) => {
            for (let i = 0; i < countrys.length; i++) {
                await build_metadata("select * from subdivision where country=?",
                    countrys[i].code,
                    pt.join(__dirname, '../../src/data/iptv/', countrys[i].code, '/subdivision.json'));
                await build_metadata('select c.* from city c join subdivision s on s.name=c.subdivision where s.country=?',
                    countrys[i].code,
                    pt.join(__dirname, '../../src/data/iptv/', countrys[i].code, '/city.json'));
            }
        });
}
async function main() {
    await build_all_meta();
    await iptv_org.sync_stream();
    await channel.build();
    await stream.build();
    console.log('refresh iptv data done');
};
main();
