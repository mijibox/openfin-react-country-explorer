import React from 'react'
import { render, queryByAttribute } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PreferencePanel from '../components/preferencePanel'
import CountryTable from '../components/countryTable'

const getById = queryByAttribute.bind(null, 'id');

test('filter country code test', done => {
    const onPrefChange = pref => {
        expect(pref.filters.length).toBe(1);
        expect(pref.filters[0].name).toBe("alpha2Code");
        expect(pref.filters[0].filter("TW")).toBe(true);
        done();
    };
    const { getByText, getByLabelText } = render(<PreferencePanel onPreferenceChange={onPrefChange} />);
    userEvent.type(getByLabelText("Country Code"), "tw", { delay: 100 }).then(() => {
        userEvent.click(getByText("Apply"));
    });
});

test('sort population test', done => {
    const dom = render(<CountryTable preference={{}} />);
    setTimeout(() => {
        //first click will sort population ascending
        userEvent.click(getById(dom.container, "tableHeaderPopulation"));
        //second click will sort population decending
        userEvent.click(getById(dom.container, "tableHeaderPopulation"));
        let table = getById(dom.container, "countryTable");
        //table -> thead (children[0])
        //      -> tbody (children[1])        
        //          -> tr (children[0])
        //              -> td (children[0])    
        expect(table.children[1].children[0].children[0].textContent).toBe('China');
        done();
    }, 1000);
});