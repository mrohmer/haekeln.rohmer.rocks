import { db } from '$lib/db/index';
import type { Rounds } from '$lib/models/round';
import { generateName } from '$lib/utils/generate-name';

interface LocalStorageStep {
	text: string;
	checkboxAmount: number;
	state: number;
}

type LocalStorageValue = Record<string, Record<'steps', LocalStorageStep[]>>
export const migrateFromLocalStorage = async (localStorageValue: LocalStorageValue) => {
	if (!localStorageValue || !Object.keys(localStorageValue).length) {
		return;
	}

	const projectId = String(await db.projects.add({ name: generateName() }));

	return Promise.all(Object.entries(localStorageValue)
		.filter(([key, value]) => value?.steps?.length)
		.map(
			async ([key, { steps }]) => {
				const rounds: Rounds = steps.map(({text: name, ...step}) => ({
					name,
					...step,
				}));
				const roundIds = await db.rounds.bulkAdd(rounds, {allKeys: true});

				return db.projectParts.add({
					name: key,
					projectId,
					roundIds,
				});
			}));
};
