package checks

import (
	"bytes"
	"os/exec"
	"runtime"
	"strings"
)

// CheckOSUpdates checks if the OS is up-to-date
func CheckOSUpdates() (bool) {
	osType := runtime.GOOS

	switch osType {
	case "windows":
		// PowerShell: check for available updates
		// Requires PSWindowsUpdate module installed
		cmd := exec.Command("powershell", "-Command", "Get-WindowsUpdate -MicrosoftUpdate -IgnoreReboot | Measure-Object | Select -ExpandProperty Count")
		var out bytes.Buffer
		cmd.Stdout = &out
		err := cmd.Run()
		if err != nil {
			return false
		}
		count := strings.TrimSpace(out.String())
		if count == "0" {
			return true
		}
		return false

	case "darwin":
		// macOS: check for software updates
		cmd := exec.Command("softwareupdate", "-l")
		var out bytes.Buffer
		cmd.Stdout = &out
		cmd.Stderr = &out
		err := cmd.Run()
		if err != nil {
			// macOS returns exit code 1 if no updates available
			if strings.Contains(out.String(), "No new software available") {
				return true
			}
			return false
		}
		return false

	case "linux":
		// Linux: try Debian/Ubuntu first
		cmd := exec.Command("sh", "-c", "apt-get -s upgrade | grep '^Inst ' || true")
		var out bytes.Buffer
		cmd.Stdout = &out
		_ = cmd.Run()
		if out.Len() > 0 {
			return false
		}

		// Try Fedora/RHEL
		cmd = exec.Command("sh", "-c", "dnf check-update || true")
		out.Reset()
		cmd.Stdout = &out
		_ = cmd.Run()
		if out.Len() > 0 && !strings.Contains(out.String(), "No packages marked for update") {
			return false
		}

		return true

	default:
		return false
	}
}
