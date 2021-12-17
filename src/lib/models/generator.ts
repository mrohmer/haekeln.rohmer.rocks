import type { IStep } from '$lib/models/step';

export type StepsGeneratorFn<T> = (args: T) => IStep[];
