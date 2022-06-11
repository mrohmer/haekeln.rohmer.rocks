export const tap = <T>(cb: (data: T) => void) => (d: T) => {
	cb(d);
	return d;
}
