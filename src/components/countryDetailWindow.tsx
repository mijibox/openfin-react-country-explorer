import React, { useState } from 'react'
import { CountryData } from '../dataSource';
import style from '../style/countryDetailWindow.module.scss'
import CountryDatailPanel from './countryDetailPanel';

const WindowTitleBar: React.FunctionComponent = (props) => {
    return (
        <div className={style.windowTitleBar}>
            <span>Country Detail</span>
            <div className={style.windowIcons}>
                <img src="/close.png" alt="X" className={style.windowIcon} onClick={e => {
                    fin.Window.getCurrent().then(win=>{
                        win.hide();
                    });
                }}/>
            </div>
        </div>
    )
}

const CountryDatailWindow: React.FunctionComponent = (props) => {

    const [countryData, setCountryData] = useState<CountryData | undefined>(undefined);

    fin.InterApplicationBus.subscribe({ uuid: '*' }, 'selectedCountry', (msg: CountryData) => {
        setCountryData(msg);
    });

    return <div className={style.countryDetailWindow}>
        <WindowTitleBar />
        <div className={style.windowContent}>
            <CountryDatailPanel countryData={countryData} />
        </div>
    </div>
}

export default CountryDatailWindow