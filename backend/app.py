from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Add ml_modules directories to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), "ml_modules", "waste_predication"))
sys.path.append(os.path.join(os.path.dirname(__file__), "ml_modules", "price_prediction"))

from waste_predication import waste_prediction  # Import waste prediction function
from price_prediction import price_prediction  # Import price prediction function

app = Flask(__name__)
CORS(app)

@app.route('/api/predict', methods=['POST'])
def predict_waste():
    try:
        data = request.json
        print("Received data:", data)  # Debugging line

        crop_type = data.get('cropType', '')
        waste_type = data.get('wasteType', '')
        farm_size = float(data.get('farmSize', 0))

        if not crop_type or not waste_type or farm_size <= 0:
            return jsonify({'success': False, 'error': 'Invalid input data'}), 400
        
        predicted_waste = waste_prediction(crop_type, waste_type, farm_size)

        return jsonify({'success': True, 'predictedWaste': predicted_waste})

    except Exception as e:
        print("Error:", e)  # Debugging line
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/predict_price', methods=['POST'])
def predict_price():
    try:
        data = request.json
        print("Received price prediction data:", data)  # Debugging line

        crop_type = data.get('cropType', '')
        waste_type = data.get('wasteType', '')
        farm_size = float(data.get('farmSize', 0))
        predicted_waste = float(data.get('predictedWaste', 0))

        if not crop_type or not waste_type or farm_size <= 0 or predicted_waste <= 0:
            return jsonify({'success': False, 'error': 'Invalid input data for price prediction'}), 400

        waste_price = price_prediction(crop_type, waste_type, farm_size, predicted_waste)

        return jsonify({'success': True, 'wastePrice': waste_price})

    except Exception as e:
        print("Error:", e)  # Debugging line
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
