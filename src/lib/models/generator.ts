import type { Round } from '$lib/models/round';

export type RoundGeneratorFn<T> = (args: T) => Round[];
