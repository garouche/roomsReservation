import React, {Component} from 'react';
import RoomsList from './RoomsList';
import Filter from './Filter';
import './MainContainer.css';
const req = new XMLHttpRequest();

export default class MainContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            rooms: []
        };
        this.getRoomsList = this.getRoomsList.bind(this);
    }

    componentDidMount(){
        this.getRoomsList({});
    }

    static renderEquipementsQuery(equipements){
        return equipements.reduce((query, equipement) => {
            return `${query}&equipements=${equipement}`;
        }, "");
    }

    getRoomsList({capacity = 0, selectedEquipements = [], date = null, startTime = null, endTime = null}){
        if (req.status !== 0){
            req.abort();
        }

        req.open("GET", `http://localhost:3001/rooms?capacity=${capacity}${MainContainer.renderEquipementsQuery(selectedEquipements)}`);
        req.onloadend = (e) => {
            if (typeof e.target.response === 'string') {
                this.setState({rooms: JSON.parse(e.target.response)});
            }
        };
        req.send(null);
    }

    render (){
        console.log(this.state.rooms);
        return (
            <div className={"mainContainer"}>
                <h1><b>Filtres</b></h1>
                <Filter getRoomsList={this.getRoomsList}/>
                <h1>Salles Disponibles</h1>
                <RoomsList rooms={this.state.rooms} />
            </div>
        )
    }
}