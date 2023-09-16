import fs from "fs";
import csv from "csv-parser";
// vars
const REPORTING_ENDPOINT = "http://127.0.0.1:8000/finale";

export const getData = async (req, res) => {
  try {
    const results = [];
    fs.createReadStream("data/data.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        res.status(200).send({ data: results });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};

export const queryData = async (req, res) => {
  try {
    const { query, role, userId, roleId, details } = req.query;
    const result = await fetch(REPORTING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, role, userId, roleID: roleId, details }),
    });
    const response = await result.json();
    return res.status(200).send({ result: response.data, charts: [] });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};

export const interactionData = async (req, res) => {
  try {
    const { query, role, userId, roleId, details } = req.query;
    const result = await fetch(REPORTING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, role, userId, roleID: roleId, details }),
    });
    const response = await result.json();
    return res.status(200).send({ result: response.data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};

export const recommendationData = async (req, res) => {
  try {
    const { query, role, userId, roleId, details } = req.query;
    const result = await fetch(REPORTING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, role, userId, roleID: roleId, details }),
    });
    const response = await result.json();
    return res.status(200).send({ result: response.data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};
