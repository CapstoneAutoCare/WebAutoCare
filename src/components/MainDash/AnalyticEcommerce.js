import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import MainCard from "./MainCard";
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";

export default function AnalyticEcommerce({ color = 'primary', title, price, count, isLoss, extra }) {
    return (
      <MainCard contentSX={{ p: 2.25 }}>
        <Stack spacing={0.5}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Grid container alignItems="center">
            <Grid item>
              <Typography variant="h4" color="inherit">
                {formatNumberWithDots(price)} VND
              </Typography>
            </Grid>
            {count && (
              <Grid item>
                <Chip
                  variant="combined"
                  color={color}
                //   icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                  label={`${count} items`}
                  sx={{ ml: 1.25, pl: 1 }}
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </Stack>
        {/* <Box sx={{ pt: 2.25 }}>
          <Typography variant="caption" color="text.secondary">
            You made an extra{' '}
            <Typography variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
              {extra}
            </Typography>{' '}
            this year
          </Typography>
        </Box> */}
      </MainCard>
    );
  }
  
//   AnalyticEcommerce.propTypes = {
//     color: PropTypes.string,
//     title: PropTypes.string,
//     count: PropTypes.string,
//     percentage: PropTypes.number,
//     isLoss: PropTypes.bool,
//     extra: PropTypes.string
//   };