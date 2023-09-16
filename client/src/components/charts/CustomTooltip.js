import React from "react";
// mui
import { Stack, Typography } from "@mui/material";
// utils
import { dataFormatter } from "../../utils";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Stack
        p={2}
        spacing={1}
        bgcolor={(theme) => (theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.75)" : "rgba(255, 255, 255, 0.75)")}
        borderRadius="5px"
      >
        <Typography variant="h6" color="text.primary">
          {label}
        </Typography>
        <Stack>
          {payload.map((item) => (
            <Typography variant="body2" sx={{ fontWeight: "bold", color: item.stroke }}>
              {item.name}: {dataFormatter(item.value)}
            </Typography>
          ))}
        </Stack>
      </Stack>
    );
  }
};

export default CustomTooltip;
