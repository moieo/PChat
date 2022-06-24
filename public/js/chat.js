const at_user = function(name) {
  const msg = $('#msgcon')[0].value;
  if (msg && msg.length > 0 && msg != '') {
    $('#msgcon').val(`${$('#msgcon').val()} ${name} `);
  } else {
    $('#msgcon').val(`${name} `);
  }
};
/* 对话框 */
const append_bubble = function(con_item, type='left', name, msg, mail) {
  if (type == 'left'){
    con_item.append(`
    <div class="left-bubble">
      <div class="message-head">
        <img class="img-circle avatar" ondblclick="at_user('@${name}')" src="https://cravatar.cn/avatar/${mail}?s=100"></img>
        <div class="message-head-right">
          <div class="nickname">${name}</div>
          <!-- <div>福建省厦门市</div> -->
        </div>
      </div>
      <div class="bubble alert alert-warning">
        <div class="message">
          <!-- ${msg.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")} -->
          ${msg}
        </div>
      </div>
    </div>
  `);
  } else if (type == 'right') {
    con_item.append(`
    <div class="right-bubble">
      <div class="message-head-to-right">
        <div class="message-head-left">
          <div class="nickname">${name}</div>
          <!-- <div>福建省厦门市</div> -->
        </div>
        <img class="img-circle avatar" src="https://cravatar.cn/avatar/${mail}?s=100"></img>
      </div>
      <div class="alert alert-info bubble">
        <div class="message">
          <!-- ${msg.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")} -->
          ${msg}
        </div>
      </div>
    </div>
  `);
  }
  /* 语法高亮 */

  document.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightBlock(block);
  });

  var height = $(document).height();
  $(document).scrollTop(height);
};

/* 软键盘弹出时 页面滚动到最底部 */
if (isAndroid()) {
  const innerHeight = window.innerHeight;
  window.addEventListener('resize', () => {
    const newInnerHeight = window.innerHeight;
    if (innerHeight > newInnerHeight) {
      var height = $(document).height();
      $(document).scrollTop(height);
    }
  });
} else if (isIOS()) {
  window.addEventListener('focusin', () => {
    var height = $(document).height();
    $(document).scrollTop(height);
  });
}

$(document).keyup(function(event){
  if(event.shiftKey && event.keyCode==13){
    $('#send-btn').click();
  }
});

const username = $('meta[name="username"]').attr('content');
const mail = $('meta[name="email"]').attr('content');
const chanid = $('meta[name="chanid"]').attr('content');

/* 创建客户端 */
const socket = io('ws://'+window.location.host);
/* 监听连接 */
socket.on('connect',function(){
  $("#toast > .toast-body").text('连接成功');
  new bootstrap.Toast($('#toast')).show();

  /* 登录成功 向服务器推送 */
  socket.emit('login', {
    username: username,
    chanid: chanid,
    mail: mail
  });
});
const con_item = $('.con_item');

/* 监听服务器推送 */
socket.on('msg',function(res){
  if(username == res.name) {
    append_bubble(con_item,'right',res.name, res.msg, res.mail);
  } else {
    append_bubble(con_item,'left',res.name, res.msg, res.mail);
  }
});
/* 监听在线人数 变更 */
socket.on('count',function(res){
  // $('#count').html(`总人数(${res.total_count})<br/>频道人数(${res.count})<br>频道数量(${res.chan_count})`);
});
socket.on('toast', function(res){
  $("#toast > .toast-body").text(res);
  new bootstrap.Toast($('#toast')).show();
});
$('#login').css('display', 'none');
$('.content-show').css('display', 'block');

/* 发送消息 */
$('#send-btn').on('click', function() {
  const msg = $('#msgcon')[0].value;
  if (!msg && msg.length <= 0 && msg == '') {
    return;
  }
  socket.emit('send', msg);
  $('#msgcon').val('');
  var height = $(document).height();
  $(document).scrollTop(height);
  $('#msgcon').focus();
});
