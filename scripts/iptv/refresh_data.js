const iptv_org = require('./iptv-org');
const channel = require('./channel');
const stream = require('./stream');
const fs = require('fs-extra');
const db = require('../db');
const pt = require('path');
async function main() {
    await iptv_org.sync_stream();
    await channel.build();
    await stream.build();
    console.log('refresh iptv data done');
};
main();
