export function getStatus(details) {
  let count = 0;
  if (!details.diskEncrypted) count++;
  if (!details.osUpToDate) count++;
  if (!details.sleepOK) count++;
  if (!details.antivirus) count++;

  if (count >= 3) return "Critical";
  if (count == 2) return "Warning";
  return "Healthy";
}

export function findIssues(data) {
  const issues = [];
  if (!data.diskEncrypted) issues.push("Disk Encryption Disabled");
  if (!data.osUpToDate) issues.push("OS Not Up to Date");
  if (!data.sleepOK) issues.push("Sleep Mode Not Enabled");
  if (!data.antivirus) issues.push("Antivirus Not Enabled");
  if(data.diskEncrypted && data.osUpToDate && data.sleepOK && data.antivirus) issues.push("No Issues Found");
  return issues;
}
