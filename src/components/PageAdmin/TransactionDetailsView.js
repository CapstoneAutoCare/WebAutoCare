import React from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Chip, Divider, Box } from '@mui/material';
import { Payment, DirectionsCar, Business, Description, DateRange, Person, LocationOn, Star } from '@mui/icons-material';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const DetailItem = ({ label, value, icon }) => (
  <Box display="flex" alignItems="center" mb={1}>
    {icon && <Box mr={1}>{icon}</Box>}
    <Typography variant="subtitle2" color="text.secondary" mr={1}>
      {label}:
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

const TransactionDetailsView = ({ transaction }) => {
  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Transaction Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Transaction Information
            </Typography>
            <DetailItem label="Transaction ID" value={transaction.transactionsId} icon={<Description fontSize="small" />} />
            <DetailItem label="Transaction Date" value={formatDate(transaction.transactionDate)} icon={<DateRange fontSize="small" />} />
            <DetailItem label="Volume" value={`${transaction.volume}%`} />
            <DetailItem label="Amount" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(transaction.amount)} icon={<Payment fontSize="small" />} />
            <DetailItem label="Payment Method" value={transaction.paymentMethod} />
            <DetailItem label="Status" value={transaction.status} />
            <DetailItem label="Description" value={transaction.description} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Vehicle Information
            </Typography>
            <DetailItem label="Vehicle ID" value={transaction.responseVehicles.vehiclesId} icon={<DirectionsCar fontSize="small" />} />
            <DetailItem label="Brand" value={transaction.responseVehicles.vehiclesBrandName} />
            <DetailItem label="Model" value={transaction.responseVehicles.vehicleModelName} />
            <DetailItem label="Color" value={transaction.responseVehicles.color} />
            <DetailItem label="License Plate" value={transaction.responseVehicles.licensePlate} />
            <DetailItem label="ODO" value={transaction.responseVehicles.odo} />
            <DetailItem label="Vehicle Status" value={transaction.responseVehicles.status} />
            <DetailItem label="Vehicle Created Date" value={formatDate(transaction.responseVehicles.createdDate)} />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Maintenance Center Information
            </Typography>
            <DetailItem label="Center ID" value={transaction.responseCenter.maintenanceCenterId} icon={<Business fontSize="small" />} />
            <DetailItem label="Center Name" value={transaction.responseCenter.maintenanceCenterName} />
            <DetailItem label="Email" value={transaction.responseCenter.email} />
            <DetailItem label="Phone" value={transaction.responseCenter.phone} />
            <DetailItem label="Address" value={`${transaction.responseCenter.address}, ${transaction.responseCenter.district}, ${transaction.responseCenter.city}, ${transaction.responseCenter.country}`} icon={<LocationOn fontSize="small" />} />
            <DetailItem label="Rating" value={transaction.responseCenter.rating} icon={<Star fontSize="small" />} />
            <DetailItem label="Center Status" value={transaction.responseCenter.status} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Maintenance Plan Information
            </Typography>
            <DetailItem label="Plan ID" value={transaction.responseMaintenancePlan.maintenancePlanId} icon={<Description fontSize="small" />} />
            <DetailItem label="Plan Name" value={transaction.responseMaintenancePlan.maintenancePlanName} />
            <DetailItem label="Plan Description" value={transaction.responseMaintenancePlan.description} />
            <DetailItem label="Plan Status" value={transaction.responseMaintenancePlan.status} />
            <DetailItem label="Plan Date" value={formatDate(transaction.responseMaintenancePlan.dateTime)} />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Vehicle Model Information
            </Typography>
            <DetailItem label="Model ID" value={transaction.responseMaintenancePlan.reponseVehicleModels.vehicleModelId} icon={<DirectionsCar fontSize="small" />} />
            <DetailItem label="Brand ID" value={transaction.responseMaintenancePlan.reponseVehicleModels.vehiclesBrandId} />
            <DetailItem label="Brand Name" value={transaction.responseMaintenancePlan.reponseVehicleModels.vehiclesBrandName} />
            <DetailItem label="Model Name" value={transaction.responseMaintenancePlan.reponseVehicleModels.vehicleModelName} />
            <DetailItem label="Model Description" value={transaction.responseMaintenancePlan.reponseVehicleModels.vehicleModelDecription} />
            <DetailItem label="Model Created Date" value={formatDate(transaction.responseMaintenancePlan.reponseVehicleModels.createdDate)} />
            <DetailItem label="Model Status" value={transaction.responseMaintenancePlan.reponseVehicleModels.status} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TransactionDetailsView;