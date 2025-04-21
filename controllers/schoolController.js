const db = require("../db");

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: "School added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Invalid coordinates" });
  }

  try {
    const [schools] = await db.execute("SELECT * FROM schools");

    const sorted = schools
      .map((school) => ({
        ...school,
        distance: getDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
