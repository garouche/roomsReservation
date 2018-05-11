import React, { Component } from 'react';
import './Header.css';

export default class Header extends Component{
    redirect(){
        window.location.href = "http://localhost:3000" ;
    }

    render(){
        return (
            <div className="headerContainer">
                <button onClick={this.redirect} className="headerTitle">
                   STATION  ?
                </button>
            </div>
        )
    }
}