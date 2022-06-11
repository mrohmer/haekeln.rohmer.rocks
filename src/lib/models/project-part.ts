export interface ProjectPart {
	id?: number;
	projectId: string; // it needs to be a string 🤷
	name: string;
	roundIds: number[];
}
export type ProjectParts = ProjectPart[];
