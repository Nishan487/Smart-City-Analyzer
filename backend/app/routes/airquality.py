import os
import pandas as pd
from flask import Blueprint, jsonify
# from app.utils.data_processing import get_live_value
from app.utils.data_processing import main_airquality


airquality_bp = Blueprint('airquality', __name__)

@airquality_bp.route('/airquality/', methods=["GET"])
def get_airquality():
    try:
        
        data = main_airquality('../data/airquality.csv')
        data=pd.DataFrame(data)
        if data is None or data.empty:
            return jsonify({"error": "No prediction data available"}), 400
        data['Time']=data["Time"].astype(str)  
        data_dict = data.to_dict(orient='records')
        return jsonify({
            "data": data_dict,
        }), 200
    except Exception as e:
        print("❌ Flask Route Error:", e)
        return jsonify({"error": str(e)}), 500

    # data = get_live_value("../data/airquality.csv","NO2")