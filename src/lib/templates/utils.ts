import type { Round } from '$lib/models/round';

export const createRound = (name: string, checkboxAmount = 1): Round => ({name, checkboxAmount, state: 0});
