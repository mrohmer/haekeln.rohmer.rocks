import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

const adjectivesDictionary = [adjectives, colors].flat();
export const generateName = (): string => uniqueNamesGenerator({
	dictionaries: [adjectivesDictionary, animals],
	separator: ' ',
	length: 2,
})
