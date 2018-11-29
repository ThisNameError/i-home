from flask import Flask
from flask_script import Manager

from app.house_views import house
from app.order_views import orders
from app.user_views import user
from utils.config import Config
from utils.functions import init_ext

app = Flask(__name__)

# 用户
app.register_blueprint(blueprint=user, url_prefix='/ihome')
# 房源
app.register_blueprint(blueprint=house, url_prefix='/house')
# 订单
app.register_blueprint(blueprint=orders, url_prefix='/order')

app.config.from_object(Config)

app.secret_key = '1234567890qwertyuioplkjhgfdsazxcvbnm'

init_ext(app)

manage = Manager(app)

if __name__ == '__main__':
    manage.run()

