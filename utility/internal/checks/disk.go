package checks

import (
	"bytes"
	"os/exec"
	"runtime"
	"strings"
)

// CheckDiskEncryption verifies if disk encryption is enabled across platforms
func CheckDiskEncryption() (bool) {
	switch runtime.GOOS {
	case "windows":
		// BitLocker status: "C:" drive
		// Command: manage-bde -status C:
cmd := exec.Command("powershell", "-Command", "manage-bde -status C:")
		var out bytes.Buffer
		cmd.Stdout = &out
		if err := cmd.Run(); err != nil {
			return false
		}
		output := out.String()
		if strings.Contains(output, "Percentage Encrypted: 100%") ||
			strings.Contains(output, "Encryption Method:") {
			return true
		}
		return false

	case "darwin":
		// FileVault status: fdesetup status
		cmd := exec.Command("fdesetup", "status")
		var out bytes.Buffer
		cmd.Stdout = &out
		if err := cmd.Run(); err != nil {
			return false
		}
		output := strings.ToLower(out.String())
		if strings.Contains(output, "filevault is on") {
			return true
		}
		return false

	case "linux":
		// Check for LUKS/dm-crypt using lsblk
		cmd := exec.Command("lsblk", "-o", "NAME,TYPE,MOUNTPOINT,FSTYPE")
		var out bytes.Buffer
		cmd.Stdout = &out
		if err := cmd.Run(); err != nil {
			return false
		}
		output := out.String()
		if strings.Contains(output, "crypt") || strings.Contains(output, "luks") {
			return true
		}
		return false
	}

	return false
}
