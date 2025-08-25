import Machine from "../models/machine.js";
import { getStatus, findIssues } from "../utils/machineUtils.js";
import { Parser } from "json2csv";

// @desc Add or Update machine data
// @route POST /api/machines


export const insertMachine = async (req, res) => {
  try {
    const { MachineID, OSName, DiskEncrypted, OSUpToDate, SleepOK, Antivirus } =
      req.body;

    const Details = {
      diskEncrypted: DiskEncrypted,
      osUpToDate: OSUpToDate,
      sleepOK: SleepOK,
      antivirus: Antivirus,
    };

    const updateData = {
      OSName,
      Details,
      Status: getStatus(Details),
      Issues: findIssues(Details),
    };

    // Update if exists, otherwise insert a new document
    const machine = await Machine.findOneAndUpdate(
      { MachineID },
      { $push: { History: updateData }, ...updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res
      .status(200)
      .json({ message: "Machine data updated successfully", machine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Example helper to derive status

// @desc Get all machines
// @route GET /api/machines
export const getMachines = async (req, res) => {
  try {
    const { os, status, issue } = req.query; // single issue

    let filter = {};

    if (os) filter.OSName = os;
    if (status) filter.Status = status;
    if (issue) filter.Issues = issue; // checks if the issue exists in the Issues array

    const machines = await Machine.find(filter).sort({ updatedAt: -1 });
    
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Export CSV
// @route GET /api/machines/export

export const exportCSV = async (_req, res) => {
  try {
    const machines = await Machine.find({}).lean();

    // Define the fields we want in the CSV
    const fields = [
      "MachineID",
      "OSName",
      "Status",
      "Details",
      "Issues",
      "createdAt",
      "updatedAt",
    ];

    // Format data: stringify nested objects/arrays so CSV looks clean
    const formattedData = machines.map((m) => ({
      MachineID: m.MachineID,
      OSName: m.OSName,
      Status: m.Status,
      Details: JSON.stringify(m.Details || {}),
      Issues: (m.Issues || []).join("; "), // join array into string
      createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : "",
      updatedAt: m.updatedAt ? new Date(m.updatedAt).toISOString() : "",
    }));

    // Convert JSON -> CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedData);

    res.header("Content-Type", "text/csv");
    res.attachment("machines.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

