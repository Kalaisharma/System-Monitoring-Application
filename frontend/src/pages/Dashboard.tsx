import { useEffect, useState } from "react";
import { fetchMachines } from "../services/machineServices";
import Filters from "../components/Filters";
import MachineTable from "../components/MachineTable";
import { Box, Button, Container, Typography } from "@mui/material";

export default function Dashboard() {
  const [machines, setMachines] = useState([]);

  const loadMachines = async (filters = {}) => {
    const response = await fetchMachines(filters);
    setMachines(response.data);
  };

  useEffect(() => {
    loadMachines();

    const interval = setInterval(() => {
      loadMachines();
    }, 900000);

    return () => clearInterval(interval);
  }, []);

  const handleExportCSV = () => {
    window.open("http://localhost:5000/api/machines/export", "_blank");
  };
  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={2}
      >
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={handleExportCSV}>
          Export as CSV
        </Button>
      </Box>

      <Filters onApply={loadMachines} />
      <MachineTable machines={machines} />
    </Container>
  );
}
