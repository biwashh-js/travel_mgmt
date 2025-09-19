// backend/routes/admin/dashboard.ts
import { Router } from "express";
import { getDashboardCounts } from "../controllers/dashboardController";

const router = Router();

router.get("/counts", getDashboardCounts);

export default router;
