import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import MRT from "material-react-table";
import axios from "axios";
// constants
import { COMPANY } from "../constants/vars";
import { DATA_ENDPOINT } from "../constants/endpoints";
// mui
import { Container, Grid, Paper, Typography } from "@mui/material";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    try {
      axios
        .get(DATA_ENDPOINT)
        .then((res) => {
          if (res.data.data?.length) {
            setData(res.data.data);
            setColumns(Object.keys(res.data.data[0]).map((key) => ({ header: key, accessorKey: key })));
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }, []);

  return (
    <Container maxWidth="100%">
      <Helmet>
        <title>Home | {COMPANY}</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <MRT
              columns={columns}
              data={data}
              state={{ isLoading }}
              // enables
              enableStickyHeader
              enableStickyFooter
              // props
              muiTablePaperProps={{ elevation: 0 }}
              muiTableContainerProps={{ sx: { height: "400px" } }}
              // render
              renderTopToolbarCustomActions={() => (
                <Typography variant="h6" color="primary">
                  Data Grid
                </Typography>
              )}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
