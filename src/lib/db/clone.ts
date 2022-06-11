import { db } from '$lib/db/index';
import type { Round } from '$lib/models/round';
import type { ProjectPart } from '$lib/models/project-part';

const createNewRound = async (id: number): Promise<Round> => {
	const round = await db.rounds.get(id);

	return {
		name: round.name,
		checkboxAmount: round.checkboxAmount,
		state: 0,
	};
}
const cloneRounds = async (ids: number[]): Promise<number[]> => {
	if (!ids.length) {
		return [];
	}
	const rounds: Round[] = await Promise.all(ids.map(
		id => createNewRound(id)
	));

	return db.rounds.bulkAdd(rounds, { allKeys: true });
}
const cloneRound = async (id: number): Promise<number> => {
	const round = await createNewRound(id);
	return db.rounds.add(round);
};
const createNewProjectPart = async ({ name, roundIds, projectId }: ProjectPart): Promise<ProjectPart> => {
	return {
		name,
		projectId,
		roundIds: await cloneRounds(roundIds)
	};
}
const cloneProjectPart = async (part: ProjectPart): Promise<number> => {
	return db.projectParts.add(await createNewProjectPart(part));
};
const cloneProjectParts = async (parts: ProjectPart[]): Promise<number[]> => {
	if (!parts.length) {
		return [];
	}

	const newParts: ProjectPart[] = await Promise.all(parts.map(createNewProjectPart));

	return db.projectParts.bulkAdd(newParts, { allKeys: true });
};

export const clone = {
	round: cloneRound,
	rounds: cloneRounds,
	projectPart: cloneProjectPart,
	projectParts: cloneProjectParts,
}
