export const getStats = async (req, res) => {
    try {
        const filter = {};
    
        // 연령대 필터
        if (req.query.ageGroup) {
          filter.ageGroup = req.query.ageGroup;
        }
    
        // 성별 필터
        if (req.query.gender) {
          filter.gender = req.query.gender;
        }
    
        const stats = await Stat.find(filter).lean();
        res.json(stats);
      } catch (err) {
        res
          .status(500)
          .json({ error: "Failed to fetch stats", details: err.message });
      }
}

export const getAverageStats = async (req, res) => {
    try {
        const filter = {};
    
        if (req.query.ageGroup) {
          filter.ageGroup = req.query.ageGroup;
        }
    
        if (req.query.gender) {
          filter.gender = req.query.gender;
        }
    
        const stats = await Stat.find(filter).lean();
    
        if (stats.length === 0) {
          return res.json({
            count: 0,
            message: "No data found for the given filters",
          });
        }
    
        // 평균 계산 (각 지표별)
        const metrics = ["악력", "윗몸일으키기", "유연성", "BMI", "체지방률"];
        const averages = {};
    
        metrics.forEach(metric => {
          const values = stats
            .map(s => s.metrics && s.metrics[metric])
            .filter(v => v != null && !isNaN(v));
    
          if (values.length > 0) {
            averages[metric] = parseFloat(
              (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
            );
          }
        });
    
        res.json({
          count: stats.length,
          filter,
          averages,
        });
      } catch (err) {
        res
          .status(500)
          .json({ error: "Failed to calculate averages", details: err.message });
      }
}

export default {
    getStats,
    getAverageStats
}