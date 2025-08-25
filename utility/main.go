package main

import (
	"log"
	"utility/internal/checks"

	"utility/internal/reporter"
	"utility/internal/scheduler"
)

func main() {
	log.Println("🔧 Starting System Utility Daemon...")

	// Initial run
	state := checks.RunAllChecks()
	reporter.SendReport(state)

	// Schedule periodic checks (every 15–60 min)
	scheduler.Start(func() {
		newState := checks.RunAllChecks()
		if newState.HasChanged(state) {
			reporter.SendReport(newState)
			state = newState
		}
	})

	select {} // keep daemon running
}
