const fs = require('fs');
const fixPipes = (filePath) => {
  let c = fs.readFileSync(filePath, 'utf8');
  c = c.replace(/coordsMap\[String\(c\)\]  \[39\.8283/g, "coordsMap[String(c)] || [39.8283");
  c = c.replace(/d\.weather_condition  'Normal'/g, "d.weather_condition || 'Normal'");
  c = c.replace(/d\.avg_rating  0/g, "d.avg_rating || 0");
  fs.writeFileSync(filePath, c);
};
fixPipes('src/pages/insights/WeatherMood.tsx');
