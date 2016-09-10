import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { pokemonNamesAndIds, pokemon, quickMoves, chargeMoves } from '../data/constants';

import PokemonSelector from './pokemonSelector';
import myPokemon from '../data/myPokemonKennel';


class PokemonEntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getResetFormObj();
    };

    render() {
        const { uid, cp, pokemonId, nickname, quickMove, chargeMove, possibleQuickMoves, possibleChargeMoves } = this.state;
        const instructions = 'Add a pokemon that you would use to attack gyms';
        const strPokemonPlaceholder = 'Select Pokemon from list';
        const strQuickMovePlaceholder = 'Select quick move';
        const strChargeMovePlaceholder = 'Select charge move';
        const enableSubmitButton = (pokemonId && cp > 0);
        const rawKennel = myPokemon.getAll();
        const kennel = [];

        for (var kid in rawKennel) {
            const p = rawKennel[kid];
            kennel.push(<div key={kid} onClick={this.loadPokemon.bind(this, kid)}>{p.cp + ': ' + (p.nickname || pokemon[p.pokemonId].name)}</div>);
        }

        return (
            <div name='form-container' key='form-container'>
                <div>{instructions}</div>
                <PokemonSelector key='pokemon-selector'
                    pokemonId={pokemonId}
                    onChange={this.handlePokemonSelected.bind(this)}
                    placeholder={strPokemonPlaceholder}
                />
                <label>CP: </label> <input key='cp-input' type='number' value={cp} onChange={this.handleCpChanged.bind(this)} /> <br/>
                <label>Name: </label> <input key='nickname-input' type='text' value={nickname} onChange={this.handleNicknameChanged.bind(this)} /><span> (optional)</span><br/>
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
                    <div key='kennel-scroller'>
                        {kennel}
                    </div>
                </div>
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
        const { pokemonId, cp, nickname, quickMove, chargeMove } = p;
        const moves = this.getPokemonMoves(pokemonId);

        this.setState({
            uid,
            pokemonId,
            cp,
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
