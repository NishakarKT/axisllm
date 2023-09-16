import { User } from "../models.js";

export const editUsers = async (req, res) => {
  try {
    const { query, updates } = req.body;
    await User.updateMany(query, { $set: updates });
    res.status(200).send({ message: "Users updated successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};
