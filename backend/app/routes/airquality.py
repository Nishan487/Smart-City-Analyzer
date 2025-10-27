import os
from flask import Blueprint, jsonify
# from app.utils.data_processing import get_live_value
from app.utils.data_processing import clean_airquality


airquality_bp = Blueprint('airquality', __name__)

@airquality_bp.route('/airquality/', methods=["GET"])
def get_airquality():
    # # Automatically build the correct absolute path
    # base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    # file_path = os.path.join(base_dir, 'data', 'airquality.csv')  # lowercase filename

    # print(f"🔍 Loading data from: {file_path}")  # for debugging

    data = clean_airquality('../data/airquality.csv')
    # data = get_live_value("../data/airquality.csv","NO2")
    return jsonify(data)
