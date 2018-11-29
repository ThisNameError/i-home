import os

from flask import Blueprint, render_template, session, request, jsonify

from app.models import House, Facility, Area
from utils.functions import is_check, is_login

house = Blueprint('house', __name__)


@house.route('/myhouse/', methods=['GET'])
@is_check
def myhouse():
    id = session['user_id']
    house_list = House.query.filter(House.user_id == id).order_by(House.id.desc())
    houses = []
    for house in house_list:
        houses.append(house.to_dict())
    return render_template('myhouse.html', houses=houses)


@house.route('/newhouse/', methods=['GET'])
@is_login
def newhouse():
    all_area = Area.query.all()
    areas = [area.to_dict() for area in all_area]
    all_facility = Facility.query.all()
    facilities = [facility.to_dict() for facility in all_facility]
    return render_template('newhouse.html', areas=areas, facilities=facilities)


@house.route('/addhouse/', methods=['POST'])
@is_login
def addhouse():
    # 接收数据
    params = request.form.to_dict()
    facility_ids = request.form.getlist('facility')
    # 验证数据的有效性

    # 创建对象并保存
    house = House()
    house.user_id = session['user_id']
    house.area_id = params.get('area_id')
    house.title = params.get('title')
    house.price = params.get('price')
    house.address = params.get('address')
    house.room_count = params.get('room_count')
    house.acreage = params.get('acreage')
    house.beds = params.get('beds')
    house.unit = params.get('unit')
    house.capacity = params.get('capacity')
    house.deposit = params.get('deposit')
    house.min_days = params.get('min_days')
    house.max_days = params.get('max_days')
    # 根据设施的编号查询设施对象
    if facility_ids:
        facility_list = Facility.query.filter(Facility.id.in_(facility_ids)).all()
        house.facilities = facility_list
    house.add_update()
    # 返回结果
    return jsonify({'code': 200, 'house_id': house.id})


@house.route('/up_images/<house_id>/', methods=['POST'])
def up_images(house_id):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MEDIA_ROOT = os.path.join(os.path.join(BASE_DIR, 'static'), 'media')
    img = request.files.get('house_image')
    path = os.path.join(MEDIA_ROOT, img.filename)
    img.save(path)

    # 存到数据库
    house = House.query.filter(House.id == house_id).first()
    img_filename = img.filename
    house.index_image_url = img_filename
    house.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


@house.route('/detail/<house_id>/')
def detail(house_id):
    return render_template('detail.html', house_id=house_id)

