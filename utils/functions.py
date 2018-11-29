import functools

from flask import session, render_template
from werkzeug.utils import redirect

from app.models import db, User


def init_ext(app):
    db.init_app(app)


def get_mysql_databases(database):

    return '{}+{}://{}:{}@{}:{}/{}'.format(database['DIALECT'],
                                           database['DRIVER'],
                                           database['USER'],
                                           database['PASSWORD'],
                                           database['HOST'],
                                           database['PORT'],
                                           database['DB'])


def is_check(func):
    @functools.wraps(func)
    def check():
        id = session['user_id']
        user = User.query.filter(User.id == id).first()
        try:
            if user.id_card:
                return func()
            else:
                return redirect('/ihome/auth/')
        except Exception as e:
            return redirect('/ihome/auth/')

    return check


def is_login(func):
    @functools.wraps(func)
    def login():
        try:
            if session['user_id']:
                return func()
            else:
                return redirect('/ihome/login/')
        except Exception as e:
            return redirect('/ihome/login/')

    return login
