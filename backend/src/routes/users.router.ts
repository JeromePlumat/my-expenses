import express from "express";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    res.json({ message: "Users" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default usersRouter;