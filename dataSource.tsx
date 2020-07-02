import { FilterPreference } from "./app";

export type Currency = {
    code: string;
    name: string;
    symbol: string;
}

export type Language = {
    name: string;
}

export type CountryData = {
    capital: string;
    alpha2Code: string;
    currencies: Currency[];
    name: string;
    population: number;
    flag: string;
    languages: Language[];
}

export class CountryDataSource {
    private countries: CountryData[] = [];

    getCountries(): Promise<CountryData[]> {
        return new Promise((resolve, reject) => {
            if (this.countries.length > 0) {
                resolve(this.countries);
            }
            else {
                fetch('https://restcountries.eu/rest/v2/all')
                    .then(res => res.json())
                    .then(data => {
                        let countriesData = data.map((rawCountry: any) => {
                            let countryData: CountryData = Object.assign({}, rawCountry);
                            return countryData;
                        });
                        resolve(countriesData);
                    })
                    .catch(err => {
                        console.error(err);
                    })
            }
        });
    };

    getFilteredCountries(filters: FilterPreference[]): Promise<CountryData[]> {
        return this.getCountries().then(countries => {
            return countries.filter(country => {
                let passAllFilters = true;
                filters.forEach(filter => {
                    let value;
                    switch (filter.name) {
                        case "name":
                            value = country.name;
                            break;
                        case "alpha2Code":
                            value = country.alpha2Code;
                            break;
                        case "population":
                            value = country.population;
                            break;
                        default:
                            value = undefined;
                    }
                    passAllFilters = passAllFilters && filter.filter(value);
                });
                return passAllFilters;
            })
        });
    }
}

