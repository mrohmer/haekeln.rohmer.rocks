import type { StepsGeneratorFn } from '$lib/models/generator';
import { createStep } from '$lib/templates/utils';
import type { IStep } from '$lib/models/step';

export interface StepsGeneratorArgs {
	amount: number;
}

export const ballTemplate: StepsGeneratorFn<StepsGeneratorArgs> = ({amount}: StepsGeneratorArgs) => {
	const fmIncreaseSteps = [];
	const fmDecreaseSteps = [];
	for (let i = 1; i < amount; i++) {
		fmIncreaseSteps.push(createStep(`${i} fM, verdoppeln (${(i + 2) * 6})`));
		fmDecreaseSteps.push(createStep(`${i} fM, Abnahme (${(i + 1) * 6})`));
	}

	return [
		createStep(`Magic Ring (6)`),
		createStep(`verdoppeln (12)`),
		...fmIncreaseSteps,
		createStep('Runde', amount + 1),
		...fmDecreaseSteps.reverse(),
		createStep(`Abnahme (6)`),
		createStep(`Vernähen`),
	] as IStep[]
}
