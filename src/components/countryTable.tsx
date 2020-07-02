import React from 'react'
import { CountryData, CountryDataSource } from '../dataSource'
import { AppProps } from '../app';
import CountryTableRow from './countryTableRow';
import CountryDatailPanel from './countryDetailPanel'
import style from '../style/countryTable.module.scss'

class CountryTable extends React.Component<AppProps> {

    countryDataSource: CountryDataSource = new CountryDataSource();

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

    populateCountryDetail(countryData: CountryData) {
        this.setState({ selectedCountry: countryData });
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

    sortTableData(colName: string) {
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
                <div className={style.columnLeft}>
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
                <div id="detailContainer" className={style.columnRight}>
                    <CountryDatailPanel countryData={this.state.selectedCountry} />
                </div>
            </div>
        )
    }
}

export default CountryTable