import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
// constants
import { COMPANY } from "../constants/vars";
import { DATA_INTERACTION_ENDPOINT } from "../constants/endpoints";
// contexts
import AppContext from "../contexts/AppContext";
// mui
import { Container, Grid, Paper, TextField, Typography, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Send } from "@mui/icons-material";

const Interaction = () => {
  const { user } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleQuery = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { query } = Object.fromEntries(new FormData(e.target));
    try {
      const data = { query, role: user?.role || "BranchHead", userId: user?._id || "AnonymousId", roleId: user?.role || "BranchHead", details: 0 };
      setMessages((messages) => [...messages, { sender: user?.name || "Anonymous", text: query, date: new Date().toISOString(), isSenderMe: true }]);
      axios
        .get(DATA_INTERACTION_ENDPOINT, { params: data })
        .then((res) => {
          if (res.data.result?.output?.length) setMessages((messages) => [...messages, { sender: COMPANY, text: res.data.result.output, date: new Date().toISOString(), isSenderMe: false }]);
          e.target.reset();
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

  return (
    <Container maxWidth="100%">
      <Helmet>
        <title>Interaction | {COMPANY}</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary">
              Interaction
            </Typography>
            <Stack spacing={2} p={2} sx={{ height: "calc(100vh - 224px)", overflowY: "auto", overflowX: "hidden" }}>
              {messages.map((message, index) => (
                <Stack key={"message_" + index} sx={{ width: "fit-content", p: 2, borderRadius: "8px", alignSelf: !message.isSenderMe ? "flex-start" : "flex-end", backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]) }}>
                  <Typography variant="h6" color={!message.isSenderMe ? "text.primary" : "primary"}>
                    {message.sender}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {new Date(message.date).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {message.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Stack direction="row" spacing={2} pr={2} component="form" onSubmit={handleQuery}>
              <TextField required fullWidth name="query" label="What's on your mind?" placeholder="Ex:- How I am doing compared to my colleagues in the cluster ?" variant="outlined" />
              <LoadingButton startIcon={<Send />} loading={isLoading} variant="contained" type="submit" color="primary">
                Send
              </LoadingButton>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Interaction;
