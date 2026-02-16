export function getHostMessage(hostCount: number | undefined): string {
	return hostCount && hostCount > 1
		? 'Anything else we should know?'
		: 'Anything else the host should know?';
}
