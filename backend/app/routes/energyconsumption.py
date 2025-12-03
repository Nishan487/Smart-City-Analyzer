# from flask import Blueprint, jsonify
# # from app.utils.data_processing import get_live_value

# energy_bp = Blueprint("energy", __name__)

# @energy_bp.route("/energyconsumption/", methods=["GET"])
# def get_energyconsumption():
#     data = get_live_value("../data/energyconsumption.csv", "biofuel_electricity")
#     return jsonify(data)

from flask import Blueprint, jsonify
from app.utils.data_processing import main_energy
import pandas as pd

energy_bp = Blueprint("energyconsumption", __name__)
@energy_bp.route("/energyconsumption/",methods=["GET"])
def get_energy():
    try:
        
        data=main_energy('../data/energyconsumption.csv')
        data=pd.DataFrame(data)
        if data is None or data.empty:
            return jsonify({"error": "No prediction data available"}), 400
        data['Time']=data['Time'].astype(str)
        data_dict=data.to_dict(orient="records")
        return jsonify({
            'data':data_dict,
            
        }),200
    except Exception as e:
        print("❌ Flask Route Error:", e)
        return jsonify({"error": str(e)}), 500
    
        
    