import Dexie from 'dexie';
import type { Project } from '$lib/models/project';
import type { ProjectPart } from '$lib/models/project-part';
import type { Round } from '$lib/models/round';

export class ProjectDb extends Dexie {
	projects!: Dexie.Table<Project>;
	projectParts!: Dexie.Table<ProjectPart>;
	rounds!: Dexie.Table<Round>;

	constructor() {
		super('projects');
		this.version(1).stores({
			projects: '++id, name',
			projectParts: '++id, name, projectId',
			rounds: '++id, name',
		});
	}
}

export const db = new ProjectDb();
