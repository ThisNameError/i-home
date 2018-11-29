import os
import re

from flask import Blueprint, render_template, request, jsonify, session

from app.models import db, User
from utils.functions import is_login

user = Blueprint('user', __name__)


@user.route('/create_db/')
def create_db():
    db.create_all()
    return 'ok'


@user.route('/register/', methods=['GET'])
def register():
    return render_template('register.html')


@user.route('/register/', methods=['POST'])
def my_register():
    tel = request.form.get('mobile')
    pwd = request.form.get('password')
    pwd2 = request.form.get('password2')
    # check_code = request.form.get('imagecode')
    #
    # # 生成验证码
    # codes = '1234567890qwertyuiopasdfghjklzxcv'
    # new_code = ''
    # for _ in range(4):
    #     new_code += random.choice(codes)

    if not all([tel, pwd, pwd2]):
        return jsonify({'code': 1001, 'msg': '请重新输入信息'})
    if not re.match(r'^1[3|4|5|8][0-9]\d{4,8}$', tel):
        return jsonify({'code': 1002, 'msg': '请输入正确的手机号'})
    phone = User.query.filter(User.phone == 'phone').all()
    if phone:
        return jsonify({'code': 1003, 'msg': '手机号已注册，请换手机号注册'})
    if pwd != pwd2:
        return jsonify({'code': 1004, 'msg': '两次密码不一致，请重新输入密码'})
    user = User()
    user.name = tel
    user.phone = tel
    user.password = pwd
    user.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


@user.route('/login/', methods=['GET'])
def login():
    return render_template('login.html')


@user.route('/login/', methods=['POST'])
def my_login():
    tel = request.form.get('mobile')
    pwd = request.form.get('password')
    user = User.query.filter(User.phone == tel).first()
    if not user:
        return jsonify({'code': 2001, 'msg': '手机号不存在，请先注册'})
    if not user.check_pwd(pwd):
        return jsonify({'code': 2002, 'msg': '密码不正确'})
    session['user_id'] = user.id
    return jsonify({'code': 200, 'msg': '请求成功'})


@user.route('/my/', methods=['GET'])
# @is_login
def my():
    id = session['user_id']
    user = User.query.filter(User.id == id).first()
    return render_template('my.html', user=user)


@user.route('/logout/')
def logout():
    session.pop('user_id')
    return render_template('login.html')


@user.route('/profile/', methods=['GET'])
def profile():
    return render_template('profile.html')


@user.route('/profile/', methods=['POST'])
# @is_login
def my_profile():
    id = session['user_id']
    user = User.query.filter(User.id == id).first()
    name = request.form.get('name')
    if not name:
        return jsonify({'code': 3001, 'msg': '请输入用户名'})
    if user.name == name:
        return jsonify({'code': 3002, 'msg': '用户名重复，请重新输入'})
    user.name = name
    user.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


@user.route('/upimg/', methods=['POST'])
# @is_login
def up_img():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MEDIA_ROOT = os.path.join(os.path.join(BASE_DIR, 'static'), 'media')
    img = request.files.get('avatar')
    id = session['user_id']
    user = User.query.filter(User.id == id).first()
    # 将图片保存到本地
    if not img:
        return jsonify({'code': 4000, 'msg': '请上传图片'})
    path = os.path.join(MEDIA_ROOT, img.filename)
    img.save(path)

    # 将图片保存到数据库
    img_filename = img.filename
    user.avatar = img_filename
    user.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


@user.route('/auth/', methods=['GET'])
# @is_login
def auth():
    id = session['user_id']
    user = User.query.filter(User.id == id).first()
    return render_template('auth.html', user=user)


@user.route('/check_info/', methods=['POST'])
# @is_login
def check_info():
    name = request.form.get('real_name')
    id_code = request.form.get('id_card')
    if not all([name, id_code]):
        return jsonify({'code': 1201, 'msg': '请填写信息'})
    if not re.match(r'^[1-9]\d{5}(18|19|2([0-9]))\d{2}(0[0-9]|10|11|12)([0-2][1-9]|30|31)\d{3}[0-9Xx]$', id_code):
        return jsonify({'code': 1202, 'msg': '请输入正确的身份证号码'})
    user_id = session['user_id']
    user = User.query.filter(User.id == user_id).first()
    user.id_name = name
    user.id_card = id_code
    user.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


@user.route('/id_card/', methods=['GET'])
def id_crad():
    id = session['user_id']
    user = User.query.filter(User.id == id).first()
    id_card = user.id_card
    if id_card:
        return jsonify({'code': 1203, 'msg': '已完成实名认证，无法更改'})
