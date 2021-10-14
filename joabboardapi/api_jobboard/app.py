from flask import Flask
from flaskext.mysql import MySQL
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources=r'/api/*')

MySql = MySQL()
app.config['SECRET_KEY'] = 'the random string'
app.config['MYSQL_DATABASE_USER'] = 'admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'azerty'
app.config['MYSQL_DATABASE_DB'] = 'job_board'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_PORT'] = 8880
MySql.init_app(app)

import routes.admin
import routes.authentification
import routes.user
import routes.ads
import routes.company

if __name__ == '__main__':
    app.run(use_reloader=True)
