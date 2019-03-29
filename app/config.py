import os, sys
basedir = os.path.abspath(os.path.dirname(__file__))

POSTGRES = {
    'user' : 'gsfobcmjlmajvm',
    'pw'   : '20d5a5c82d93efff5985528b5f7f3f3b28d57134b369a9ba22217c79aaefb76c',
    'db'   : 'de7ro6upkbhjrp',
    'host' : 'ec2-46-137-113-157.eu-west-1.compute.amazonaws.com',
    'port' : '5432',
}

#"postgresql://%(host)s:%(port)s" \
#"/%(db)s?user=%(user)s&password=%(pw)s" % POSTGRES

class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'a?1lv+al355f"/+'
    SQLALCHEMY_DATABASE_URI = "postgresql://%(host)s:%(port)s" \
                              "/%(db)s?user=%(user)s&password=%(pw)s" % POSTGRES
    SQLALCHEMY_TRACK_MODIFICATIONS = False;



class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True