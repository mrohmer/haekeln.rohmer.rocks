import type { StepsGeneratorFn } from '$lib/models/generator';
import { createStep } from '$lib/templates/utils';

export const ballTemplate: StepsGeneratorFn = ({amount}) => {
	const fmIncreaseSteps = [];
	const fmDecreaseSteps = [];
	for (let i = 1; i < amount; i++) {
		fmIncreaseSteps.push(createStep(`${i} fM, verdoppeln (${(i + 1) * 6})`));
		fmDecreaseSteps.push(createStep(`${i} fM, Abnahme (${(i + 1) * 6})`));
	}

	return [
		createStep(`Magic Ring (6)`),
		...fmIncreaseSteps,
		createStep('Runde', amount + 1),
		...fmDecreaseSteps.reverse(),
		createStep(`Abnahme (6)`)
	]
}
