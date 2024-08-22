import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Line } from 'recharts';
import { formatNumberWithDots } from '../MaintenanceInformations/OutlinedCard';

export const MonthlyBarChart =
  ({ monthlyData = [], currentYear }) => {
    const labels = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));

    const data = labels.map((month, index) => {
      const monthNumber = index + 1;
      const bookingData = monthlyData.find(data => data.month === monthNumber) || {};
      return {
        month,
        [`Đặt lịch ${currentYear}`]: bookingData.bookingCount || 0,
      };
    });

    return (
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Đặt Lịch Theo Tháng</h2>
        <ResponsiveContainer width="90%" height={500}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={`Đặt lịch ${currentYear}`} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };


export const RevenueBarChart =
  ({ revenueData = [], currentYear }) => {
    const labels = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));

    const data = labels.map((month, index) => {
      const monthNumber = index + 1;
      const revenueDataItem = revenueData.find(data => parseInt(data.month, 10) === monthNumber) || {};
      return {
        month,
        [`Doanh thu ${currentYear}`]: revenueDataItem.revenue || 0
      };
    });

    return (
      <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Đặt Lịch Theo Tháng</h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={`Doanh thu ${currentYear}`} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

// const CustomTooltip = ({ payload, label }) => {
//   if (!payload || payload.length === 0) return null;

//   return (
//     <div className="custom-tooltip">
//       <p>{label}</p>
//       {payload.map((entry, index) => (
//         <p key={index} style={{ color: entry.stroke }}>
//           {`${entry.name}: ${formatNumberWithDots(entry.value)}`}
//         </p>
//       ))}
//     </div>
//   );
// };
export const CombinedBarChart = ({ monthlyData = [], revenueData = [], currentYear }) => {
  const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

  const data = labels.map((month, index) => {
    const monthNumber = index + 1;
    const bookingData = monthlyData.find(data => data.month === monthNumber) || {};
    const revenueDataItem = revenueData.find(data => parseInt(data.month, 10) === monthNumber) || {};
    return {
      month,
      [`Đặt lịch ${currentYear}`]: bookingData.bookingCount || 0,
      [`Doanh thu ${currentYear}`]: revenueDataItem.revenue || 0
    };
  });

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Đặt lịch và doanh thu theo tháng</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={`Đặt lịch ${currentYear}`} fill="#8884d8" />
          <Bar dataKey={`Doanh thu ${currentYear}`} fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CombinedChartv1 = ({ monthlyData = [], revenueData = [], currentYear }) => {
  const labels = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));

  // Prepare data for the chart
  const data = labels.map((month, index) => {
    const monthNumber = index + 1; // Convert to 1-based month number
    const bookingData = monthlyData.find(data => data.month === monthNumber) || {};
    const revenueDataItem = revenueData.find(data => parseInt(data.month, 10) === monthNumber) || {};

    // Debugging logs
    console.log(`Month: ${month}, Booking Data:`, bookingData);
    console.log(`Month: ${month}, Revenue Data Item:`, revenueDataItem);

    return {
      month,
      [`Bookings ${currentYear}`]: bookingData.bookingCount || 0,
      [`Revenue ${currentYear}`]: formatNumberWithDots(revenueDataItem.revenue) || 0
    };
  });

  console.log("Chart Data:", data); // Debugging line

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Bookings and Revenue by Month</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={`Bookings ${currentYear}`} fill="#8884d8" />
          <Line type="monotone" dataKey={`Revenue ${currentYear}`} stroke="#82ca9d" dot={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};