import React, { Component } from 'react';
import './Header.css';

export default class Header extends Component{
    constructor(props){
        super(props);
    }

    redirect(){
        window.location.href = "http://localhost:3000" ;
    }

    render(){
        return (
            <div className="headerContainer">
                <button onClick={this.redirect} className="headerTitle">
                   STATION F
                </button>
            </div>
        )
    }
}