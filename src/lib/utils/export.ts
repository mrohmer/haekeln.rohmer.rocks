import type { Project } from '$lib/models/project';
import type { ProjectPart } from '$lib/models/project-part';
import type { Rounds } from '$lib/models/round';
import * as lzString from 'lz-string';
import { parse, stringify } from 'devalue';

export type ProjectExportData = Project & Record<'parts', (ProjectPart & Record<'rounds', Rounds>)[]>;
const cleanProjectExportData = (data: ProjectExportData) => ({
	name: data.name,
	parts: data.parts.map(part => ({
		name: part.name,
		rounds: part.rounds.map(round => ({
			name: round.name,
			checkboxAmount: round.checkboxAmount,
		}))
	}))
});
const encodeV1 = (str: Record<any, any>, prefix: string) => `v1.${prefix}.${lzString.compressToBase64(stringify(str))}`;
export const projectToExportData = (data: ProjectExportData): string => encodeV1(cleanProjectExportData(data), 'proj');
export const workspaceToExportData = (data: ProjectExportData[]): string => encodeV1(data.map(cleanProjectExportData), 'wsp');

const isV1 = (str: string, prefix: string) => str?.trim().startsWith(`v1.${prefix}.`);
const decodeV1 = (str: string, prefix: string) =>
	parse(lzString.decompressFromBase64(str.replace(`v1.${prefix}.`, '')));
export const exportDataToProject = (str: string): ProjectExportData => {
	str = str?.trim();
	if (isV1(str, 'proj')) {
		return decodeV1(str, 'proj');
	}

	throw new Error('unknown version');
};
export const exportDataToWorkspace = (str: string): ProjectExportData[] => {
	str = str?.trim();
	if (isV1(str, 'wsp')) {
		return decodeV1(str, 'wsp');
	}

	throw new Error('unknown version');
};
export const isValid = (str: string) => isWorkspace(str) || isProject(str);
export const isWorkspace = (str: string) => isV1(str, 'wsp');
export const isProject = (str: string) => isV1(str, 'proj');
