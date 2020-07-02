import React, { useState, useRef, useLayoutEffect } from 'react'
import { UserPreference, FilterPreference, AppProps, Bounds } from '../app';
import style from './preferencePanel.module.scss'

interface TextFieldProps {
    name: string,
    label: string,
    value: string,
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

const TextField: React.FunctionComponent<TextFieldProps> = (props: TextFieldProps) => {
    return (
        <div className={style.textField}>
            <label htmlFor={props.name} className={style.label}>{props.label}</label>
            <input id={props.name} className={style.input} type="text" defaultValue={props.value} onChange={props.onChange} />
        </div>
    )
}

interface PreferencePanelProps extends AppProps {
    onPreferenceChange: (preference: UserPreference) => void;
    onPanelResize?: (bounds: Bounds) => void;
}

const PreferencePanel: React.FunctionComponent<PreferencePanelProps> = (props: PreferencePanelProps) => {

    const [open, setOpen] = useState(true);
    const [filterName, setFilterName] = useState("");
    const [filterCode, setFilterCode] = useState("");
    const [filterPopulationMin, setFilterPopulationMin] = useState("");
    const [filterPopulationMax, setFilterPopulationMax] = useState("");
    let myRef = useRef(null);

    useLayoutEffect(() => {
        if (myRef.current) {
            let element = myRef.current as unknown as HTMLDivElement;
            if (props.onPanelResize) {
                props!.onPanelResize(element.getBoundingClientRect());
            }
        }
    });

    function togglePanel(): void {
        setOpen(!open);
    }

    function resetFilters(): void {
        setFilterName("");
        setFilterCode("");
        setFilterPopulationMin("");
        setFilterPopulationMax("");
        let pref: UserPreference = {
            filters: []
        };
        props.onPreferenceChange(pref);
    }

    function handleChange(event: { persist: () => void; target: any; }): void {
        event.persist();
        const target = event.target;
        const name = target.id;
        const value = target.value;
        switch (name) {
            case "filterName":
                setFilterName(value);
                break;
            case "filterCode":
                setFilterCode(value);
                break;
            case "filterPopulationMin":
                setFilterPopulationMin(value);
                break;
            case "filterPopulationMax":
                setFilterPopulationMax(value);
                break;
        }
    }

    function handleSubmit(event: { preventDefault: () => void; }): void {
        let filters: FilterPreference[] = [];
        if (!!filterName) {
            filters.push({
                name: "name",
                filter: v => {
                    let countryName: string = v;
                    let reg = new RegExp(filterName, "i");
                    return countryName.search(reg) !== -1;
                }
            });
        }
        if (!!filterCode) {
            filters.push({
                name: "alpha2Code",
                filter: v => {
                    let code: string = v;
                    return code === filterCode.toUpperCase();
                }
            });
        }
        if (!!filterPopulationMin || !!filterPopulationMax) {
            filters.push({
                name: "population",
                filter: v => {
                    let population: number = v;
                    let min = filterPopulationMin ? filterPopulationMin : 0;
                    let max = filterPopulationMax ? filterPopulationMax : Number.MAX_VALUE;
                    return population >= min && population <= max;
                }
            });
        }
        let pref: UserPreference = {
            filters: filters
        };
        props.onPreferenceChange(pref);
        event.preventDefault();
    }

    return (
        <div ref={myRef} className={style.referencePanel}>
            <div className={style.filterSettings}
                onClick={e => togglePanel()} >
                <img className={style.image} src={open ? "/toggle-down.png" : "/toggle-right.png"} alt="" />Filter Settings
            </div>
            {
                open ? (
                    <div className={style.settingsContainer}>
                        <div className={style.settingsPanel}>
                            <form onSubmit={handleSubmit} >
                                <TextField name='filterName' label='Country Name' value={filterName} onChange={handleChange} />
                                <TextField name='filterCode' label='Country Code' value={filterCode} onChange={handleChange} />
                                <TextField name='filterPopulationMin' label='Minimum Population' value={filterPopulationMin} onChange={handleChange} />
                                <TextField name='filterPopulationMax' label='Maximum Population' value={filterPopulationMax} onChange={handleChange} />
                                <button type="submit" className={style.button}>Apply</button>
                                <button type="reset" className={style.button} onClick={resetFilters}>Clear</button>
                            </form>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}

export default PreferencePanel