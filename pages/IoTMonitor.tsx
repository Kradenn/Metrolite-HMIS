import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IoTMonitor: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/iot/latest');
      const json = await res.json();
      setData(json.reverse());
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulation function for demo
  const simulateData = async () => {
    const sensors = [
      { id: 'HR-001', type: 'Heart Rate', min: 60, max: 100 },
      { id: 'TEMP-002', type: 'Body Temp', min: 36.5, max: 38.5 },
      { id: 'OXY-003', type: 'SpO2', min: 95, max: 100 }
    ];

    for (const s of sensors) {
      const value = (Math.random() * (s.max - s.min) + s.min).toFixed(1);
      await fetch('/api/iot/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: s.id, sensor_type: s.type, value: parseFloat(value) })
      });
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">IoT Gateway Monitor</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Real-time medical device telemetry</p>
        </div>
        <button 
          onClick={simulateData}
          className="bg-indigo-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg"
        >
          Simulate Device Pulse
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {['Heart Rate', 'Body Temp', 'SpO2'].map(type => {
          const latest = data.filter(d => d.sensor_type === type).pop();
          return (
            <div key={type} className="bg-white p-6 border-t-4 border-indigo-600 shadow-xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{type}</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-slate-800">{latest?.value || '--'}</span>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {type === 'Heart Rate' ? 'BPM' : type === 'Body Temp' ? '°C' : '%'}
                </span>
              </div>
              <div className="mt-4 h-1 bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-600 animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-8 shadow-2xl border border-slate-100">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center">
          <i className="fa fa-chart-line mr-3 text-indigo-600"></i>
          Live Telemetry Stream
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 10, fontWeight: 700 }} 
                tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              />
              <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0', color: '#fff' }}
                itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
              />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={false} animationDuration={300} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-slate-900 text-white p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Device ID</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Sensor</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Value</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.slice().reverse().map((d, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="py-3 text-[11px] font-mono text-indigo-400">{d.device_id}</td>
                <td className="py-3 text-[11px] font-bold uppercase">{d.sensor_type}</td>
                <td className="py-3 text-[11px] font-black">{d.value}</td>
                <td className="py-3 text-[11px] text-slate-500">{new Date(d.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IoTMonitor;
