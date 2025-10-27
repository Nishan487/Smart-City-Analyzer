# from flask import Blueprint, jsonify
# # from app.utils.data_processing import get_live_value

# energy_bp = Blueprint("energy", __name__)

# @energy_bp.route("/energyconsumption/", methods=["GET"])
# def get_energyconsumption():
#     data = get_live_value("../data/energyconsumption.csv", "biofuel_electricity")
#     return jsonify(data)