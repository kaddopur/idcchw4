var delete_post, display_all, user_name, user_picture;

user_name = 'Anonymous';

user_picture = 'img/yetlogin.png';

delete_post = function(key) {
  return $.ajax({
    url: '/post',
    type: 'POST',
    data: {
      key: key
    }
  }).done(function(msg) {
    return display_all(msg);
  });
};

display_all = function(msg) {
  var author_to_display, g, msg_json, _i, _len, _results;
  msg_json = eval(msg);
  $('#display_area').html('');
  _results = [];
  for (_i = 0, _len = msg_json.length; _i < _len; _i++) {
    g = msg_json[_i];
    author_to_display = g.author ? g.author : 'An anonymous person';
    _results.push($('#display_area').append("<div class='post'><img src=\"" + (g.picture ? g.picture : 'img/yetlogin.png') + "\"><div><button class='close' onclick='delete_post(\"" + g.key + "\")'>&times;</button><b>" + author_to_display + "</b> wrote at <span class='label label-info'>" + g.date + "</span><blockquote>" + g.content + "</blockquote></div></div>"));
  }
  return _results;
};

$('#send').click(function() {
  var user_content;
  if (!$('textarea').val()) return;
  user_content = $('textarea').val();
  $('textarea').val('');
  return $.ajax({
    url: '/sign',
    type: 'POST',
    data: {
      author: user_name,
      content: user_content,
      picture: user_picture
    }
  }).done(function(msg) {
    return display_all(msg);
  });
});

$('#login').click(function() {
  return FB.login(function(response) {
    if (response.authResponse) {
      console.log('Welcome!  Fetching your information.... ');
      return FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
        user_name = response.name;
        user_picture = "https://graph.facebook.com/" + response.id + "/picture";
        $('#profile').attr('src', user_picture);
        $('#login').hide();
        $('#logout').show();
        return console.log(response);
      });
    } else {
      return console.log('User cancelled login or did not fully authorize.');
    }
  });
});

$('#logout').click(function() {
  return FB.logout(function(response) {
    user_name = 'Anonymous';
    user_picture = 'img/yetlogin.png';
    $('#profile').attr('src', "img/yetlogin.png");
    $('#login').show();
    return $('#logout').hide();
  });
});

$.ajax({
  url: '/posts'
}).done(function(msg) {
  return display_all(msg);
});

$('#logout').hide();
