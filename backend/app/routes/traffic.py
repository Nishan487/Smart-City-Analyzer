# from flask import Blueprint, jsonify
# from app.utils.data_processing import clean_traffic
# # from app.utils.data_processing import get_latest_data
# traffic_bp = Blueprint('traffic', __name__)

# @traffic_bp.route('/traffic/', methods=['GET'])
# def get_traffic():
#     data = clean_traffic('../data/traffic.csv')  # correct relative path
#     return jsonify(data)


# backend/app/routes/traffic.py
from flask import Blueprint, jsonify
from app.utils.data_processing import clean_traffic

traffic_bp = Blueprint("traffic", __name__)

@traffic_bp.route("/traffic/", methods=["GET"])
def get_traffic():
    data =clean_traffic("../data/traffic.csv")    # ,"Traffic Situation")
    return jsonify(data)

