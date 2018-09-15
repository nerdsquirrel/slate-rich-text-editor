import React, { Component } from 'react';
import InitialValue from './InitialValue';

import Icon from 'react-icons-kit';
import TextEditorView from './TextEditorView';
import AppConstants from '../../constants/AppConstants';
// import MarkHotkeys from 'slate-mark-hotkeys';
import styled from 'react-emotion'


const DEFAULT_NODE = 'paragraph';
const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
  `
  function insertImage(change, src, target) {
    if (target) {
      change.select(target)
    }
  
    change.insertBlock({
      type: 'image',
      data: { src },
    })
  }

export default class TextEditor extends Component {
	state = {
		value: InitialValue,
    };    

	onChange = ({ value }) => {
		this.setState({ value });
	};

	onKeyDown = (e, change) => {
		if (!e.ctrlKey) return;

        e.preventDefault();
        		
		switch (e.key) {
			case 'b': {
				change.toggleMark('bold');
				return true;
			}
			case 'i': {
				change.toggleMark('italic');
				return true;
			}
			case '`': {
				change.toggleMark('code');
				return true;
			}			
			case 'u': {
				change.toggleMark('underline');
				return true;
			}
			case 'q': {
				change.toggleMark('quote');
				return true;
			}			
			default: {
				return;
			}
		}
	};

	renderNode = (props) => {        
        const { attributes, children, node, isFocused } = props
		switch (node.type) {			
            case 'image': {
                const src = node.data.get('src')
                return <Image src={src} selected={isFocused} {...attributes} />        }
            case AppConstants.Elements.HEADING1:
                return <h1 {...attributes}>{children}</h1>
            case AppConstants.Elements.HEADING2:
                return <h2 {...attributes}>{children}</h2>
            case AppConstants.Elements.QUOTE:
                return <blockquote {...attributes}>{children}</blockquote>
            case 'list-item':
                return <li {...attributes}>{children}</li>
            case AppConstants.Elements.NUMBERLIST:
                return <ol {...attributes}>{children}</ol>
            case AppConstants.Elements.BULLETLIST:
                return <ul {...attributes}>{children}</ul>

			default: {
				return;
			}
		}
	};

	renderMark = (props) => {        
		switch (props.mark.type) {
			case AppConstants.Elements.BOLD:
				return <strong>{props.children}</strong>;
			case AppConstants.Elements.ITALIC:
				return <em>{props.children}</em>;
			case AppConstants.Elements.CODE:
                return <code {...props.attributes}>{props.children}</code>;            
			case AppConstants.Elements.UNDERLINE:
				return <u {...props.attributes}>{props.children}</u>;
			default: {
				return;
			}
		}
	};	
	
	renderLinkIcon = (type, icon) => (
		<button
			onPointerDown={(e) => this.onLinkClick(e, type)}
			className="tooltip-icon-button"
		>
			<Icon icon={icon} />
		</button>
	);

	onMarkClick = (e, type) => {
		e.preventDefault();
		const { value } = this.state;
		const change = value.change().toggleMark(type);
		this.onChange(change);
	};	

    hasBlock = type => {
        const { value } = this.state
        return value.blocks.some(node => node.type === type)
    }

    renderBlockElement = (type, icon) => {
        let isActive = this.hasBlock(type)
    
        if (['numbered-list', 'bulleted-list'].includes(type)) {
          const { value } = this.state
          const parent = value.document.getParent(value.blocks.first().key)
          isActive = this.hasBlock('list-item') && parent && parent.type === type
        }
    
        return (
          <button
            active={isActive}
            onMouseDown={event => this.onClickBlock(event, type)}
          >
          <Icon icon={icon} />
          </button>
        )
    }
    
    onClickBlock = (event, type) => {
        event.preventDefault()
        if(type === AppConstants.Elements.IMAGE){
            this.openFileDialog(this.HandleImage);
            return;
        }
        const { value } = this.state
        const change = value.change()
        const { document } = value
    
        // Handle everything but list buttons.
        if (type !== 'bulleted-list' && type !== 'numbered-list') {
          const isActive = this.hasBlock(type)
          const isList = this.hasBlock('list-item')
    
          if (isList) {
            change
              .setBlocks(isActive ? DEFAULT_NODE : type)
              .unwrapBlock('bulleted-list')
              .unwrapBlock('numbered-list')
          } else {
            change.setBlocks(isActive ? DEFAULT_NODE : type)
          }
        } else {
          // Handle the extra wrapping required for list buttons.
          const isList = this.hasBlock('list-item')
          const isType = value.blocks.some(block => {
            return !!document.getClosest(block.key, parent => parent.type === type)
          })
    
          if (isList && isType) {
            change
              .setBlocks(DEFAULT_NODE)
              .unwrapBlock('bulleted-list')
              .unwrapBlock('numbered-list')
          } else if (isList) {
            change
              .unwrapBlock(
                type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
              )
              .wrapBlock(type)
          } else {
            change.setBlocks('list-item').wrapBlock(type)
          }
        }
    
        this.onChange(change)
    }

    HandleImage = e => {
        let file = e.path[0].files[0];
        var reader  = new FileReader();
        reader.addEventListener("load", function () {   
            const change = this.state.value.change().call(insertImage, reader.result);    
            this.onChange(change)
        }.bind(this), false);
        if (file) {
            reader.readAsDataURL(file);
        }
        
    }

    openFileDialog (callback) {  
        var inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.accept = "image/*";
        inputElement.addEventListener("change", callback, false);
        inputElement.dispatchEvent(new MouseEvent("click")); 
    }
    

	render() {
		return (			
            <TextEditorView 
                {...this.state}
                onChange={this.onChange.bind(this)}
                onKeyDown = {this.onKeyDown.bind(this)}
                //plugins = {[new MarkHotkeys()]}
                renderMark = {this.renderMark.bind(this)}
                renderNode = {this.renderNode.bind(this)}
                onMarkClick = {this.onMarkClick.bind(this)}
                renderLinkIcon = {this.renderLinkIcon}
                renderBlockElement = {this.renderBlockElement.bind(this)}
            />
		);
	}
}
