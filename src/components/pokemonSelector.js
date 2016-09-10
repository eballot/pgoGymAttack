import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { pokemonNamesAndIds } from '../data/constants';

var options = pokemonNamesAndIds.map(function(nameAndId) {
    return { value: nameAndId.id, label: nameAndId.name };
});

export default class PokemonSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemonId: ''
        };
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            pokemonId: nextProps.pokemonId
        });
    };

    render() {
        const { pokemonId } = this.state;

        return (
            <Select
                name='pokemon-select-list'
                value={pokemonId}
                options={options}
                placeholder={this.props.placeholder}
                onChange={this.handlePokemonSelected.bind(this)}
            />
        );
    };

    handlePokemonSelected(selection) {
        const { value:pokemonId } = selection;

        this.setState({
            pokemonId
        });

        this.props.onChange(pokemonId);
    };

};

PokemonSelector.propTypes = {
    placeholder: React.PropTypes.string,
    pokemonId: React.PropTypes.string
};

