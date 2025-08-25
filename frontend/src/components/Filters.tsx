import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";

const osOptions = ["Windows", "Linux", "macOS"];
const statusOptions = ["Healthy", "Warning", "Critical"];
const issueOptions = [
  "Disk Encryption Disabled",
  "OS Not Up to Date",
  "Sleep Mode Not Enabled",
  "Antivirus Not Enabled",
  "No Issues Found",
];
export type FilterValues = {
  os: string;
  status: string;
  issue: string;
};

// Define props with proper typing
interface FiltersProps {
  onApply: (filters: FilterValues) => void;
}

export default function Filters({ onApply }:FiltersProps) {
  const [os, setOs] = useState("");
  const [status, setStatus] = useState("");
  const [issue, setIssue] = useState("");

  const handleApply = () => {
    onApply({ os, status, issue });
  };

  return (
    <Box display="flex" gap={2} mb={2}>
      <FormControl fullWidth>
        <InputLabel id="os-label">OS</InputLabel>
        <Select
          labelId="os-label"
          value={os}
          onChange={(e) => setOs(e.target.value)}
          label="OS" // This is important for proper floating
        >
          <MenuItem value="">All</MenuItem>
          {osOptions.map((o) => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          label="Status"
        >
          <MenuItem value="">All</MenuItem>
          {statusOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="issue-label">Issue</InputLabel>
        <Select
          labelId="issue-label"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          label="Issue"
        >
          <MenuItem value="">All</MenuItem>
          {issueOptions.map((i) => (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handleApply}>
        Apply
      </Button>
    </Box>
  );
}
