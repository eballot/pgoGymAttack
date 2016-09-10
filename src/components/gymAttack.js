import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { pokemonNamesAndIds, pokemon, quickMoves, chargeMoves } from '../data/constants';

import PokemonSelector from './pokemonSelector';
import myPokemon from '../data/myPokemonKennel';
import battleCalc from '../data/battleCalc'

function formatMove(moveScore, allMoves) {
    const { move, effectiveness } = moveScore;
    var style;
    if (effectiveness > 1.1) {
        style = { color: 'green' };
    } else if (effectiveness < 1.1) {
        style = { color: 'red' };
    } else {
        style = { color: 'black' };
    }

    return (
        <span style={style}> {allMoves[move].name} </span>
    );
}

function formatAttacker(attackerScore, kennel) {
    const { uid, score, attacker: { quick, charge } } = attackerScore;
    const p = kennel[uid];
    const displayName = p.nickname || pokemon[p.pokemonId].name;
    const quickText = formatMove(quick.list[0], quickMoves);
    const chargeText = formatMove(charge.list[0], chargeMoves);
    const style = {};
    const scoreStyle = { textAlign: 'right', paddingRight: '8px' };
    return (
        <tr key={uid}>
            <td style={style}>{displayName}</td>
            <td style={scoreStyle}>{score}</td>
            <td style={style}>{quickText} / {chargeText}</td>
        </tr>
    );
}

export default class GymAttackForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getResetFormObj();
        this.kennel = myPokemon.getAll();

    };

    render() {
        const { defenders, pokemonId, quickMove, chargeMove, possibleQuickMoves, possibleChargeMoves } = this.state;
        const instructions = 'Add the pokemon that are defending the gym';
        const strPokemonPlaceholder = 'Select defender from list';
        const strQuickMovePlaceholder = 'Select quick move';
        const strChargeMovePlaceholder = 'Select charge move';
        const enableSubmitButton = (pokemonId);
        const defenderList = defenders.map((d, index) => {
            return (<li key={index} onClick={this.handleRemoveDefender.bind(this, index)}>
                       <em>{ pokemon[d.pokemonId].name }</em>

                        <table><tbody>
                            { d.bestAttackers.map((a) => formatAttacker(a, this.kennel) ) }
                        </tbody></table>
                    </li>);
        });

        return (
            <div name='gym-form-container' key='gym-form-container'>
                <div>{instructions}</div>
                <PokemonSelector key='pokemon-selector'
                    pokemonId={pokemonId}
                    onChange={this.handlePokemonSelected.bind(this)}
                    placeholder={strPokemonPlaceholder}
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
                    onClick={this.addDefender.bind(this)}>
                    Add Pokemon
                </button>
                <button key='reset-button'
                    onClick={this.resetForm.bind(this)}>
                    Reset Form
                </button>

                <div key='defender-list'>
                    <h3 key='defender-title'>Defenders</h3>
                    <ol key='defender-scroller'>
                        {defenderList}
                    </ol>
                </div>
            </div>
        );
    };

    getResetFormObj() {
        return {
            defenders: [],
            pokemonId: '',
            quickMove: '',
            chargeMove: '',
            possibleQuickMoves: [],
            possibleChargeMoves: []
        };
    };

    handlePokemonSelected(pokemonId) {
        const moves = this.getPokemonMoves(pokemonId);

        this.setState({
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

    addDefender() {
        const { defenders, pokemonId, quickMove, chargeMove } = this.state;
        const defenderPokemon = pokemon[pokemonId];
        if (defenderPokemon) {
            const newDefender = { pokemonId };
            if (quickMove !== 'unk') {
                newDefender.quickMove = quickMove;
            }
            if (chargeMove !== 'unk') {
                newDefender.chargeMove = chargeMove;
            }

            newDefender.bestAttackers = this.calculateBattleScores(newDefender);
            defenders.push(newDefender);

            this.setState({ defenders });
        }
    };

    handleRemoveDefender(index) {
        const result = window.confirm('Delete this defender?');
        if (result) {
            const { defenders } = this.state;
            defenders.splice(index, 1);
            this.setState({ defenders });
        }
    };

    calculateBattleScores(defender) {
        const attackIds = Object.keys(this.kennel);
        const attackerResults = attackIds.map((uid) => {
            const attackerResult = battleCalc(this.kennel[uid], defender);
            const defenderResult = battleCalc(defender, this.kennel[uid]);
            return {
                uid,
                score: attackerResult.score - defenderResult.score,
                attacker: attackerResult,
                defender: defenderResult
            };
        }).sort((a, b) => b.score - a.score);

        return attackerResults.slice(0, 4);
    };


/*
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

    //var foo = battleCalc({pokemonId: '073'}, {pokemonId, quickMove, chargeMove});
    };
*/
    getPokemonMoves(pokemonId) {
        const p = pokemon[pokemonId];
        if (p) {
            const unknownMove = {
                label: 'Unknown',
                value: 'unk'
            };
            const possibleQuickMoves = p.quick.map((move) => ({ value: move, label: quickMoves[move].name }));
            possibleQuickMoves.unshift(unknownMove);
            const possibleChargeMoves = p.charge.map((move) => ({ value: move, label: chargeMoves[move].name }));
            possibleChargeMoves.unshift(unknownMove);

            return {
                possibleQuickMoves,
                possibleChargeMoves,
                quickMove: unknownMove.value,
                chargeMove: unknownMove.value
            }
        }

        return {};
    };
}

