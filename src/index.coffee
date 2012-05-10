delete_post = (key) ->
  $.ajax({
    url: '/post',
    type: 'POST',
    data: {
      key: key
    }
  }).done (msg) ->
    display_all(msg)

display_all = (msg)->
  msg_json = eval(msg)
  $('#display_area').html('')
  for g in msg_json
    author_to_display = if g.author then g.author else 'An anonymous person'
    $('#display_area').append("<div class='post'><button class='close' onclick='delete_post(\"#{g.key}\")'>&times;</button><b>#{author_to_display}</b> wrote at #{g.date}:<blockquote>#{g.content}</blockquote></div>")

# upload post & refresh
$('#send').click ->
  $.ajax({
    url: '/sign',
    type: 'POST',
    data: {
      content: $('textarea').val()
    }
  }).done (msg) ->
    display_all(msg)

# load posts
$.ajax({
  url: '/posts'
}).done (msg) ->
  display_all(msg)



