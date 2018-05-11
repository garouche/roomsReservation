import React, {Component} from 'react';
import RoomsList from './Rooms/RoomsList';
import Filter from './Filter/Filter';
import './MainContainer.css';
const req = new XMLHttpRequest();

export default class MainContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            rooms: [],
            reservation: null
        };
        this.getRoomsList = this.getRoomsList.bind(this);
        this.reserveRoom = this.reserveRoom.bind(this);
    }

    reserveRoom(e) {
        const {value} = e.target;

        if (value && this.state.rooms[value]){
            const {date, startTime, endTime} = this.state.reservation;

            req.onloadend = (e) => {
                if (e.target.status === 201) {
                    MainContainer.validReservation();
                    this.getRoomsList(this.state.reservation);
                }
            };
            req.open("POST", `http://localhost:3001/reservations/rooms`);
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(Object.assign(this.state.rooms[value], {queryStartTime: `${date}T${startTime}`, queryEndTime: `${date}T${endTime}`})));
        }
    }

    static validReservation() {
        const validReservation = document.querySelector('.validReservation');

        validReservation.style.visibility = "visible";
        setTimeout(() => validReservation.style.visibility = "hidden", 1500);
    }

    static renderEquipementsQuery(equipements){
        return equipements.reduce((query, equipement) => {
            return `${query}&equipements=${equipement}`;
        }, "");
    }

    static renderScheduleQuery(date, startTime, endTime){
        if (date && startTime && endTime){
            return `&queryStartTime=${`${date}T${startTime}`}&queryEndTime=${`${date}T${endTime}`}`;
        } else {
            return "";
        }
    }

    getRoomsList({capacity = 0, selectedEquipements = [], date = null, startTime = null, endTime = null}){
        if (req.status !== 0){
            req.abort();
        }

        req.open("GET", `http://localhost:3001/reservations/rooms?capacity=${capacity}${MainContainer.renderEquipementsQuery(selectedEquipements)+MainContainer.renderScheduleQuery(date, startTime, endTime)}`);
        req.onloadend = (e) => {
            if (typeof e.target.response === 'string' && e.target.status === 200) {
                this.setState({rooms: JSON.parse(e.target.response), reservation: {date: date, startTime: startTime, endTime: endTime, capacity: capacity, selectedEquipements: selectedEquipements}});
            }
            req.onloadend = null;
        };
        req.send(null);
    }

    render (){

        return (
            <div className={"mainContainer"}>
                <h1><b>Filtres</b></h1>
                <Filter getRoomsList={this.getRoomsList} />
                <h1>Salles Disponibles</h1>
                <RoomsList rooms={this.state.rooms} reserveRoom={this.reserveRoom}/>
            </div>
        )
    }
}