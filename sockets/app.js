const crypto = require('crypto');

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
    mail: get_mail_md5(socket.mail),
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
  var total_count = 0;
  var counts = {};
  var chan_count = 0;

  io.on('connection',function(socket){
    socket.on('login',function(res){
      /* 赋值个人信息 */
      socket.username = res.username;
      socket.chanid = res.chanid;
      socket.mail = res.mail;

      socket.join(socket.chanid, function () {
        console.log(socket.chanid);
      });
      console.log('昵称:',socket.username)
      total_count++;
      if(counts[socket.chanid]){
        counts[socket.chanid]++;
      } else {
        counts[socket.chanid] = 1;
        chan_count++;
      };
      io.emit('count',{
        chan_count: chan_count,/*频道数量*/
        total_count: total_count,
        chanid: socket.chanid,
        count: counts[socket.chanid]
      });
      console.log(`总人数：${total_count}  频道 ${socket.chanid} 人数：${counts[socket.chanid]}`);
      //socket.emit('msg',{name:socket.username,msg:'连接成功 '+(new Date())});
      emit(socket, '连接成功 '+(new Date()));
    })

    socket.on('send',function(res){ /* 发送给频道用户 */
      //if(socket.chanid != '99999') {
      //io.to(socket.chanid).emit('msg',{name:socket.username,msg:res});
      to_emit(socket, io, res);
      //io.to('99999').emit('msg',{name:socket.username,msg:res});
      //} else {
      //io.emit('msg',{name:socket.username,msg:res});
      //}
    });

    socket.on('disconnect',function(){
      total_count--;
      counts[socket.chanid]--;
      if(counts[socket.chanid] == 0) {
        chan_count--;
      }
      io.emit('count',{
        chan_count,
        total_count: total_count,
        chanid: socket.chanid,
        count: counts[socket.chanid]
      });
    })
  })
};
module.exports = app;
