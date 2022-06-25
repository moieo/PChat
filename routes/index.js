const express = require('express');
const sm2 = require('sm-crypto').sm2;
const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp');
const sd = require("silly-datetime");
const config = require('../config');

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
      data: data,
      uploadImg: config.uploadImg,
      markdown: config.markdownMessage
    });
  } catch {
    res.render('chat', {
      title: '无效的请求 - PChat',
      data: 0
    });
  }
});

if (config.uploadImg) { /* 上传图片 */
  const storage = multer.diskStorage({
    destination: async function (req, file, callback) { /* 生成文件夹名 */
      let day = sd.format(new Date(), "YYYYMMDD");
      let dir = path.join(config.uploadImgPath, day);
      req.dirName = day;
      await mkdirp(dir);
      callback(null, dir);
    },
    filename: function (req, file, callback) { /* 生成文件名 */
      let extName = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = file.fieldname + '-' + uniqueSuffix + extName;
      req.fileName = fileName;
      callback(null, fileName);
    }
  });
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
      const filetypes = /(jpeg|jpg|png|gif)$/;
      const extname = filetypes.test(
        path.extname(file.originalname).toString()
      );
      const mimetype = filetypes.test(file.mimetype);
      if (mimetype && extname) {
        return callback(null, true);
      } else {
        callback("只能上传图片");
      }
    },
    limits: {
      fileSize: config.uploadImgMaxSize
    }
  }).single('img');
  /* 上传图片 */
  router.post('/img/upload', function(req, res) {
    upload(req,res,function(err) {
      if(err) {
        var msg = `${err}`;
        const size = parseInt(req.header('Content-Length'));
        if (size > config.uploadImgMaxSize) {
          msg = '文件过大';
        }
        res.json({
          code: 500,
          msg: msg
        });
        return;
      }
      console.log(req.file);
      const url = `${config.uploadImgURL}${config.uploadImgDirName}/${req.dirName}/${req.fileName}`;
      res.json({
        code: 200,
        url: url,
        msg: 'success'
      });
    }); 
  });
}

module.exports = router;
