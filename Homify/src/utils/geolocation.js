export const geocodeAddress = async (address) => {
    const apiKey = "AIzaSyAygw2msbWLtgdOSyezV5CvPABW6byuBPs";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].geometry.location; // { lat, lng }
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
    }
    return null;
  };
  