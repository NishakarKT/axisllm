import React, { lazy, Suspense, useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
// constants
import { LOCALSTORAGE, COMPANY } from "./constants/vars";
import { AUTH_TOKEN_ENDPOINT, USER_ENDPOINT } from "./constants/endpoints";
// components
import Loader from "./components/Loader";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
// mui
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Toolbar, SpeedDial, SpeedDialIcon, SpeedDialAction, Dialog, DialogTitle, DialogContent, DialogContentText, Grid, TextField, Autocomplete } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { LightMode, DarkMode, AccountCircle } from "@mui/icons-material";
import AppContext from "./contexts/AppContext";
import { AUTH_ROUTE } from "./constants/routes";
// pages
const Home = lazy(() => import("./pages/Home"));
const Reporting = lazy(() => import("./pages/Reporting"));
const Interaction = lazy(() => import("./pages/Interaction"));
const Recommendation = lazy(() => import("./pages/Recommendation"));
const Auth = lazy(() => import("./pages/Auth"));
// vars
const roles = {
  "Branch Manager": { code: "", range: 10 },
  "Cluster Manager": { code: "CL", range: 7 },
  "Circle Manager": { code: "CR", range: 4 },
  "Region Manager": { code: "RG", range: 2 },
};

const fetchRoleIds = (role) => Array.from({ length: roles[role].range }, (_, i) => roles[role].code + (i + 1));

const Dashboard = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("light");
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(Object.keys(roles)[0]);
  const [roleIds, setRoleIds] = useState(fetchRoleIds[role] || []);

  const isProfileComplete = (user) => !(user && user?.name && user?.role);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!user) navigate(AUTH_ROUTE);
    else if (user?.role) {
      setRole(user?.role);
      setRoleIds(fetchRoleIds(user?.role) || []);
    }
  }, [user]);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem(LOCALSTORAGE)) || {};
    // set user
    const token = localData?.token;
    if (token) {
      try {
        axios
          .post(AUTH_TOKEN_ENDPOINT, { token })
          .then((res) => {
            const user = res.data.user || {};
            setUser(user);
          })
          .catch((err) => {
            setUser(null);
          });
      } catch (err) {
        setUser(null);
      }
    } else setUser(null);
    // set mode
    if (localData.mode) setMode(localData.mode);
  }, []);

  const handleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    // save to localstorage
    localStorage.setItem(LOCALSTORAGE, JSON.stringify({ ...JSON.parse(localStorage.getItem(LOCALSTORAGE)), mode: newMode }));
  };

  const updateProfile = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = Object.fromEntries(new FormData(e.target));
    if (user) {
      try {
        axios
          .patch(USER_ENDPOINT, { query: { _id: user?._id }, updates: data })
          .then((res) => {
            setUser((user) => ({ ...user, ...data }));
            setProfileOpen(false);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }
  };

  const theme = createTheme({ palette: { mode } });

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ mode, handleMode, user, setUser }}>
        <Helmet>
          <title>{COMPANY}</title>
        </Helmet>
        <SpeedDial sx={{ position: "fixed", bottom: 16, right: 16 }} icon={<SpeedDialIcon />} direction={"up"} ariaLabel="SpeedDial playground example">
          <SpeedDialAction onClick={() => setProfileOpen((profileOpen) => !profileOpen)} icon={<AccountCircle />} tooltipTitle={"Update Profile"} />
          <SpeedDialAction onClick={handleMode} icon={mode === "light" ? <LightMode /> : <DarkMode />} tooltipTitle={"Switch to " + (mode === "light" ? "Dark" : "Light") + " Theme"} />
        </SpeedDial>
        <Box sx={{ display: "flex" }}>
          <NavBar open={open} toggleDrawer={toggleDrawer} />
          <SideBar open={open} toggleDrawer={toggleDrawer} />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar sx={{ mb: 3 }} />
            <Suspense fallback={<Loader />}>
              <Routes>
                {user && user?.email ? (
                  <>
                    <Route path="/recommendation/*" element={<Recommendation />} />
                    <Route path="/interaction/*" element={<Interaction />} />
                    <Route path="/reporting/*" element={<Reporting />} />
                    <Route path="/*" element={<Home />} />
                  </>
                ) : (
                  <>
                    <Route path="/auth/*" element={<Auth />} />
                  </>
                )}
              </Routes>
            </Suspense>
          </Box>
        </Box>
        {user?.email ? <Dialog open={(isProfileComplete(user) || profileOpen)} onClose={() => setProfileOpen(!isProfileComplete(user))}>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogContent>
            <DialogContentText>Complete / Update your profile and continue using {COMPANY}.</DialogContentText>
            <Box component={"form"} onSubmit={updateProfile}>
              <Grid container spacing={2} my={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required sx={{ flex: 1 }} defaultValue={user?.name || ""} label="Name" name="name" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField disabled fullWidth sx={{ flex: 1 }} defaultValue={user?.email || ""} name="email" label="Email" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    fullWidth
                    required
                    sx={{ flex: 1 }}
                    onChange={(e, value) => {
                      setRole(value);
                      setUser((user) => ({ ...user, role: value, roleId: fetchRoleIds(value)[0] }));
                      setRoleIds(fetchRoleIds(value) || []);
                    }}
                    defaultValue={user?.role || Object.keys(roles)[0]}
                    options={Object.keys(roles)}
                    renderInput={(params) => <TextField {...params} label="Role" name="role" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete fullWidth required sx={{ flex: 1 }} value={user?.roleId || (roleIds.length ? roleIds[0] : "")} onChange={(e, value) => setUser((user) => ({ ...user, roleId: value }))} options={roleIds} renderInput={(params) => <TextField {...params} name="roleId" label="Role ID" />} />
                </Grid>
              </Grid>
              <LoadingButton fullWidth loading={isLoading} variant="contained" type="submit" color="primary">
                Update Profile
              </LoadingButton>
            </Box>
          </DialogContent>
        </Dialog> : null}
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default Dashboard;
