import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {
    pokemonNamesAndIds,
    pokemon,
    quickMoves,
    chargeMoves,
    stardustCostToDamageMultiplier
} from '../data/constants';

import PokemonSelector from './pokemonSelector';
import myPokemon from '../data/myPokemonKennel';

const stardustOptions = [
    { label: '200', value: '200' },
    { label: '400', value: '400' },
    { label: '600', value: '600' },
    { label: '800', value: '800' },
    { label: '1000', value: '1000' },
    { label: '1300', value: '1300' },
    { label: '1600', value: '1600' },
    { label: '1900', value: '1900' },
    { label: '2200', value: '2200' },
    { label: '2500', value: '2500' },
    { label: '3000', value: '3000' },
    { label: '3500', value: '3500' },
    { label: '4000', value: '4000' },
    { label: '4500', value: '4500' },
    { label: '5000', value: '5000' },
    { label: '6000', value: '6000' },
    { label: '7000', value: '7000' },
    { label: '8000', value: '8000' },
    { label: '9000', value: '9000' },
    { label: '10000', value: '10000' }
];

class PokemonEntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getResetFormObj();
    };

    render() {
        const { uid, cp, dust, pokemonId, nickname, quickMove, chargeMove, possibleQuickMoves, possibleChargeMoves } = this.state;
        const instructions = 'Add a pokemon that you would use to attack gyms';
        const strPokemonPlaceholder = 'Select Pokemon from list';
        const strStardustPlaceholder = 'Select the stardust cost to power up';
        const strQuickMovePlaceholder = 'Select quick move';
        const strChargeMovePlaceholder = 'Select charge move';
        const enableSubmitButton = (pokemonId && cp > 0);
        const rawKennel = myPokemon.getAll();
        const unsortedKennel = [];

        for (var kennelId in rawKennel) {
            const { cp, dust, nickname, pokemonId, quickMove, chargeMove } = rawKennel[kennelId];
            unsortedKennel.push({ kennelId, cp, dust, nickname, pokemonId, quickMove, chargeMove });
        }
        const kennel = unsortedKennel.sort((a, b) => b.cp - a.cp )
                                     .map(p => this.formatKennelEntry(p))

        return (
            <div name='form-container' key='form-container'>
                <div>{instructions}</div>
                <PokemonSelector key='pokemon-selector'
                    pokemonId={pokemonId}
                    onChange={this.handlePokemonSelected.bind(this)}
                    placeholder={strPokemonPlaceholder}
                />
                <label>Name: </label> <input key='nickname-input' type='text' value={nickname} onChange={this.handleNicknameChanged.bind(this)} /><span> (optional)</span><br/>
                <label>CP: </label> <input key='cp-input' type='number' value={cp} onChange={this.handleCpChanged.bind(this)} /> <br/>
                <Select key='dust-selector'
                    value={dust}
                    options={stardustOptions}
                    onChange={this.handleStardustChanged.bind(this)}
                    placeholder={strStardustPlaceholder}
                />

                <Select key='quick-move-selector'
                    value={quickMove}
                    options={possibleQuickMoves}
                    onChange={this.handleQuickMoveSelected.bind(this)}
                    placeholder={strQuickMovePlaceholder}
                />
                <Select key='charge-move-selector'
                    value={chargeMove}
                    options={possibleChargeMoves}
                    onChange={this.handleChargeMoveSelected.bind(this)}
                    placeholder={strChargeMovePlaceholder}
                />
                <button key='add-button'
                    disabled={!enableSubmitButton}
                    onClick={this.addPokemon.bind(this)}>
                    { uid ? 'Update Pokemon' : 'Add Pokemon' }
                </button>
                <button key='reset-button'
                    onClick={this.resetForm.bind(this)}>
                    Reset Form
                </button>

                <div key='kennel-list'>
                    <h3 key='kennel-title'>Your Poke Kennel</h3>
                    {kennel}
                    <hr />
                    <div key='kennel-explanation'>
                        Your pokemon are listed from highest to lowest CP. The number following each move
                        represents the relative power of that move. It is based on the move's DPS and your
                        pokemon's Attack stat and level (estimated from the stardust cost).
                    </div>
                </div>
            </div>
        );
    };

    formatKennelEntry(p) {
        const pokemonStats = pokemon[p.pokemonId];
        const name = p.nickname || pokemonStats.name;
        const quickAttack = quickMoves[p.quickMove];
        const chargeAttack = chargeMoves[p.chargeMove];
        const dmgMultiplier = stardustCostToDamageMultiplier[p.dust || 2500];
        const quickDps = Math.round(dmgMultiplier * pokemonStats.atk * quickAttack.dps / 10);
        const chargeDps = Math.round(dmgMultiplier * pokemonStats.atk * chargeAttack.dps / 10);
        return (
            <div key={p.kennelId} onClick={this.loadPokemon.bind(this, p.kennelId)}>
                <span>{p.cp + ': ' + name}</span>
                <small>{' - ' + quickAttack.name + ':' + quickDps + ' / ' + chargeAttack.name + ':' + chargeDps}</small>
            </div>
        );
    };

    getResetFormObj() {
        const defaultPokemonId = '';
        const moves = this.getPokemonMoves(defaultPokemonId);

        return {
            uid: '',
            pokemonId: defaultPokemonId,
            cp: '',
            dust: '',
            nickname: '',
            quickMove: moves.quickMove,
            chargeMove: moves.chargeMove,
            possibleQuickMoves: moves.possibleQuickMoves,
            possibleChargeMoves: moves.possibleChargeMoves
        };
    };

    handleCpChanged(event) {
        this.setState({
            cp: event.target.value
        });
    };

    handleStardustChanged(dust) {
        this.setState({
            dust: dust.value
        });
    };

    handleNicknameChanged(event) {
        this.setState({
            nickname: event.target.value
        });
    };

    handlePokemonSelected(pokemonId) {
        const moves = this.getPokemonMoves(pokemonId);

        this.setState({
            uid: '', // Ensure the uid & nickname are cleared since the pokemon was changed
            nickname: '',
            pokemonId,
            quickMove: moves.quickMove,
            chargeMove: moves.chargeMove,
            possibleQuickMoves: moves.possibleQuickMoves,
            possibleChargeMoves: moves.possibleChargeMoves
        });
    };

    handleQuickMoveSelected(selection) {
        this.setState({
            quickMove: selection.value
        });
    };

    handleChargeMoveSelected(selection) {
        this.setState({
            chargeMove: selection.value
        });
    };

    resetForm() {
        this.setState(this.getResetFormObj());
    };

    addPokemon() {
        myPokemon.add(this.state);
        this.setState(this.getResetFormObj());
    };

    loadPokemon(uid) {
        const p = myPokemon.get(uid);
        const { pokemonId, cp, dust, nickname, quickMove, chargeMove } = p;
        const moves = this.getPokemonMoves(pokemonId);

        this.setState({
            uid,
            pokemonId,
            cp,
            dust,
            nickname,
            quickMove,
            chargeMove,
            possibleQuickMoves: moves.possibleQuickMoves,
            possibleChargeMoves: moves.possibleChargeMoves
        });
    };

    getPokemonMoves(pokemonId) {
        const p = pokemon[pokemonId];
        if (p) {
            const possibleQuickMoves = p.quick.map((move) => ({ value: move, label: quickMoves[move].name }));
            const possibleChargeMoves = p.charge.map((move) => ({ value: move, label: chargeMoves[move].name }));

            return {
                possibleQuickMoves,
                possibleChargeMoves,
                quickMove: possibleQuickMoves[0].value,
                chargeMove: possibleChargeMoves[0].value
            }
        }

        return {};
    };
}

export default class PokemonKennel extends React.Component {
    render() {
        return (
            <PokemonEntryForm />
        );
    }
};
