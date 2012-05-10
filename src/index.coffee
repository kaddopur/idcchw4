$.ajax({
  url: '/posts'
}).done (msg) ->
  msg_json = eval(msg)
  $('#display_area').html('')
  for g in msg_json
    author_to_display = if g.author then g.author else 'An anonymous person'
    $('#display_area').prepend("<b>#{author_to_display}</b> wrote at #{g.date}:<blockquote>#{g.content}</blockquote>")


$('button').click ->
  $.ajax({
    url: '/sign',
    type: 'POST',
    data: {
      content: $('textarea').val()
    }
  }).done (msg) ->
    msg_json = eval(msg)[0]
    author_to_display = if msg_json.author then msg_json.author else 'An anonymous person'
    $('#display_area').prepend("<b>#{author_to_display}</b> wrote at #{msg_json.date}:<blockquote>#{msg_json.content}</blockquote>")



