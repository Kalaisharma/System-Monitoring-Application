package scheduler

import (
	"log"
	"time"
)

// Runs job every 15–60 minutes
func Start(job func()) {
	go func() {
		for {
			interval := time.Duration(15) * time.Minute
			log.Printf("⏳ Next check in %v", interval)
			time.Sleep(interval)
			job()
		}
	}()
}
