'use strict';

const TOTAL_TEAMS = 10;
const ALL_GENS = [1, 2, 3, 4, 5, 6, 7];

function isValidSet(gen, set) {
	const dex = Dex.mod(`gen${gen}`);
	const template = dex.getTemplate(set.species || set.name);
	if (!template.exists || template.gen > gen) return false;
	if (set.item) {
		const item = dex.getItem(set.item);
		if (!item.exists || item.gen > gen) {
			return false;
		}
	}
	if (set.ability && set.ability !== 'None') {
		const ability = dex.getAbility(set.ability);
		if (!ability.exists || ability.gen > gen) {
			return false;
		}
	} else if (gen >= 3) {
		return false;
	}
	return true;
}

describe(`Random Team generator`, function () {
	for (const gen of ALL_GENS) {
		it(`should successfully create valid Gen ${gen} teams`, function () {
			this.timeout(0);
			const generator = Dex.getTeamGenerator(`gen${gen}randombattle`);
			if (generator.gen !== gen) return; // format doesn't exist for this gen

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				let seed = generator.prng.initialSeed;
				try {
					let team = generator.generateTeam();
					let invalidSet = team.find(set => !isValidSet(gen, set));
					if (invalidSet) throw new Error(`Invalid set: ${JSON.stringify(invalidSet)} (seed ${seed})`);
				} catch (err) {
					err.message += ` (seed ${seed})`;
					throw err;
				}
			}
		});
	}
});

describe(`Challenge Cup Team generator`, function () {
	for (const gen of ALL_GENS) {
		it(`should successfully create valid Gen ${gen} teams`, function () {
			this.timeout(0);
			const generator = Dex.getTeamGenerator(`gen${gen}challengecup`);
			if (generator.gen !== gen) return; // format doesn't exist for this gen

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				let seed = generator.prng.initialSeed;
				try {
					let team = generator.generateTeam();
					let invalidSet = team.find(set => !isValidSet(gen, set));
					if (invalidSet) throw new Error(`Invalid set: ${JSON.stringify(invalidSet)} (seed ${seed})`);
				} catch (err) {
					err.message += ` (seed ${seed})`;
					throw err;
				}
			}
		});
	}
});

describe(`Hackmons Cup Team generator`, function () {
	for (const gen of ALL_GENS) {
		it(`should successfully create valid Gen ${gen} teams`, function () {
			this.timeout(0);
			const generator = Dex.getTeamGenerator(`gen${gen}hackmonscup`);
			if (generator.gen !== gen) return; // format doesn't exist for this gen

			let teamCount = TOTAL_TEAMS;
			while (teamCount--) {
				let seed = generator.prng.initialSeed;
				try {
					let team = generator.generateTeam();
					let invalidSet = team.find(set => !isValidSet(gen, set));
					if (invalidSet) throw new Error(`Invalid set: ${JSON.stringify(invalidSet)} (seed ${seed})`);
				} catch (err) {
					err.message += ` (seed ${seed})`;
					throw err;
				}
			}
		});
	}
});
