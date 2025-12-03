# from flask import Blueprint, jsonify
# from app.utils.data_processing import clean_traffic
# # from app.utils.data_processing import get_latest_data
# traffic_bp = Blueprint('traffic', __name__)

# @traffic_bp.route('/traffic/', methods=['GET'])
# def get_traffic():
#     data = clean_traffic('../data/traffic.csv')  # correct relative path
#     return jsonify(data)


# backend/app/routes/traffic.py
from flask import Blueprint, jsonify,url_for
from app.utils.data_processing import main

traffic_bp = Blueprint('traffic', __name__)

@traffic_bp.route('/traffic/', methods=['GET'])
def get_traffic():
    try:
        data = main("../data/traffic.csv")
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

