import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { date: "Mon", engagement: 4200, reach: 8500, likes: 320 },
  { date: "Tue", engagement: 5100, reach: 9200, likes: 410 },
  { date: "Wed", engagement: 4800, reach: 8800, likes: 380 },
  { date: "Thu", engagement: 6200, reach: 11000, likes: 520 },
  { date: "Fri", engagement: 7100, reach: 12500, likes: 640 },
  { date: "Sat", engagement: 5800, reach: 10200, likes: 480 },
  { date: "Sun", engagement: 6500, reach: 11800, likes: 560 },
];

export const PerformanceChart = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground">Total Engagement</p>
          <p className="text-2xl font-bold text-primary">38,700</p>
          <p className="text-xs text-green-400 mt-1">↑ 12.5% vs last week</p>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
          <p className="text-sm text-muted-foreground">Total Reach</p>
          <p className="text-2xl font-bold text-blue-400">72,000</p>
          <p className="text-xs text-green-400 mt-1">↑ 8.3% vs last week</p>
        </div>
        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <p className="text-sm text-muted-foreground">Total Likes</p>
          <p className="text-2xl font-bold text-accent">3,310</p>
          <p className="text-xs text-green-400 mt-1">↑ 15.2% vs last week</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
          <XAxis 
            dataKey="date" 
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
          <Line 
            type="monotone" 
            dataKey="engagement" 
            stroke="hsl(263 70% 50%)" 
            strokeWidth={2}
            dot={{ fill: 'hsl(263 70% 50%)', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="reach" 
            stroke="hsl(220 80% 55%)" 
            strokeWidth={2}
            dot={{ fill: 'hsl(220 80% 55%)', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="likes" 
            stroke="hsl(346 77% 60%)" 
            strokeWidth={2}
            dot={{ fill: 'hsl(346 77% 60%)', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
