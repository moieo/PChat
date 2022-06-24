const crypto = require('crypto');
const marked = require('marked');
const config = require('../config');
const utils = require('./utils')

/* 渲染 MarkDown */
if (config.markdownMessage) {
  marked.setOptions({
    renderer: new marked.Renderer(),
    langPrefix: 'hljs language-',
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });
}
/* MD5 加密邮箱 */
const get_mail_md5 = function(mail_dest) {
  var mail = '';
  if (/^[1-9][0-9]{4,12}$/.test(mail_dest)){
    mail = `${mail_dest}@qq.com`;
  } else if(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(mail_dest)){
    mail = mail_dest;
  }
  return crypto.createHash('md5').update(mail).digest("hex");
};

const emit = function(socket, msg) {
  socket.emit('msg', {
    name: socket.username,
    mail: get_mail_md5(socket.mail), /* 把邮箱 md5 加密后传给客户端 */
    msg: msg
  });
};

const to_emit = function(socket, io, msg) {
  io.to(socket.chanid).emit('msg',{
    name: socket.username,
    mail: get_mail_md5(socket.mail),
    msg: msg
  });
};

const app = function(server) {
  var io = require('socket.io')(server);
  var counter = {
    total_count: 0, /* 总人数 */
    chan_counts: {}, /* 分频道人数 */
    chan_count: 0 /* 频道数量*/
  };
  io.on('connection',function(socket){
    socket.on('login',function(res){
      /* 赋值个人信息 */
      socket.username = res.username;
      socket.chanid = res.chanid;
      socket.mail = res.mail;

      /* 加入频道 */
      socket.join(socket.chanid);
      counter.total_count++;
      if(counter.chan_counts[socket.chanid]){
        counter.chan_counts[socket.chanid]++;
      } else {
        counter.chan_counts[socket.chanid] = 1;
        counter.chan_count++;
      };
      io.emit('count',{
        chan_count: counter.chan_count,/*频道数量*/
        total_count: counter.total_count,
        chanid: socket.chanid,
        count: counter.chan_counts[socket.chanid]
      });
      // console.log(`总人数：${counter.total_count}  频道 ${socket.chanid} 人数：${counter.chan_counts[socket.chanid]}`);
      //socket.emit('msg',{name:socket.username,msg:'连接成功 '+(new Date())});
    })

    socket.on('send',function(res){ /* 发送给频道用户 */
      //if(socket.chanid != '99999') {
      //io.to(socket.chanid).emit('msg',{name:socket.username,msg:res});
      if (config.markdownMessage) { /* 开启 MarkDown 的情况 */
        to_emit(socket, io, marked.parse(res));
      } else {
        /* 屏蔽 HTML 中的 script style 标签 */
        if (utils.checkHtml(res) && config.checkHtml) {
          socket.emit('toast', "发送失败，包含不安全内容");
          return;
        }
        to_emit(socket, io, res);
      }
      //io.to('99999').emit('msg',{name:socket.username,msg:res});
      //} else {
      //io.emit('msg',{name:socket.username,msg:res});
      //}
    });
    socket.on('getcount', function(res){
      socket.chanid = 'index';
      socket.join(socket.chanid);
      io.to(socket.chanid).emit('count', {
        chan_count: counter.chan_count,
        total_count: counter.total_count
      });
      console.log('getcount', counter.total_count);
    });
    socket.on('disconnect',function(){
      /* 防止刷新后首页人数显示为0 */
      if (socket.chanid == 'index') {
        return;
      }
      counter.total_count--;
      counter.chan_counts[socket.chanid]--;
      if(counter.chan_counts[socket.chanid] === 0) {
        counter.chan_count--;
      }
      /* 不加这两行运行久了会出现负数 不知道为啥 */
      if(counter.total_count < 0) counter.total_count = 0;
      if(counter.chan_count < 0) chan_count = 0;
      io.to(socket.chanid).emit('toast', `${socket.username} 退出了会话`);
      io.emit('count',{
        chan_count: counter.chan_count,
        total_count: counter.total_count,
        chanid: socket.chanid,
        count: counter.chan_counts[socket.chanid]
      });
    })
  })
};
module.exports = app;
