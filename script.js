// Sample Unsafe Zones: [{lat, lon, radius_in_meters}]
const unsafeZones = [
  { lat: 28.6129, lon: 77.2295, radius: 500 }, // Example: India Gate
  { lat: 28.5355, lon: 77.3910, radius: 300 }  // Example: Noida Sec 18
];

// Haversine Formula to calculate distance between coordinates
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const toRad = (val) => (val * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat/2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Check if user is in any unsafe zone
function checkUnsafeZones(lat, lon) {
  return unsafeZones.some(zone => {
    const dist = getDistance(lat, lon, zone.lat, zone.lon);
    return dist <= zone.radius;
  });
}

function updateLocation(position) {
  const { latitude, longitude } = position.coords;
  document.getElementById("status").textContent = `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;

  if (checkUnsafeZones(latitude, longitude)) {
    document.getElementById("alert-box").classList.remove("hidden");
  } else {
    document.getElementById("alert-box").classList.add("hidden");
  }
}

// Error Handler
function locationError(err) {
  document.getElementById("status").textContent = "Unable to retrieve location.";
  console.error(err);
}

// Trigger location check every 10 seconds
setInterval(() => {
  navigator.geolocation.getCurrentPosition(updateLocation, locationError);
}, 10000);

navigator.geolocation.getCurrentPosition(updateLocation, locationError);
