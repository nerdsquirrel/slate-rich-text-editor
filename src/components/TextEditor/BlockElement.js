import Icon from 'react-icons-kit';
import React, { Component } from 'react';

export default class BlockElement extends Component{
    render(){        
        let isActive = this.state.value.blocks.some(node => node.type == this.props.type);

        if (['numbered-list', 'bulleted-list'].includes(this.props.type)) {
          const { value } = this.state
          const parent = value.document.getParent(value.blocks.first().key)
          isActive = this.state.value.blocks.some(node => node.type == 'list-item') && parent && parent.type === this.props.type
        }
    
        return (
          <button
            active={isActive}
            onMouseDown={event => this.props.onClick(event, this.props.type)}
          >
          <Icon icon={this.props.icon} />
          </button>
        )
    }
}