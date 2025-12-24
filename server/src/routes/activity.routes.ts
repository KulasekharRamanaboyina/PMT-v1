import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Get activity logs" });
});

export default router;
