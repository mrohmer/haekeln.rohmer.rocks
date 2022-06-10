export interface ProjectPart {
	id?: number;
	projectId: number;
	name: string;
	roundIds: number[];
}
export type ProjectParts = ProjectPart[];
