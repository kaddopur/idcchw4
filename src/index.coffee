user_name = 'Anonymous'
user_picture = 'img/yetlogin.png'

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
    $('#display_area').append("<div class='post'><img src=\"#{if g.picture then g.picture else 'img/yetlogin.png'}\"><div><button class='close' onclick='delete_post(\"#{g.key}\")'>&times;</button><b>#{author_to_display}</b> wrote at <span class='label label-info'>#{g.date}</span><blockquote>#{g.content}</blockquote></div></div>")


# upload post & refresh
$('#send').click ->
  return unless $('textarea').val()
  user_content = $('textarea').val()
  $('textarea').val('')

  $.ajax({
    url: '/sign',
    type: 'POST',
    data: {
      author: user_name,
      content: user_content,
      picture: user_picture
    }
  }).done (msg) ->
    display_all(msg)


# fb login
$('#login').click ->
  FB.login (response) ->
    if response.authResponse
      console.log('Welcome!  Fetching your information.... ')
      FB.api('/me', (response) ->
        console.log('Good to see you, ' + response.name + '.')
        user_name = response.name
        user_picture = "https://graph.facebook.com/#{response.id}/picture"
        $('#profile').attr('src', user_picture)
        $('#login').hide()
        $('#logout').show()
        console.log response
      )
    else
      console.log('User cancelled login or did not fully authorize.')
  
# fb logout
$('#logout').click ->
  FB.logout (response) ->
    user_name = 'Anonymous'
    user_picture = 'img/yetlogin.png'
    $('#profile').attr('src', "img/yetlogin.png")
    $('#login').show()
    $('#logout').hide()


# load posts
$.ajax({
  url: '/posts'
}).done (msg) ->
  display_all(msg)
$('#logout').hide()

