import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import MessageIcon from "@mui/icons-material/Message";
import Imgg from "../../imgs/img1.png";
const CustomCard = styled(Card)({
  maxWidth: 345,
  margin: "auto",
  marginBottom: (theme) => theme.spacing(4),
});

const ProfileCover = styled(CardMedia)({
  height: 200,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  borderRadius: "4px 4px 0 0",
});

const UserAvatar = styled("img")({
  width: (theme) => theme.spacing(16),
  height: (theme) => theme.spacing(16),
  margin: "-80px auto 0",
  border: `4px solid ${(theme) => theme.palette.common.white}`,
  borderRadius: "50%",
  boxShadow: (theme) => theme.shadows[3],
  display: "flex",
  justifyContent: "center",
});

const CardContentWrapper = styled(CardContent)({
  padding: (theme) => theme.spacing(2),
  textAlign: "center",
});

const CardActionsWrapper = styled(CardActions)({
  display: "flex",
  justifyContent: "center",
  marginBottom: (theme) => theme.spacing(2),
});

const ProfileCardWidget = () => {
  return (
    <CustomCard>
      <ProfileCover image={Imgg} />

      <UserAvatar src={Imgg} alt="Neil Portrait" />

      <CardContentWrapper>
        <Typography variant="h5" component="h2">
          Neil Sims
        </Typography>
        <Typography color="textSecondary">Senior Software Engineer</Typography>
        <Typography variant="body2" color="textSecondary">
          New York, USA
        </Typography>
      </CardContentWrapper>
      <CardContentWrapper>
        <Typography variant="h5" component="h2">
          Neil Sims
        </Typography>
        <Typography color="textSecondary">Senior Software Engineer</Typography>
        <Typography variant="body2" color="textSecondary">
          New York, USA
        </Typography>
      </CardContentWrapper>

      <CardActionsWrapper>
        <Button variant="contained" color="primary">
          Connect
        </Button>
        <Button variant="contained" color="secondary">
          Send Message
        </Button>
      </CardActionsWrapper>
    </CustomCard>
  );
};

export default ProfileCardWidget;
