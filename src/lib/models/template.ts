import type { IStep } from './step';

export interface ITemplate {
	title: string;
	steps: Omit<IStep, 'state'>[];
}
export type ITemplates = Record<string, ITemplate>;
