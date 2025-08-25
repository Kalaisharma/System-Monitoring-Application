package checks

import (
	"os/exec"
	"runtime"
	"strings"
)
func getMachineID() string {
	switch runtime.GOOS {
	case "windows":
		out, err := exec.Command("wmic", "csproduct", "get", "uuid").Output()
		if err == nil {
			lines := strings.Split(string(out), "\n")
			if len(lines) > 1 {
				return strings.TrimSpace(lines[1])
			}
		}
	case "linux":
		out, err := exec.Command("cat", "/etc/machine-id").Output()
		if err == nil {
			return strings.TrimSpace(string(out))
		}
		// fallback
		out, err = exec.Command("cat", "/var/lib/dbus/machine-id").Output()
		if err == nil {
			return strings.TrimSpace(string(out))
		}
	case "darwin": // macOS
		out, err := exec.Command("ioreg", "-rd1", "-c", "IOPlatformExpertDevice").Output()
		if err == nil {
			for _, line := range strings.Split(string(out), "\n") {
				if strings.Contains(line, "IOPlatformUUID") {
					parts := strings.Split(line, "\"")
					if len(parts) > 3 {
						return parts[3]
					}
				}
			}
		}
	}
	return "unknown"
}