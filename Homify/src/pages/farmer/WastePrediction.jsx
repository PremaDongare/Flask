import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [cropType, setCropType] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [predictedWaste, setPredictedWaste] = useState(null);
  const [wastePrice, setWastePrice] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  // Dropdown Options
  const cropOptions = ["Soybean", "Wheat", "Sugarcane", "Rice", "Sunflower", "Barley"];
  const wasteOptions = ["Husks", "Leaves", "Stalks", "Residues", "Straw"];

  // 🔹 Predict Waste Function
  const handlePredictWaste = async () => {
    setIsLoading(true);
    setError("");
    setPredictedWaste(null);
    setWastePrice(null);

    console.log("Sending data for waste prediction:", { cropType, wasteType, farmSize });

    // Validation: Check if inputs are provided
    if (!cropType || !wasteType || !farmSize) {
      setError("Please select crop type, waste type, and enter farm size.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/predict", {
        cropType,
        wasteType,
        farmSize: parseFloat(farmSize),
      });

      console.log("Waste prediction response:", response.data);

      if (response.data.success) {
        setPredictedWaste(response.data.predictedWaste);
      } else {
        setError(response.data.error || "Error predicting waste. Please try again.");
      }
    } catch (err) {
      console.error("API error:", err.response ? err.response.data : err.message);
      setError("Error predicting waste. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Predict Price Function
  const handlePredictPrice = async () => {
    setIsLoadingPrice(true);
    setError("");
    setWastePrice(null);

    console.log("Sending data for price prediction:", { cropType, wasteType, farmSize, predictedWaste });

    // Validation: Ensure required values exist
    if (!cropType || !wasteType || !farmSize || !predictedWaste) {
      setError("Please complete the waste prediction first.");
      setIsLoadingPrice(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/predict_price", {
        cropType,
        wasteType,
        farmSize: parseFloat(farmSize),
        predictedWaste: parseFloat(predictedWaste),
      });

      console.log("Price prediction response:", response.data);

      if (response.data.success) {
        setWastePrice(response.data.wastePrice);
      } else {
        setError(response.data.error || "Error predicting price. Please try again.");
      }
    } catch (err) {
      console.error("API error:", err.response ? err.response.data : err.message);
      setError("Error predicting price. Please try again.");
    } finally {
      setIsLoadingPrice(false);
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* Crop Waste Prediction Container */}
      <div style={styles.container}>
        <h2 style={styles.heading}>Crop Waste Prediction</h2>

        {/* Crop Type Dropdown */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Crop Type:</label>
          <select value={cropType} onChange={(e) => setCropType(e.target.value)} style={styles.input}>
            <option value="">Select Crop Type</option>
            {cropOptions.map((crop, index) => (
              <option key={index} value={crop}>{crop}</option>
            ))}
          </select>
        </div>

        {/* Waste Type Dropdown */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Waste Type:</label>
          <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} style={styles.input}>
            <option value="">Select Waste Type</option>
            {wasteOptions.map((waste, index) => (
              <option key={index} value={waste}>{waste}</option>
            ))}
          </select>
        </div>

        {/* Farm Size Input */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Farm Size (hectares):</label>
          <input
            type="number"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            placeholder="Enter farm size"
            style={styles.input}
          />
        </div>

        {/* Predict Waste Button */}
        <button onClick={handlePredictWaste} disabled={isLoading} style={isLoading ? styles.buttonDisabled : styles.button}>
          {isLoading ? "Predicting..." : "Predict Waste"}
        </button>

        {/* Prediction Result */}
        {predictedWaste !== null && <p style={styles.result}>Predicted Waste: {predictedWaste} tons</p>}
      </div>

      {/* Waste Price Prediction Container */}
      <div style={styles.container}>
        <h2 style={styles.heading}>Waste Price Prediction</h2>

        {/* Predicted Waste Input */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Predicted Waste (tons):</label>
          <input
            type="number"
            value={predictedWaste || ""}
            disabled
            placeholder="Predicted waste will appear here"
            style={styles.input}
          />
        </div>

        {/* Predict Price Button */}
        <button onClick={handlePredictPrice} disabled={isLoadingPrice || !predictedWaste} style={isLoadingPrice || !predictedWaste ? styles.buttonDisabled : styles.button}>
          {isLoadingPrice ? "Predicting..." : "Predict Price"}
        </button>

        {/* Price Prediction Result */}
        {wastePrice !== null && <p style={styles.result}>Predicted Price: ₹{wastePrice} per ton</p>}
      </div>

      {/* Error Message */}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

// ✅ Inline CSS Styles
const styles = {
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "50px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    width: "400px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  heading: {
    color: "#333",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "not-allowed",
    borderRadius: "5px",
  },
  result: {
    color: "green",
    fontWeight: "bold",
    marginTop: "10px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default App;
