import React from "react";
// mui
import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box
      style={{
        display: "grid",
        placeItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
