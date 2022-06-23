const express = require('express');
const request = require('request');

/* 创建路由 */
const router = express.Router();

function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}

/* 代理外部接口 */
router.get('/qqinfo/:qq', (req, res)=>{
  res.set({'Content-Type': 'application/json'});
  request(`https://api.lixingyong.com/api/qq?id=${req.params.qq}`,function(error, response, body) {
    res.end(body);
  });
});
module.exports = router;
