import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip,
} from "@mui/material";
type Machine = {
  _id: string;
  MachineID: string;
  OSName: string;
  Status: "Healthy" | "Warning" | "Error";
  Issues: string[];
  updatedAt: string;
};

interface MachineTableProps {
  machines: Machine[];
}

export default function MachineTable({ machines }: MachineTableProps) {
  if (!machines.length) return <Typography variant="h6" align="center">No machines found</Typography>;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Machine ID</TableCell>
          <TableCell>OS Name</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Issues</TableCell>
          <TableCell>Last Check-in</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {machines.map((m) => (
          <TableRow key={m._id}>
            <TableCell>{m.MachineID}</TableCell>
            <TableCell>{m.OSName}</TableCell>
            <TableCell>
              <Chip
                label={m.Status}
                color={
                  m.Status === "Healthy"
                    ? "success"
                    : m.Status === "Warning"
                    ? "warning"
                    : "error"
                }
              />
            </TableCell>
            <TableCell>
              {m.Issues?.length > 0
                ? m.Issues.map((i:string, idx:number) => <div key={idx}>{i}</div>)
                : "None"}
            </TableCell>
            <TableCell>{new Date(m.updatedAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
