import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Input,
  Tooltip,
  styled,
} from "@mui/material";

const RootCard = styled(Card)({
  backgroundColor: (props) => props.theme.palette.common.white,
  boxShadow: (props) => props.theme.shadows[1],
  marginBottom: (props) => props.theme.spacing(4),
});

const CardContentWrapper = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const AvatarContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});

const UserAvatar = styled("div")(({ theme }) => ({
  width: theme.spacing(8),
  height: theme.spacing(8),
  borderRadius: "50%",
  overflow: "hidden",
  marginRight: theme.spacing(3),
}));

const FileInput = styled(Input)({
  display: "none",
});

const ChoosePhotoWidget = (props) => {
  const { title, photo } = props;

  const handleFileChange = (event) => {
    // Handle file selection logic here
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
  };

  return (
    <RootCard variant="outlined">
      <CardContentWrapper>
        <Typography variant="h5" component="h5" gutterBottom>
          {title}
        </Typography>

        <AvatarContainer>
          <UserAvatar>
            <img
              src={photo}
              alt="User Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </UserAvatar>
          <div>
            <label htmlFor="upload-photo">
              <FileInput
                type="file"
                id="upload-photo"
                accept="image/jpeg,image/gif,image/png"
                onChange={handleFileChange}
              />
              <Tooltip title="Choose Image" placement="top">
                <IconButton color="primary" component="span">
                  {/* <AttachFileIcon /> */}
                </IconButton>
              </Tooltip>
            </label>
            <Typography variant="body2" color="textSecondary" component="div">
              JPG, GIF, or PNG. Max size of 800K
            </Typography>
          </div>
        </AvatarContainer>
      </CardContentWrapper>
    </RootCard>
  );
};

export default ChoosePhotoWidget;
