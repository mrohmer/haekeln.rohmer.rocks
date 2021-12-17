export const omitKey = <T extends Record<string|number|symbol, any>, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> =>
	Object.entries(obj)
		.filter(([key]) => !keys.includes(key as K))
		.reduce(
			(prev, [key, value]) => ({
				...prev,
				[key]: value,
			}),
			{} as Omit<T, K>
		)

export const omitKeyInArray = <T extends Record<string|number|symbol, any>, K extends keyof T>(arr: T[], ...keys: K[]): Omit<T, K>[] =>
	arr.map(obj => omitKey(obj, ...keys))
