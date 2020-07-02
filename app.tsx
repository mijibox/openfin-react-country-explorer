import React, { Component } from 'react';
import PreferencePanel from './components/preferencePanel'
import CountryTable from './components/countryTable'
import style from './style/app.module.css'

export interface FilterPreference {
	name: string;
	filter: (value: any) => boolean;
}

export interface UserPreference {
	filters?: FilterPreference[];
}

export interface AppProps {
	preference: UserPreference;
}

export interface Bounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

class App extends Component {

	state = {
		preference: {},
		tableTop: 0,
	}

	updatePreference(pref: UserPreference): void {
		this.setState({ preference: pref });
	}

	updatePanelPosition(bounds: Bounds): void {
		let top = bounds.y + bounds.height;
		if (this.state.tableTop !== top) {
			this.setState({ tableTop: top });
		}
	}

	render() {
		return (
			<div className={style.appBody}>
				<div className={style.title}>Country Explorer</div>
				<PreferencePanel preference={this.state.preference} onPanelResize={b => {
					this.updatePanelPosition(b);
				}} onPreferenceChange={pref => {
					this.updatePreference(pref);
				}} />
				<div style={{ position: 'absolute', top: this.state.tableTop, bottom: 0, width: "900px", padding: 0, margin: 0 }}>
					<CountryTable preference={this.state.preference} />
				</div>
			</div>
		)
	}
}

export default App;
