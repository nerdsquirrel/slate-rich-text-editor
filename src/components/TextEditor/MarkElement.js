import Icon from 'react-icons-kit';
import React, { Component } from 'react';

export default class MarkElement extends Component{
    render(){
        return (
        <button
            onPointerDown={(e) => this.props.onClick(e, this.props.type)}
            className="tooltip-icon-button"
		>
		<Icon icon={this.props.icon} />
		</button>
        );
    }
}