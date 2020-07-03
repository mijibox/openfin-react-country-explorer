import React, { useState, useEffect } from 'react'
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

    useEffect(()=>{
        let topic = 'selectedCountry';
        let iabListener = (msg: CountryData) => {
            setCountryData(msg);
        }
        let identity = { uuid: '*' };
        fin.InterApplicationBus.subscribe(identity, topic, iabListener).then(()=>{
            console.debug('subscribed to IAB topic: ' + topic);
        });
        return function cleanup() {
            fin.InterApplicationBus.unsubscribe(identity, topic, iabListener).then(()=>{
                console.debug('unsubscribed to IAB topic: ' + topic);
            });
        }
    }, ['dummy']);

    return <div className={style.countryDetailWindow}>
        <WindowTitleBar />
        <div className={style.windowContent}>
            <CountryDatailPanel countryData={countryData} />
        </div>
    </div>
}

export default CountryDatailWindow