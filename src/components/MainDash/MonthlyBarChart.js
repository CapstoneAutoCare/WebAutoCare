import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const MonthlyBarChart = ({ monthlyData = [], currentYear }) => {
  const labels = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));

  const data = labels.map((month, index) => {
    const monthData = monthlyData.find(data => data.month === index + 1) || {};
    return {
      month,
      [`Lịch Đặt Theo Năm ${currentYear}`]: monthData.bookingCount || 0 
    };
  });

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Đặt Lịch Theo Tháng</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={`Lịch Đặt Theo Năm ${currentYear}`} fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
