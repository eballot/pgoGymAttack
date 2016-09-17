import React from 'react';


export default class AboutCalculator extends React.Component {
    render() {
        return (
            <div>
                This tool calculates which of your pokemon are best to pit against the pokemon defending a gym.
                <p/>
                To use this calculator, add your strongest pokemon to the Kennel. Then go to the Battle tab
                and enter the defenders. For each defender, the five best pokemon from your kennel are listed.
                The calculation is based on an estimate of how much damage your pokemon will inflict on and
                will suffer from the defender. It includes the bonuses from attack type and pokemon type.
                <p/>
                Your pokemon's attack is green if it is super effective against the defender, and red if ineffective.
            </div>
        );
    };
}
