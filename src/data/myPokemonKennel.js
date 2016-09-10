import { pokemonNamesAndIds, pokemon, quickMoves, chargeMoves } from './constants';

const dbkey = 'myPokemon';

/*
 * stores the pokemon in the format
 * {
 *     uid: {
 *         pokemonId: the 3-digit key into the pokemon object
 *         cp: its combat power
 *         nickname: option text to display instead of the pokemon type
 *         quickMove: the key into the quickMoves object
 *         chargeMove: the key into the chargeMoves object
 *     }
 * }
 */
const MyPokemon = {
    getCount() {
        return Object.keys(this.getAll()).length;
    },

    // Add or update a pokemon. If uid is specified, the existing pokemon data
    // for that uid will be updated.
    add({ uid, pokemonId, cp, nickname, quickMove, chargeMove }) {
        var success = false;
        // Validity checks
        if (cp > 0 && pokemon[pokemonId] && quickMoves[quickMove] && chargeMoves[chargeMove]) {
            uid = uid || this._createUid(pokemonId, cp);
            const list = JSON.parse(localStorage[dbkey] || '{}');
            list[uid] = {
                pokemonId,
                cp,
                nickname,
                quickMove,
                chargeMove
            };
            localStorage.setItem(dbkey, JSON.stringify(list));
            success = true;
        }

        return success;
    },

    get(uid) {
        const all = this.getAll();
        return all[uid];
    },

    getAll() {
        return JSON.parse(localStorage[dbkey] || '{}');
    },

    _createUid(pokemonId) {
        return pokemonId + '_' + Date.now();
    }
};

export default MyPokemon;