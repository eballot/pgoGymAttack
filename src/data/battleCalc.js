import { typeEffectiveness, pokemon, quickMoves, chargeMoves } from './constants';

function calculateQuickScore(attackingQuicks, defenderTypes) {
    const quickMoveSeconds = 60;
    const quickResult = {
        avg: 0,
        max: 0,
        list: []
    };

    attackingQuicks.forEach(function(move) {
        const { type, dps } = quickMoves[move];
        const baseDamage = dps * quickMoveSeconds;
        const moveEffectiveness = typeEffectiveness[type];
        const effectiveness = defenderTypes.reduce(function(prevEffectiveness, type) {
            return prevEffectiveness * moveEffectiveness[type];
        }, 1);
        const totalDamage = Math.round(baseDamage * effectiveness);

        quickResult.list.push({
            move,
            effectiveness,
            damage: totalDamage
        });

        if (totalDamage > quickResult.max) {
            quickResult.max = totalDamage;
        }
    });

    quickResult.avg = quickResult.list.reduce((prev, curr) => prev + curr.damage, 0) / quickResult.list.length;

    return quickResult;
}

function calculateChargeScore(attackingCharge, defenderTypes) {
    const chargeMovePercent = 300;
    const chargeResult = {
        avg: 0,
        max: 0,
        list: []
    };

    attackingCharge.forEach(function(move) {
        //TODO: take crit into account
        const { type, pw, cost } = chargeMoves[move];
        const baseDamage = pw * (chargeMovePercent / cost);
        const moveEffectiveness = typeEffectiveness[type];
        const effectiveness = defenderTypes.reduce(function(prevEffectiveness, type) {
            return prevEffectiveness * moveEffectiveness[type];
        }, 1);
        const totalDamage = Math.round(baseDamage * effectiveness);

        chargeResult.list.push({
            move,
            effectiveness,
            damage: totalDamage
        });

        if (totalDamage > chargeResult.max) {
            chargeResult.max = totalDamage;
        }
    });

    chargeResult.avg = chargeResult.list.reduce((prev, curr) => prev + curr.damage, 0) / chargeResult.list.length;

    return chargeResult;

}

/*
 * Calculates a score that can be used to compare which pokemon is best to attack with
 *
 * The pokemon objects should contain
 *     pokemonId: the 3-digit key into the pokemon object
 * Optional attack properties. If these exist, they will be used to calculate a single
 * score rather than using the array of attacks associate with this pokemon
 *     quickMove: the key into the quickMoves object
 *     chargeMove: the key into the chargeMoves object
 *
 * For now, the score is based on 60 seconds of quick attack and 300 percent worth of
 * charge attacks.
 */
export default function battleCalc(attacker, defender) {
    const defendingPokemon = pokemon[defender.pokemonId];
    const defenderTypes = defendingPokemon.types;

    const attackingPokemon = pokemon[attacker.pokemonId];
    const attackingQuick = attacker.quickMove ? [attacker.quickMove] : attackingPokemon.quick;
    const attackingCharge = attacker.chargeMove ? [attacker.chargeMove] : attackingPokemon.charge;

    const quick = calculateQuickScore(attackingQuick, defenderTypes);
    const charge = calculateChargeScore(attackingCharge, defenderTypes);

    return {
        score: quick.max + charge.max,
        quick,
        charge
    }

}