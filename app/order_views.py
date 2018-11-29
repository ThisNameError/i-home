from flask import Blueprint, render_template

orders = Blueprint('orders', __name__)


@orders.route('/my_order/', methods=['GET'])
def order():
    return render_template('orders.html')


@orders.route('/lorders/', methods=['GET'])
def lorders():
    return render_template('lorders.html')
