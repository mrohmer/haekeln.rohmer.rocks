import { adjectives, animals, colors, names, starWars, uniqueNamesGenerator } from 'unique-names-generator';

const adjectivesDictionary = [adjectives, colors].flat();
const namesDictionary = [animals, starWars, names].flat();
export const generateName = (): string => uniqueNamesGenerator({
	dictionaries: [adjectivesDictionary, namesDictionary],
	separator: ' ',

	length: 2,
})
