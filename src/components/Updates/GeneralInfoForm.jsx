import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import AccountApi from "../Axios/AccountApi";
import CompanyApi from "../Axios/CompanyApi";
const GeneralInfoForm = () => {
  const [birthday, setBirthday] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const fetchInfor = async (Id, localToken, role) => {
    try {
      if (!{ localToken }) {
        console.log("No token found in localStorage.");
        return;
      }
      var response;
      if (role === "ADMIN") {
        response = await AccountApi.getAccountById(Id, localToken);
        console.log("API Response: ", [response.data.data]);
        console.log("ADMINID: ", response.data.data.adminId);
        localStorage.setItem("AdminId", response.data.data.adminId);
      }
      if (role === "COMPANY") {
        response = await CompanyApi.getCompanyById(Id, localToken);
        console.log("API Response: ", response.data.data);
        console.log("COMPANYID: ", response.data.data.companyId);
        localStorage.setItem("COMPANYID", response.data.data.companyId);
      }
      // console.log("HRID: ", response.data.data.adminId);
      // localStorage.setItem("HRID", response.data.data.adminId);
      // console.log("INTERVIEWERID: ", response.data.data.adminId);
      // localStorage.setItem("INTERVIEWERID", response.data.data.adminId);
      setAccounts([response.data.data]); // Update state with the fetched accounts

      // setAccounts(response.data.data); // Update state with the fetched accounts
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  const formattedDate = accounts.date ? accounts.date.split("T")[0] : "";

  useEffect(() => {
    const localToken = localStorage.getItem("localtoken");
    const Id = localStorage.getItem("AccountId");
    console.log(`Local Token: ${localToken} \nAccountId: ${Id}`);
    const role = localStorage.getItem("ROLE");
    fetchInfor(Id, localToken, role);
  }, []);
  return (
    <Card variant="outlined">
      {accounts.map((account) => (
        <CardContent>
          <Typography variant="h5" gutterBottom>
            General information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={account.firstName}
                InputLabelProps={{
                  shrink: !!account.firstName,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                value={account.lastName}
                InputLabelProps={{
                  shrink: !!account.lastName,
                }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                id="birthday"
                label="Birthday"
                type="date"
                value={formattedDate}
                // onChange={onChangeBirthday}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select value={0} fullWidth>
                <MenuItem value={0} disabled>
                  Gender
                </MenuItem>
                <MenuItem value={1}>Female</MenuItem>
                <MenuItem value={2}>Male</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                required
                fullWidth
                value={account.email}
                InputLabelProps={{
                  shrink: !!account.email,
                }}
              >
                {}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                type="number"
                required
                value={account.phone}
                fullWidthInputLabelProps={{
                  shrink: !!account.phone,
                }}
              />
            </Grid>
          </Grid>
          <Typography variant="h5" gutterBottom>
            Address
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              <TextField
                label="Address"
                required
                fullWidth
                value={account.address}
                InputLabelProps={{
                  shrink: !!account.address,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Number"
                type="number"
                required
                fullWidth
                value={account.phone}
                InputLabelProps={{
                  shrink: !!account.phone,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                required
                fullWidth
                value={account.address}
                InputLabelProps={{
                  shrink: !!account.address,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select value={0} fullWidth>
                <MenuItem value={0} disabled>
                  State
                </MenuItem>
                <MenuItem value="AL">Alabama</MenuItem>
                {/* Add other states */}
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="ZIP" required fullWidth />
            </Grid>
          </Grid>
          <Typography variant="h5" gutterBottom>
            Language
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Language"
                fullWidth
                value={account.language}
                InputLabelProps={{
                  shrink: true, // Kiểm tra giá trị rỗng
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bio"
                required
                fullWidth
                value={account.bio}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nationality"
                value={account.nationality}
                // onChange={onChangeBirthday}
                // InputLabelProps={{
                //   shrink: true,
                // }}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Role"
                value={account.role}
                // onChange={onChangeBirthday}
                // InputLabelProps={{
                //   shrink: true,
                // }}
                required
                fullWidth
              />
            </Grid>
          </Grid>

          <div style={{ marginTop: "1rem" }}>
            <Button variant="contained" color="primary">
              Save All
            </Button>
          </div>
        </CardContent>
      ))}
    </Card>
  );
};

export default GeneralInfoForm;
