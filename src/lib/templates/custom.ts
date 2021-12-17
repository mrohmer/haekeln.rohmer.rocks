import type { StepsGeneratorFn } from '$lib/models/generator';
import type { ITemplate } from '$lib/models/template';

export const customTemplate: StepsGeneratorFn<ITemplate> = ({ steps }: ITemplate) => steps.map(step => ({
	...step,
	state: 0,
}))

