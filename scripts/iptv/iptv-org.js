const https = require('https');
const ipp = require('iptv-playlist-parser');
const channel = require('./channel');
const stream = require('./stream');
let iptv_org = {};
let mapName = function (title) {
  let m = title.indexOf('(');
  let name = title;
  let id = null;
  let resolution = null;
  if (m > 0) {
    name = title.substring(0, m);
    let n = title.indexOf(')');
    resolution = title.substring(m + 1, n);
  } else {
    m = title.indexOf('[');
    if (m > 0) {
      name = title.substring(0, m);
    }
  }
  name = name.trim();
  if (name.indexOf('CCTV') == 0) {
    let reg = /(CCTV-\d+)/g;
    let match = name.match(reg);
    if (match) {
      name = name.replace(match[0], match[0] + ' ');
      id = match[0].replace('-', '') + '.cn';
    }
    else if (name == 'CCTV+ 1') {
      id = 'CCTVPlus1.cn';
    }
    else if (name == 'CCTV+ 2') {
      id = 'CCTVPlus2.cn';
    }
    else if (name == 'CCTV-5+ 体育赛事') {
      id = 'CCTV5Plus.cn';
    }
  }
  else {
    id = name + '.cn';
  }
  return { id: id, name: name, resolution: resolution };
}
iptv_org.sync_stream = async function () {
  return new Promise(function (resolve, reject) {
    https.get('https://iptv-org.github.io/iptv/countries/cn.m3u',async (res) => {
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end',async () => {
        let streams = ipp.parse(rawData).items;
        for(let i=0;i<streams.length;i++){
          let s=streams[i];
          let r = mapName(s.name);
          await stream.add({
            channel: r.id,
            url: s.url,
            resolution: r.resolution,
            http_referrer: s.http ? s.http.referrer ? s.http.referrer : null : null,
            user_agent: s.http ? s.http.user_agent ? s.http.user_agent : null : null
          });
          await channel.log_miss(r);
        }
        resolve();
      });
    }).on('error', function (e) {
      console.log(e);
      reject(e);
    });
  });
};

module.exports = iptv_org;