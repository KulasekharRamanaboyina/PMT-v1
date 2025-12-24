import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { updateProfile } from "../controllers/user.controller";

const router = Router();

router.get("/me", protect, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: (req as any).user.id,
  });
});

router.put("/me", protect, updateProfile);

export default router;
