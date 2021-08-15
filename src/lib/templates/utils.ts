import type { IStep } from '$lib/models/step';

export const createStep = (text: string, checkboxAmount = 1): IStep => ({text, checkboxAmount, state: 0});
