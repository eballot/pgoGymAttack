import React from 'react';
import { render } from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import GymAttackForm from './gymAttack';
import PokemonKennel from './pokemonKennel'
import myPokemon from '../data/myPokemonKennel';


export default class MainTabs extends React.Component {
    render() {
        //TODO: sele
        const kennelCount = myPokemon.getCount();
        var selectedTab;
        if (kennelCount === 0) {
            selectedTab = 2; // Show the about tab
        } else if (kennelCount < 4) {
            selectedTab = 1; // Need to enter more pokemon
        } else {
            selectedTab = 0; // Battle!
        }

        return (
            <div key='main-container'>
                <Tabs selectedIndex={selectedTab}>
                    <TabList>
                        <Tab>Battle</Tab>
                        <Tab>Kennel</Tab>
                        <Tab>About</Tab>
                    </TabList>

                    <TabPanel>
                        <GymAttackForm />
                    </TabPanel>

                    <TabPanel>
                        <PokemonKennel />
                    </TabPanel>

                    <TabPanel>
                        <h2>About</h2>
                    </TabPanel>
                </Tabs>
            </div>
        );
    };
};
