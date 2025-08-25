package reporter

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"utility/internal/checks"
)

const apiEndpoint = "http://localhost:5000/api/machines"

func SendReport(state checks.SystemState) {
	data, _ := json.Marshal(state)

	resp, err := http.Post(apiEndpoint, "application/json", bytes.NewBuffer(data))
	if err != nil {
		log.Printf("❌ Failed to send report: %v", err)
		return
	}
	defer resp.Body.Close()

	log.Printf("✅ Report sent. Status: %s", resp.Status)
}
