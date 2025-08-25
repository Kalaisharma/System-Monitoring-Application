package checks

import (
	"bytes"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
)

// CheckSleepSettings verifies inactivity sleep timeout
// Returns true if system sleeps within <= 10 minutes, false otherwise
func CheckSleepSettings() bool {
	os := runtime.GOOS
	switch os {
	case "windows":
		return checkWindowsSleep()
	case "darwin":
		return checkMacSleep()
	case "linux":
		return checkLinuxSleep()
	default:
		return false
	}
}

// -------------------- WINDOWS --------------------
func checkWindowsSleep() bool {
	// Query Windows power configuration
	cmd := exec.Command("powercfg", "/query")
	var out bytes.Buffer
	cmd.Stdout = &out
	if err := cmd.Run(); err != nil {
		return false
	}

	lines := strings.Split(out.String(), "\n")

	inSleepAfter := false
	for _, line := range lines {
    lower := strings.ToLower(strings.TrimSpace(line))

    if strings.Contains(lower, "(sleep after)") {
        inSleepAfter = true
        continue
    }

		// Only process inside that section
    if inSleepAfter && strings.Contains(lower, "current ac power setting index") {
    parts := strings.Fields(lower)
    if len(parts) > 0 {
        val := parts[len(parts)-1] // last token, e.g., 0x0000012c
        if strings.HasPrefix(val, "0x") {
            if sec, err := strconv.ParseInt(val[2:], 16, 64); err == nil {
                min := sec / 60
                return min > 0 && min <= 10
            }
        }
    }
}
	}

	return false
}

// -------------------- MACOS --------------------
func checkMacSleep() bool {
	cmd := exec.Command("pmset", "-g")
	var out bytes.Buffer
	cmd.Stdout = &out
	if err := cmd.Run(); err != nil {
		return false
	}

	for _, line := range strings.Split(out.String(), "\n") {
		if strings.HasPrefix(strings.TrimSpace(line), "sleep") {
			fields := strings.Fields(line)
			if len(fields) >= 2 {
				if min, err := strconv.Atoi(fields[len(fields)-1]); err == nil {
					return min > 0 && min <= 10
				}
			}
		}
	}
	return false
}

// -------------------- LINUX --------------------
func checkLinuxSleep() bool {
	// Try GNOME settings first
	cmd := exec.Command("gsettings", "get", "org.gnome.settings-daemon.plugins.power", "sleep-inactive-ac-timeout")
	var out bytes.Buffer
	cmd.Stdout = &out
	if err := cmd.Run(); err == nil {
		text := strings.TrimSpace(out.String())
		if sec, err := strconv.Atoi(strings.Trim(text, "'")); err == nil {
			// Convert seconds to minutes
			min := sec / 60
			return min > 0 && min <= 10
		}
	}

	// Fallback: systemd inhibitors (not exact timeout, but check if blocked)
	cmd = exec.Command("systemd-inhibit", "--list")
	out.Reset()
	cmd.Stdout = &out
	if err := cmd.Run(); err == nil {
		if strings.Contains(out.String(), "sleep") {
			// If inhibited, treat as non-compliant (never sleeps)
			return false
		}
	}

	return false
}
