import { Box, Grid, Typography } from "@mui/material";
import LineChartComponent from "./LineChartComponent ";
import PieChartComponent from "./PieChartComponent";
import { MonthlyBarChart } from "./MonthlyBarChart";

const Dashboard = () => {
    // Dữ liệu giả lập, bạn có thể thay thế bằng dữ liệu thực tế
    const barChartData = [
      { month: 'Tháng 1', value: 100 },
      { month: 'Tháng 2', value: 150 },
      { month: 'Tháng 3', value: 200 },
      // Thêm dữ liệu khác
    ];
  
    const lineChartData = [
      { month: 'Tháng 1', value: 120 },
      { month: 'Tháng 2', value: 180 },
      { month: 'Tháng 3', value: 250 },
      // Thêm dữ liệu khác
    ];
  
    const pieChartData = [
      { name: 'Dự án A', value: 400 },
      { name: 'Dự án B', value: 300 },
      { name: 'Dự án C', value: 300 },
      { name: 'Dự án D', value: 200 },
    ];
  
    return (
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box border={1} borderColor="grey.300" borderRadius={2} p={2}>
              <Typography variant="h6">Biểu Đồ Cột Theo Tháng</Typography>
              <MonthlyBarChart data={barChartData} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box border={1} borderColor="grey.300" borderRadius={2} p={2}>
              <Typography variant="h6">Biểu Đồ Đường</Typography>
              <LineChartComponent data={lineChartData} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box border={1} borderColor="grey.300" borderRadius={2} p={2}>
              <Typography variant="h6">Biểu Đồ Tròn</Typography>
              <PieChartComponent data={pieChartData} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default Dashboard;