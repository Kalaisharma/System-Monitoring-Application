import mongoose from "mongoose";

const machineSchema = mongoose.Schema(
  {
    MachineID: { type: String, required: true },
    OSName: { type: String, required: true },
    Status: {
      type: String,
      enum: ["Healthy", "Warning", "Critical"],
      default: "Healthy",
    },
    Details: { type: Object },
    Issues: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Machine", machineSchema);
