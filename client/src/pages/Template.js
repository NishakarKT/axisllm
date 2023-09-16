import React from "react";
import { Helmet } from "react-helmet";
// constants
import { COMPANY } from "../constants/vars";
// mui
import { Container, Grid, Paper } from "@mui/material";

const Template = () => {
  return (
    <Container maxWidth="100%">
      <Helmet>
        <title> | {COMPANY}</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}></Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}></Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}></Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}></Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}></Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Template;
