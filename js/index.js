(function() {

  $.ajax({
    url: '/posts'
  }).done(function(msg) {
    var author_to_display, g, msg_json, _i, _len, _results;
    msg_json = eval(msg);
    $('#display_area').html('');
    _results = [];
    for (_i = 0, _len = msg_json.length; _i < _len; _i++) {
      g = msg_json[_i];
      author_to_display = g.author ? g.author : 'An anonymous person';
      _results.push($('#display_area').prepend("<b>" + author_to_display + "</b> wrote at " + g.date + ":<blockquote>" + g.content + "</blockquote>"));
    }
    return _results;
  });

  $('button').click(function() {
    return $.ajax({
      url: '/sign',
      type: 'POST',
      data: {
        content: $('textarea').val()
      }
    }).done(function(msg) {
      var author_to_display, msg_json;
      msg_json = eval(msg)[0];
      author_to_display = msg_json.author ? msg_json.author : 'An anonymous person';
      return $('#display_area').prepend("<b>" + author_to_display + "</b> wrote at " + msg_json.date + ":<blockquote>" + msg_json.content + "</blockquote>");
    });
  });

}).call(this);
