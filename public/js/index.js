const publicKey = '04fef35280bfdd70272946468420e54045eecd7f99099b594a3590899a49dcae2b7d803366c37553fd49cdd971ffe16d73a904555138dcfc9e51071c4105edfe6f';
$(function(){
  const moieo = {
    is_qq: function(qq) {
      return /^[1-9][0-9]{4,12}$/.test(qq);
    },
    is_email: function(email) {
      return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
    }
  };

  /* 实时人数 */
  const socket = io('ws://'+window.location.host);
  socket.on('connect', function(){
    socket.emit('getcount', 0);
  });
  socket.on('count',function(res){
    $('#online-num').text(res.total_count);
    $('#chanid-num').text(res.chan_count);
  });
  
  $('#contact').on('click', function() {
    const form = $('#quick-start');
    const username = $('#username').val();
    const email = $('#email').val();
    const chanid = $('#chanid').val();

    if (username.length > 15) {
      alert(`昵称过长，最大长度 15，当前长度 ${username.length}`);
      return;
    }

    if (!moieo.is_email(email) && !moieo.is_qq(email)) {
      alert('QQ或邮箱不合法')
      return;
    }
    const data = JSON.stringify({
      username: username,
      email: email,
      chanid: chanid
    });
    const sm4_data = sm2.doEncrypt(data, publicKey, 1);
    form.attr('action', '/chat/'+sm4_data);
    form.submit();
  });
  /* 监听QQ输入框*/
  $('#email').on('input',function(){
    if(/^[1-9][0-9]{4,12}$/.test($('#email').val())) {
      $('#qq-get').show();
    } else {
      $('#qq-get').hide();
    }
  });

  /* 获取QQ信息 */
  $('#qq-get').on('click', function(){
    $.get('/api/qqinfo/'+$('#email').val(), function(data) {
      $('#username').val(data.nickname);
    });
  });
});
