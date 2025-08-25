import express from "express";
import {
  insertMachine,
  getMachines,
  exportCSV,
} from "../controller/machineController.js";

const router = express.Router();

router.post("/", insertMachine); // Add/update machine data
router.get("/", getMachines); // List/filter machines
router.get("/export", exportCSV); // Export CSV

export default router;
