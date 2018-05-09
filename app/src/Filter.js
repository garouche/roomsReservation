import React, {Component} from 'react';
import moment from 'moment';
import './Filter.css';

const getRemainder = () => {
        const minutes = moment().minute();

        return minutes <= 30 ? 30 - minutes : 60 - minutes;
};

export default class Filter extends Component {
    constructor(props){
        super(props);
        this.state = {
            capacity: 1,
            equipements: ['TV', 'Retro Projecteur'],
            selectedEquipements: [],
            date: moment().format('YYYY-MM-DD'),
            startTime: moment().add(getRemainder(), "minutes").format('HH:mm').split(':').join('h'),
            endTime: moment().add(getRemainder(), "minutes").format('HH:mm').split(':').join('h'),
        };
        this.handleChange = this.handleChange.bind(this);
        this.addEquipement = this.addEquipement.bind(this);
        this.removeEquipement = this.removeEquipement.bind(this);
        this.renderEquipements = this.renderEquipements.bind(this);
    }


    addEquipement(equipement) {
        let index = this.state.selectedEquipements.indexOf(equipement);

        if (index === -1){
            let newSelectedEquipements = [...this.state.selectedEquipements, equipement];

            console.log(this.props);
            this.setState({selectedEquipements: newSelectedEquipements}, () => this.props.getRoomsList(this.state));
        }
    }

    removeEquipement(equipement) {
        let index = this.state.selectedEquipements.indexOf(equipement);

        if (index !== -1){
            let newSelectedEquipements = [...this.state.selectedEquipements];

            newSelectedEquipements.splice(index, 1);
            this.setState({selectedEquipements: newSelectedEquipements}, () => this.props.getRoomsList(this.state));
        }
    }

    renderEquipements() {
        return this.state.equipements.map((equipement, index) => {
            return (
                <div key={equipement+index} id={equipement}>
                    <label htmlFor={`check${equipement}`}>{equipement}</label>
                    <input id={`check${equipement}`} type={"checkbox"} name={equipement} value={equipement} onChange={this.handleChange}/>
                </div>
            )
        })
    }

    handleChange(e) {
        const {type, name, checked, value, min} = e.target;

        if (type === 'checkbox' && ['TV', 'Retro Projecteur'].indexOf(name) !== -1){
            checked ? this.addEquipement(name) : this.removeEquipement(name);
        } else if (type === 'range' && name === 'capacity' && value >= 0 && value <= 26){
            this.setState({capacity: value}, () => this.props.getRoomsList(this.state));
        } else if (type === 'date' && value >= moment().format('YYYY-MM-DD')){
            const resetTime = this.state.date !== value ? {startTime: "00h00", endTime: "00h30"} : {};

            this.setState(Object.assign({date: value}, resetTime));
        } else if (type === 'select-one'){
            this.setState({[name]: value});
        }
    }

    static getAllAvalaibleTimes(startHour, startMinute, array){
        if (startHour <= 24){
            array.push(<option key={startHour+startMinute}>{(startHour === 24 ? "00" : startHour) + 'h' + (startMinute ? startMinute : "00")}</option>);
            if (!startMinute && startHour !== 24) {
                return Filter.getAllAvalaibleTimes(startHour, startMinute + 30, array);
            } else if (startHour !== 24){
                return Filter.getAllAvalaibleTimes(startHour + 1, 0, array);
            }
        }
        return array;
    }


    getStartTime(name) {
        const todayDate = moment().format('YYYY-MM-DD');
        const today = this.state.date === todayDate;
        const date = today ? moment() : moment(this.state.date);

        if (name === "endTime"){
            const startTime = this.state.startTime ? this.state.startTime.split('h') : date.add(getRemainder(), "minutes").format('HH:mm').split(':');

            return date.hour(startTime[0]).minute(startTime[1]).add(30, "minutes").format('HH:mm').split(':');
        } else {
            const remainder = today ? getRemainder() : 0;

            return date.add(remainder, "minutes").format('HH:mm').split(':');
        }
    }

    renderTime(name) {
        const timeNow = this.getStartTime(name);
        const options = (name === "endTime" && timeNow.join(':') === "00:00" ? <option>00h00</option> : Filter.getAllAvalaibleTimes(parseInt(timeNow[0], 10), parseInt(timeNow[1], 10), []));

        if (name === "startTime"){
            options.pop();
        }

        return (
            <select name={name} className={name} value={this.state[name] || "-"} onChange={this.handleChange}>
                 {options}
             </select>
        );
    }

    render () {
        return (
            <div className={"filterContainer"}>
                <div className={"optionsContainer"}>
                    <span className={"equipementInfo"}>Equipements</span>
                    {this.renderEquipements()}
                </div>
                <div className={"optionsContainer"}>
                    <label htmlFor={"rangeCapacity"}> Capacité d'accueil</label>
                    {this.state.capacity}
                    <div className={"rangeContainer"}>
                        1 <input defaultValue={1} id="rangeCapacity" type={"range"} name={"capacity"} min={"1"} max={"26"} onChange={this.handleChange}/> 26
                    </div>
                </div>
                <div className={"optionsContainer"}>
                    <label> Date de réservation</label>
                    <div className={"dateContainer"}>
                        <span>Le</span>
                        <input type={"date"} name="startDate" min={moment().format('YYYY-MM-DD')} required onChange={this.handleChange}/>
                        <span>de</span>
                        {this.renderTime("startTime")}
                        <span>à</span>
                        {this.renderTime("endTime")}

                    </div>
                </div>
            </div>
        )
    }
}