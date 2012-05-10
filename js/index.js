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
    _results.push($('#display_area').append("<div class='post'><button class='close' onclick='delete_post(\"" + g.key + "\")'>&times;</button><b>" + author_to_display + "</b> wrote at " + g.date + ":<blockquote>" + g.content + "</blockquote></div>"));
  }
  return _results;
};

$('#send').click(function() {
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

$.ajax({
  url: '/posts'
}).done(function(msg) {
  return display_all(msg);
});
