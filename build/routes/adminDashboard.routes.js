"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/admin/dashboard.ts
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
router.get("/counts", dashboardController_1.getDashboardCounts);
exports.default = router;
