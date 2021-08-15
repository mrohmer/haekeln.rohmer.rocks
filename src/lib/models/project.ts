import type { IStep } from './step';

export interface IProject {
	title: string;
	steps: IStep[];
}
export type IProjects = Record<string, IProject>;
