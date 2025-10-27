# from flask import Flask
# from app.routes.traffic import traffic_bp
# from app.routes.airquality import airquality_bp
# from flask_cors import CORS
# app = Flask(__name__)
# CORS(app)
# app.secret_key = "your_secret_key"
# app.register_blueprint(traffic_bp)
# app.register_blueprint(airquality_bp)

# if __name__ == "__main__":
#     app.run(debug=True)
# backend/run.py
from app.__init__ import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
