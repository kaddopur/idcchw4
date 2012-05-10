import cgi
import datetime
import urllib
import webapp2
import jinja2
import os
import simplejson

from google.appengine.ext import db
from google.appengine.api import users

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class Greeting(db.Model):
    """Models an individual Guestbook entry with an author, content, and date."""
    author = db.UserProperty()
    content = db.StringProperty(multiline=True)
    date = db.DateTimeProperty(auto_now_add=True)


def guestbook_key(guestbook_name=None):
    """Constructs a Datastore key for a Guestbook entity with guestbook_name."""
    return db.Key.from_path('Guestbook', guestbook_name or 'default_guestbook')


class MainPage(webapp2.RequestHandler):
    def get(self):
        guestbook_name=self.request.get('guestbook_name')
        greetings_query = Greeting.all().ancestor(guestbook_key(guestbook_name)).order('-date')
        greetings = greetings_query.fetch(10)

        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'

        template_values = {
            'greetings': greetings,
            'url': url,
            'url_linktext': url_linktext,
        }

        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render(template_values))
        


class Guestbook(webapp2.RequestHandler):
    def post(self):
        # We set the same parent key on the 'Greeting' to ensure each greeting is in
        # the same entity group. Queries across the single entity group will be
        # consistent. However, the write rate to a single entity group should
        # be limited to ~1/second.
        guestbook_name = self.request.get('guestbook_name')
        greeting = Greeting(parent=guestbook_key(guestbook_name))

        if users.get_current_user():
            greeting.author = users.get_current_user()

        greeting.content = self.request.get('content')
        greeting.put()
        
        self.redirect('/posts?' + urllib.urlencode({'guestbook_name': guestbook_name}))


class AllPosts(webapp2.RequestHandler):
    def get(self):
        guestbook_name=self.request.get('guestbook_name')
        greetings_query = Greeting.all().ancestor(guestbook_key(guestbook_name)).order('-date')
        greetings = greetings_query.fetch(20)
        
        result = []
        for g in greetings:
            this_greeting = {}
            if g.author: 
                this_greeting['author'] = g.author.nickname()
            if g.content:
                this_greeting['content'] = g.content
            this_greeting['date'] = (g.date + datetime.timedelta(hours=8)).strftime('%m/%d %H:%M')
            this_greeting['key'] = str(g.key()) 
            result.append(this_greeting)

        self.response.out.write(simplejson.dumps(result))


class OnePost(webapp2.RequestHandler):
    def post(self):
        guestbook_name = self.request.get('guestbook_name')
        target_key = self.request.get('key')
        obj = db.get(target_key)
        obj.delete()

        self.redirect('/posts?' + urllib.urlencode({'guestbook_name': guestbook_name}))


app = webapp2.WSGIApplication([('/', MainPage),
                               ('/sign', Guestbook),
                               ('/posts', AllPosts),
                               ('/post', OnePost)],
                              debug=True)

