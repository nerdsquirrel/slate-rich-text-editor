import React, { Component } from 'react';
import InitialValue from './InitialValue';

import Icon from 'react-icons-kit';
import TextEditorView from './TextEditorView';
import AppConstants from '../../constants/AppConstants';
// import MarkHotkeys from 'slate-mark-hotkeys';
import Image from './Image';
import LocalStorageService from '../../services/LocalStorageService';
import  './TextEditor.css';
import { Value } from 'slate';

const DEFAULT_NODE = 'paragraph';

function insertImage(change, src) {    
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
        // console.log(value.toJSON().document.nodes);
		this.setState({ value });
	};

	onKeyDown = (e, change) => {
        
        if(e.shiftKey && e.key === 'Tab'){   
            let {value} = this.state;
            let {document} = value;     
            const isNumberList = value.blocks.some(block => {
                return !!document.getClosest(block.key, parent => parent.type === AppConstants.Elements.NUMBERLIST)
            }) 
            const isBulletedList = value.blocks.some(block => {
                return !!document.getClosest(block.key, parent => parent.type === AppConstants.Elements.BULLETLIST)
            })   
            if(isNumberList)
                change.setBlocks('list-item').wrapBlock(AppConstants.Elements.NUMBERLIST);   
            if(isBulletedList)
                change.setBlocks('list-item').wrapBlock(AppConstants.Elements.BULLETLIST);

        }

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
            case 's': {
                LocalStorageService.set(AppConstants.LOCALSTORAGEKEY.CONTENT, JSON.stringify(this.state.value.toJSON()));
                this.onChange(change);
				return true;
			}		
			default: {
				return;
			}
		}
	};

	renderNode = (props) => {        
        const { attributes, children, node } = props
		switch (node.type) {			
            case 'image': 
            {
                const src = node.data.get('src');
                return <Image {...attributes} src={src} />
            }
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

    // rendering of mark element
    hasMark = type => {
        const { value } = this.state
        if(type === AppConstants.Elements.SAVE || type === AppConstants.Elements.CANCEL){
            return JSON.stringify(LocalStorageService.get(AppConstants.LOCALSTORAGEKEY.CONTENT)) !== JSON.stringify(value.toJSON());
        }        
        return value.activeMarks.some(mark => mark.type == type)
    }
	onMarkClick = (e, type) => {
		e.preventDefault();
        const { value } = this.state;
        if(type === AppConstants.Elements.SAVE){
            LocalStorageService.set(AppConstants.LOCALSTORAGEKEY.CONTENT, JSON.stringify(value.toJSON()));            
        }
        if(type === AppConstants.Elements.CANCEL){
            this.setState({value: Value.fromJSON(LocalStorageService.get(AppConstants.LOCALSTORAGEKEY.CONTENT))});
            return;         
        }
		const change = value.change().toggleMark(type);
		this.onChange(change);
    };
    renderMarkElement(type, icon){
        let style = this.hasMark(type) ? 'button-bold': 'button-gray'; 
        return(
            <button
            className = {style}
            onPointerDown={(e) => this.onMarkClick(e, type)}            
            >
                <Icon icon={icon} />
            </button>
        )
    }
    // end	
    
    // rendering of block element
    hasBlock = type => {
        const { value } = this.state;        
        return value.blocks.some(node => node.type === type)      
    }
    onClickBlock = (event, type) => {
        event.preventDefault()
        if(type === AppConstants.Elements.IMAGE){
            this.openFileDialog(this.handleImage);
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
    renderBlockElement = (type, icon) => {
        let isActive = this.hasBlock(type)
    
        if (['numbered-list', 'bulleted-list'].includes(type)) {
          const { value } = this.state
          const parent = value.document.getParent(value.blocks.first().key)
          isActive = this.hasBlock('list-item') && parent && parent.type === type
        }

        let style = isActive ? 'button-bold': 'button-gray';
    
        return (
        <button
            className = {style}
            onMouseDown={event => this.onClickBlock(event, type)}
        >
            <Icon icon={icon} />
        </button>
        )
    }
    // end
    
    // image rendering
    handleImage = e => {
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
    // end
    

	render() {
		return (			
            <TextEditorView 
                state = {this.state}
                onChange={this.onChange.bind(this)}
                onKeyDown = {this.onKeyDown.bind(this)}
                //plugins = {[new MarkHotkeys()]}
                renderMark = {this.renderMark.bind(this)}
                renderNode = {this.renderNode.bind(this)}
                renderMarkElement = {this.renderMarkElement.bind(this)}
                renderBlockElement = {this.renderBlockElement.bind(this)}
            />
		);
	}
}
