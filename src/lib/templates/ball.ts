import type { RoundGeneratorFn } from '$lib/models/generator';
import { createRound } from '$lib/templates/utils';
import type { Round } from '$lib/models/round';

export interface RoundGeneratorArgs {
	amount: number;
}

export const ballTemplate: RoundGeneratorFn<RoundGeneratorArgs> = ({amount}: RoundGeneratorArgs) => {
	const fmIncreaseSteps = [];
	const fmDecreaseSteps = [];
	for (let i = 1; i < amount; i++) {
		fmIncreaseSteps.push(createRound(`${i} fM, verdoppeln (${(i + 2) * 6})`));
		fmDecreaseSteps.push(createRound(`${i} fM, Abnahme (${(i + 1) * 6})`));
	}

	return [
		createRound(`Magic Ring (6)`),
		createRound(`verdoppeln (12)`),
		...fmIncreaseSteps,
		createRound('Runde', amount + 1),
		...fmDecreaseSteps.reverse(),
		createRound(`Abnahme (6)`),
		createRound(`Vernähen`),
	] as Round[]
}
