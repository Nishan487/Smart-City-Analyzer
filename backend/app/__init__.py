# backend/app/__init__.py
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Import and register blueprints
    from app.routes.airquality import airquality_bp
    from app.routes.traffic import traffic_bp
    
    # from app.routes.energy import energy_bp
    # from app.routes.energy import energy_bp
    app.secret_key = "my-secret-key"
    app.register_blueprint(airquality_bp)
    app.register_blueprint(traffic_bp)
    # app.register_blueprint(energy_bp)
    # app.register_blueprint(energy_bp, url_prefix="/api/energy")

    return app



# from flask import Flask
# from app.routes.traffic import traffic_bp
# from app.routes.airquality import airquality_bp
# from flask_cors import CORS
# app = Flask(__name__)
# CORS(app)
# app.secret_key = "your_secret_key"
# app.register_blueprint(traffic_bp)
# app.register_blueprint(airquality_bp)


