const fs = require('fs');
const paths = ['BusinessAnalysis.tsx', 'CheckinAnalysis.tsx', 'ComprehensiveAnalysis.tsx', 'RatingAnalysis.tsx', 'ReviewAnalysis.tsx', 'UserAnalysis.tsx'];
paths.forEach(p => {
  const pth = 'src/pages/statistics/'+p;
  let c = fs.readFileSync(pth, 'utf8');
  if(!c.includes('InteractivePieChart')) {
    c = c.replace(/import InteractiveBarChart from '..\/..\/components\/charts\/InteractiveBarChart';/g, "import InteractiveBarChart from '../../components/charts/InteractiveBarChart';\nimport InteractivePieChart from '../../components/charts/InteractivePieChart';");
    fs.writeFileSync(pth, c);
  }
});
