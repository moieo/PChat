var express = require('express');
const sm2 = require('sm-crypto').sm2;

var router = express.Router();
const privateKey = 'a33d342b55e606792133b696c2df1c126735275400355e83217a7cf4296a495c';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'PChat - 聊天室'
  });
});

router.get('/chat/:data', function(req, res, next) {
  const sm2_data = sm2.doDecrypt(req.params.data, privateKey, 1);
  try {
    var data = JSON.parse(sm2_data);
    data.sign = sm2.doSignature(sm2_data, privateKey);
    res.render('chat', {
      title: 'PChat',
      data: data
    });
  } catch {
    res.render('chat', {
      title: '无效的请求 - PChat',
      data: 0
    });
  }
});

module.exports = router;
