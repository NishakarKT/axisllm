import React from "react";
import { useNavigate } from "react-router-dom";
// constants
import { COMPANY, COMPANY2 } from "../constants/vars";
import { HOME_ROUTE } from "../constants/routes";
// mui
import { AppBar as MuiAppBar, Stack, Toolbar, IconButton, Typography, Badge } from "@mui/material";
import styled from "@mui/material/styles/styled";
import MenuIcon from "@mui/icons-material/Menu";
import PixIcon from "@mui/icons-material/Pix";
// vars
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const NavBar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }} onClick={() => navigate(HOME_ROUTE)}>
          <PixIcon fontSize="large" />
          <Stack>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              {COMPANY}
            </Typography>
            <Typography component="h1" variant="body2" color="inherit" noWrap>
              {COMPANY2}
            </Typography>
          </Stack>
        </Stack>
        {/* <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton> */}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
