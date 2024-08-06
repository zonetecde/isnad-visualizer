export function generateRandomId() {
	return new Date().toISOString().replace(/:/g, '-');
}
