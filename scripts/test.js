const db = require('./db');
let stm = db.prepare('INSERT or ignore INTO stream(channel,url,http_referrer,user_agent,resolution) select id,$url,$http_referrer,$user_agent,$resolution from channel where id=$id',
(err)=>{
    console.warn(err);
});


stm.run({$id:'CCTV1.cn', $url: 'url1', $http_referrer: 'ref', $user_agent: null, $resolution: '4k' },(err)=>{
    console.warn(err);
});
