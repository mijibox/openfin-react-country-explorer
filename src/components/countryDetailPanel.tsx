import React from 'react'
import { CountryData } from '../dataSource';
import style from './countryDetailPanel.module.scss'

export interface CountryDataProp {
    countryData?: CountryData;
}

const CountryDatailPanel: React.FunctionComponent<CountryDataProp> = (props: CountryDataProp) => {
    if (props.countryData) {
        return (
            <div className={style.countryDetailPanel}>
                <div className={style.countryName}>
                    {props.countryData.name}
                </div>
                <dl>
                    <dt className={style.dt}>Capital City</dt>
                    <dd>{props.countryData.capital ? props.countryData.capital : "N/A"}</dd>
                    <dt className={style.dt}>Population</dt>
                    <dd>{props.countryData.population}</dd>
                    <dt className={style.dt}>
                        {props.countryData.languages.length > 1 ? "Languages" : "Language"}
                    </dt>
                    {props.countryData.languages.map(l => {
                        return <dd key={l.name}>{l.name}</dd>
                    })}
                    <dt className={style.dt}>
                        {props.countryData.currencies.length > 1 ? "Currencies" : "Currency"}
                    </dt>
                    {props.countryData.currencies.map(c => {
                        return <dd key={c.name}>{c.name}</dd>
                    })}
                </dl>
            </div>
        )
    }
    else {
        return (
            <div className={style.countryDetailPanel}>
                Select a contry from the table to see the detail here.
            </div>
        )
    }
}

export default CountryDatailPanel