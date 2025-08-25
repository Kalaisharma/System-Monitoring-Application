package checks

import (
	"os/exec"
	"runtime"
	"strings"
)

// CheckAntivirus returns antivirus presence and status as a string
func CheckAntivirus() bool {
	switch runtime.GOOS {
	case "windows":
		// Use PowerShell to check Windows Defender status
		out, err := exec.Command("powershell", "-Command",
			"Get-MpComputerStatus | Select-Object -Property AMServiceEnabled,AntispywareEnabled,AntivirusEnabled | ConvertTo-Json").CombinedOutput()
		if err != nil {
			return false
		}
		value := ""
	for _, line := range strings.Split(strings.TrimSpace(string(out)), "\n") {
		if strings.Contains(line, `"AntivirusEnabled"`) {
			parts := strings.Split(line, ":")
			if len(parts) > 1 {
				value = strings.TrimSpace(parts[1])
				value = strings.Trim(value, ",") // remove trailing comma
			}
		}
	}
	return value == "true"

	case "darwin":
		// macOS: check for common antivirus packages
		out, err := exec.Command("sh", "-c",
			"system_profiler SPApplicationsDataType | grep -i 'avast\\|norton\\|mcafee\\|sophos\\|bitdefender'").CombinedOutput()
		if err != nil || len(out) == 0 {
			return false
		}
		return true

	case "linux":
		// Linux: check if ClamAV service exists
		out, err := exec.Command("sh", "-c", "systemctl is-active clamav-daemon").CombinedOutput()
		if err != nil {
			return false
		}
		status := strings.TrimSpace(string(out))
		if status == "active" {
			return true
		}
		return false
	}

	return false
}
