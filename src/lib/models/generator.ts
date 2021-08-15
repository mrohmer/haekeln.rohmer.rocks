import type { IStep } from '$lib/models/step';

export interface StepsGeneratorArgs {
	amount: number;
}
export type StepsGeneratorFn = (args: StepsGeneratorArgs) => IStep[];
