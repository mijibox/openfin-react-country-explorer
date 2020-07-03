import React from 'react'
import { CountryData, CountryDataSource } from '../dataSource'
import { AppProps } from '../app';
import CountryTableRow from './countryTableRow';
import CountryDatailPanel from './countryDetailPanel'
import style from '../style/countryTable.module.scss'
import { WindowOption } from 'openfin/_v2/api/window/windowOption';
import { _Window } from 'openfin/_v2/api/window/window';

class CountryTable extends React.Component<AppProps> {

    countryDataSource: CountryDataSource = new CountryDataSource();
    readonly detailWindowName = 'winCountryDetail';
    readonly detailWindowWidth = 400;
    readonly detailWindowHeight = 450;
    currentWindow?: fin._Window;
    detailWindow?: fin._Window;


    state = {
        selectedCountry: undefined,
        countries: [],
        sortBy: "",
        sortAscending: false
    }

    componentDidMount() {
        this.countryDataSource.getCountries().then(countries => {
            countries = this.sortCountries(countries, "name", true);
            this.setState({
                countries: countries,
                sortBy: "name",
                sortAscending: true
            });
        });

        //if the window is reloaded, hidden detail window will hang around, find it and close it if it's there.
        if (typeof fin !== 'undefined') {
            if (!this.currentWindow) {
                this.currentWindow = fin.Window.getCurrentSync();
                fin.Window.wrap({ uuid: this.currentWindow.identity.uuid, name: this.detailWindowName }).then(w => {
                   return w.close(true);
                }).catch(err => {
                    //OK not there.
                });
            }
        }
    }

    componentDidUpdate(prevProps: AppProps) {
        if (prevProps.preference !== this.props.preference) {
            if (this.props.preference.filters) {
                this.countryDataSource.getFilteredCountries(this.props.preference.filters).then(countries => {
                    if (!!this.state.sortBy) {
                        countries = this.sortCountries(countries, this.state.sortBy, this.state.sortAscending);
                    }
                    this.setState({
                        countries: countries
                    });
                });
            }
        }
    }

    showDetailWindow() {
        fin.System.getMousePosition().then(p => {
            let mouseTop = p.top;
            this.currentWindow?.getBounds().then(mainWinBounds => {
                let posLeft = mainWinBounds.left + mainWinBounds.width;
                this.detailWindow?.getBounds().then(detailWinBounds => {
                    // console.debug("detailWindow.bounds", detailWinBounds);
                    let posTop = Math.min(mouseTop, mainWinBounds.top + mainWinBounds.height - this.detailWindowHeight);
                    //openfin bug, the window becomes bigger and bigger when running in scaled display
                    //workaround is to set the bounds back to default size
                    this.detailWindow?.setBounds({ top: posTop, left: posLeft, width: this.detailWindowWidth, height: this.detailWindowHeight }).then(() => {
                        return this.detailWindow?.show();
                    }).then(() => {
                        this.detailWindow!.bringToFront();
                    });
                });
            });
        });
    }

    populateCountryDetail(countryData: CountryData): void {
        if (this.detailWindow) {
            fin.InterApplicationBus.publish('selectedCountry', countryData);
            this.showDetailWindow();
        }
        else {
            let winOpts: WindowOption = {
                name: this.detailWindowName,
                url: "/detail",
                resizable: false,
                frame: false,
                defaultWidth: this.detailWindowWidth,
                defaultHeight: this.detailWindowHeight,
                defaultCentered: true,
                saveWindowState: false,
                autoShow: false
            };
            fin.Window.create(winOpts).then((w: _Window) => {
                fin.InterApplicationBus.publish('selectedCountry', countryData);
                this.detailWindow = w;
                this.showDetailWindow();
            });
        }
    }

    sortCountries(countries: CountryData[], sortBy: string, ascending: boolean): CountryData[] {
        return countries.sort((c1, c2) => {
            if (sortBy === "name") {
                let rv = c1.name.localeCompare(c2.name, 'en', { sensitivity: 'base' });
                if (!ascending) {
                    rv = -rv;
                }
                return rv;
            }
            else {
                //population
                let population1: number = c1.population;
                let population2: number = c2.population;
                let rv = population1 === population2 ? 0 : population1 < population2 ? -1 : 1;
                if (!ascending) {
                    rv = -rv;
                }
                return rv;
            }
        });
    }

    sortTableData(colName: string): void {
        if (colName === this.state.sortBy) {
            //flip direction
            let countries = this.state.countries.reverse();
            let sortAscending = !this.state.sortAscending;
            this.setState({
                countries: countries,
                sortAscending: sortAscending
            });
        }
        else if (colName !== this.state.sortBy) {
            //sort by colName, ascending
            let countries = this.sortCountries(this.state.countries, colName, true);
            this.setState({
                countries: countries,
                sortBy: colName,
                sortAscending: true,
            });
        }
    }

    render() {
        return (
            <div className={style.countryTablePanel}>
                <div className={style.container}>
                    <div className={style.countryTableContainer}>
                        <table id="countryTable">
                            <thead>
                                <tr >
                                    <th>Name__
                                    <div id="tableHeaderName"
                                            onClick={e => {
                                                this.sortTableData("name");
                                            }}>Name{
                                                this.state.sortBy === "name" ?
                                                    (this.state.sortAscending ? <img src="/sort-ascending.png" className={style.image} alt="" /> : <img src="/sort-descending.png" className={style.image} alt="" />)
                                                    : <img src="/blank.png" className={style.image} alt="" />
                                            }</div>
                                    </th>
                                    <th>Population__
                                    <div id="tableHeaderPopulation"
                                            onClick={e => {
                                                this.sortTableData("population");
                                            }}>Population{
                                                this.state.sortBy === "population" ?
                                                    (this.state.sortAscending ? <img src="/sort-ascending.png" className={style.image} alt="" /> : <img src="/sort-descending.png" className={style.image} alt="" />)
                                                    : <img src="/blank.png" className={style.image} alt="" />
                                            }</div>
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.countries.map((countryData: CountryData) => {
                                        return <CountryTableRow key={countryData.name} countryData={countryData} onCountrySelected={c => {
                                            this.populateCountryDetail(c);
                                        }} />;
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default CountryTable