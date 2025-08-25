package checks

type SystemState struct {
	DiskEncrypted bool
	OSUpToDate    bool
	Antivirus     bool
	SleepOK       bool
	MachineID     string
	OSName        string
}

func (s SystemState) HasChanged(old SystemState) bool {
	return s != old
}

func RunAllChecks() SystemState {
	return SystemState{
		DiskEncrypted: CheckDiskEncryption(),
		OSUpToDate:    CheckOSUpdates(),
		Antivirus:     CheckAntivirus(),
		SleepOK:       CheckSleepSettings(),
		MachineID:     getMachineID(),
		OSName:        getOSName(),
	}
}
