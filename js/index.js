var delete_post, display_all;

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
    _results.push($('#display_area').append("<div class='post'><button class='close' onclick='delete_post(\"" + g.key + "\")'>&times;</button><b>" + author_to_display + "</b> wrote at <span class='label label-info'>" + g.date + "</span><blockquote>" + g.content + "</blockquote></div>"));
  }
  return _results;
};

$('#send').click(function() {
  if (!$('textarea').val()) return;
  return $.ajax({
    url: '/sign',
    type: 'POST',
    data: {
      content: $('textarea').val()
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
        $('#profile').attr('src', "https://graph.facebook.com/" + response.id + "/picture");
        $('#login').hide();
        return $('#logout').show();
      });
    } else {
      return console.log('User cancelled login or did not fully authorize.');
    }
  });
});

$('#logout').click(function() {
  return FB.logout(function(response) {
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
