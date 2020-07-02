import React from "react";
import { CountryData } from "../dataSource";
import style from './countryTable.module.scss';

interface CountryRowProps {
    key: string;
    countryData: CountryData;
    onCountrySelected: (countryData: CountryData) => void;
}

const CountryTableRow: React.FunctionComponent<CountryRowProps> = (props: CountryRowProps) => {
    return (
        <tr className={style.countryDataRow}
            key={props.countryData!.name}
            onClick={e => {
                props.onCountrySelected(props.countryData);
            }
            }>
            <td className={style.countryNameCell}>{props.countryData.name}</td>
            <td className={style.countryPopulationCell}>{props.countryData.population}</td>
        </tr>
    )
}

export default CountryTableRow;
