import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
// constants
import { AUTH_ROUTE, HOME_ROUTE, REPORTING_ROUTE, INTERACTION_ROUTE, RECOMMENDATION_ROUTE } from "../constants/routes";
// contexts
import AppContext from "../contexts/AppContext";
// mui
import { Drawer as MuiDrawer, Toolbar, List, ListItemIcon, ListItemText, ListItemButton, Divider, IconButton } from "@mui/material";
import styled from "@mui/material/styles/styled";
import { Home, ChevronLeft, AccountCircle, Assessment, QuestionAnswer, TipsAndUpdates } from "@mui/icons-material";
// vars
const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const SideBar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {user && user.email ? (
          <>
            <ListItemButton onClick={() => navigate(HOME_ROUTE)}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate(REPORTING_ROUTE)}>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText primary="Reporting" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate(INTERACTION_ROUTE)}>
              <ListItemIcon>
                <QuestionAnswer />
              </ListItemIcon>
              <ListItemText primary="Interaction" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate(RECOMMENDATION_ROUTE)}>
              <ListItemIcon>
                <TipsAndUpdates />
              </ListItemIcon>
              <ListItemText primary="Recommendation" />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton onClick={() => navigate(AUTH_ROUTE)}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Auth" />
            </ListItemButton>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default SideBar;
