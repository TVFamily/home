const https = require('https');
const ipp = require('iptv-playlist-parser');
const channel = require('./channel');
const stream = require('./stream');
let liu673cn = {};
let mapName = function (title) { };
liu673cn.sync_stream = async function () {
    return new Promise(function (resolve, reject) {
        https.get('https://iptv-org.github.io/iptv/countries/cn.m3u', async (res) => {
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', async () => {

            })
        }).on('error', function (e) {
            console.log(e);
            reject(e);
        });
    });
};
module.exports = iptv_org;