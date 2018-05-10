import React, { Component } from 'react';
import './RoomsList.css';

export default class RoomsList extends Component {
    constructor(props){
        super(props);
        this.renderRooms = this.renderRooms.bind(this);
    }

    componentDidMount() {
        window.onresize = RoomsList.resizeRoomsContainer;
        RoomsList.resizeRoomsContainer();
    }


    static resizeRoomsContainer() {
        let roomsContainer = document.querySelector('.roomsContainer');

        if (roomsContainer){
            let width = roomsContainer.clientWidth;
            if (width < 934 || width >= 1404){
                roomsContainer.style.justifyContent = "center";
            } else if (width >= 934){
                roomsContainer.style.justifyContent = "space-between";
            }
        }

    }

    componentDidUpdate(){
        if (this.props.rooms.length % 2 !== 0){
            const roomsContainer = document.querySelector('.roomsContainer');

            roomsContainer.style.justifyContent = "center";
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', RoomsList.resizeRoomsContainer);
    }

    renderEquipements(equipements) {
        if (equipements.length) {
            return equipements.map((equipement, index) => {
                if (index < (equipements.length - 1)) {
                    return <span key={equipement + index}> {equipement.name},</span>
                } else {
                    return <span key={equipement + index}> {equipement.name} </span>
                }
            });
        } else {
            return "Aucun";
        }
    }

    renderRooms() {
        if (this.props.rooms.length) {
            return this.props.rooms.map((room, index) => {
                return (
                    <div key={room + index} className="roomContainer">
                        <div className={"textContainer"}>
                            <h2>{room.name}</h2>
                            <span>Capacity:{room.capacity}</span>
                            <span>Equipements: {this.renderEquipements(room.equipements)}</span>
                            <button value={index} onClick={this.props.reserveRoom}>
                                Reserver !
                            </button>
                        </div>
                        <div className={"roomImg"}/>
                    </div>
                )
            })
        } else {
            return <span id={"noRoom"}>Désolé, Aucune salle n'est disponible avec ces critères ! :-(</span>
        }
    }

    render () {
        console.log(this.props.rooms[0]);
        return (
            <div className={"roomsContainer"}>
                {this.renderRooms()}
            </div>
        )
    }
}