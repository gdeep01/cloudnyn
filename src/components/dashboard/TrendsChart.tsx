import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { time: "Morning", engagement: 3200, retention: 68 },
  { time: "Afternoon", engagement: 5800, retention: 82 },
  { time: "Evening", engagement: 7200, retention: 91 },
  { time: "Night", engagement: 4100, retention: 74 },
];

const contentTypes = [
  { type: "Reels", performance: 92, growth: "+18%" },
  { type: "Carousel", performance: 78, growth: "+12%" },
  { type: "Stories", performance: 85, growth: "+8%" },
  { type: "Single Post", performance: 64, growth: "+3%" },
];

export const TrendsChart = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Best Posting Times</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(240 5% 64%)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(240 5% 64%)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(240 10% 8%)',
                border: '1px solid hsl(240 5% 20%)',
                borderRadius: '8px',
                color: 'hsl(0 0% 98%)'
              }}
            />
            <Legend />
            <Bar dataKey="engagement" fill="hsl(263 70% 50%)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="retention" fill="hsl(346 77% 60%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Content Type Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentTypes.map((item) => (
            <div 
              key={item.type}
              className="bg-secondary/50 rounded-lg p-4 border border-border hover:border-primary/50 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">{item.type}</p>
                <span className="text-xs text-green-400">{item.growth}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Performance</span>
                  <span className="font-semibold">{item.performance}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.performance}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
