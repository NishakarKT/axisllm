import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import jsPDF from "jspdf";
// constants
import { COMPANY } from "../constants/vars";
import { DATA_QUERY_ENDPOINT } from "../constants/endpoints";
// contexts
import AppContext from "../contexts/AppContext";
// components
import Charts from "../components/charts/Charts";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import AreaChart from "../components/charts/AreaChart";
// mui
import { Container, Grid, Paper, TextField, Typography, Stack, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Insights, Download } from "@mui/icons-material";
// data
const TYPE_SPEED = 7;
const chartComponents = {
  line: LineChart,
  area: AreaChart,
  bar: BarChart,
};

const Reporting = () => {
  const user = useContext(AppContext);
  const [charts, setCharts] = useState([]);
  const [report, setReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // fetch charts data
  const fetchChartsData = (charts) => charts && charts.map((chart) => ({ ...chart, delay: 1000, height: "90%", component: chartComponents[chart.type] }));

  // type effect
  const typeEffect = (i, text, callback) => {
    if (i < text.length) {
      callback((prev) => prev + text.charAt(i));
      setTimeout(() => typeEffect(i + 1, text, callback), TYPE_SPEED);
    }
  };

  // handle query
  const handleQuery = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { query } = Object.fromEntries(new FormData(e.target));
    try {
      const data = { query, role: user?.role || "BranchHead", userId: user?._id || "AnonymousId", roleId: user?.role || "BranchHead", details: 1 };
      axios
        .get(DATA_QUERY_ENDPOINT, { params: data })
        .then((res) => {
          console.log(res.data);
          setReport("");
          setCharts([]);
          if (res.data.result?.output?.length) typeEffect(0, res.data.result.output, setReport);
          if (res.data.result?.data.length) {
            // const cols = res.data.result.cols;
            const data = res.data.result.data;
            const charts = [];
            data.forEach((item, index) => {
              const { x, y } = item;
              const chartData = [];
              x.map((x_item, idx) => chartData.push({ ["x"]: x_item, ["y"]: y[idx] }));
              charts.push({ type: "line", x, data: chartData });
            });
            console.log(charts);
            e.target.reset();
            setCharts(fetchChartsData(charts));
          }
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
  };

  // handle download
  const handleDownload = () => {
    // Create a new instance of jsPDF
    const doc = new jsPDF();
    // Add text to the PDF
    doc.text(report, 10, 10);
    // Save the PDF to a file or open it in a new tab
    doc.save("report_" + new Date().toLocaleDateString() + "_" + new Date().toLocaleTimeString("en-US", { hour12: false }) + ".pdf");
  };

  return (
    <Container maxWidth="100%">
      <Helmet>
        <title>Reporting | {COMPANY}</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }} component={"form"} onSubmit={handleQuery}>
            <Typography variant="h6" color="primary">
              What's on your mind?
            </Typography>
            <TextField fullWidth required name="query" label="Enter your query!" placeholder="Ex:- I want to look at the performance of employees in my branch" variant="outlined" sx={{ my: 2 }} />
            <LoadingButton loading={isLoading} type="submit" startIcon={<Insights />} variant="contained">
              Fetch Insights
            </LoadingButton>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary">
              Insights
            </Typography>
            {charts.length ? (
              <Charts charts={charts} />
            ) : (
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {"No insights generated yet!"}
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Reporting
              </Typography>
              <IconButton onClick={handleDownload}>
                <Download />
              </IconButton>
            </Stack>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {report || "No report generated yet!"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reporting;
