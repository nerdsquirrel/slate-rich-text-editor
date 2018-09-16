import React, { Component, Fragment } from 'react';
import { Editor } from 'slate-react';

import { bold, italic, code, underline } from 'react-icons-kit/feather/';
import { ic_looks_one, ic_looks_two, ic_format_quote, ic_insert_photo, 
    ic_format_list_bulleted, ic_format_list_numbered, ic_save, ic_cancel } from 'react-icons-kit/md/';
import AppConstants from '../../constants/AppConstants';

export default class TextEditorView extends Component{
    render(){
        return (
            <Fragment>
                <div className='format-toolbar'>  
                    {this.props.renderMarkElement(AppConstants.Elements.BOLD,bold)} 
                    {this.props.renderMarkElement(AppConstants.Elements.ITALIC,italic)}
                    {this.props.renderMarkElement(AppConstants.Elements.UNDERLINE,underline)}
                    {this.props.renderMarkElement(AppConstants.Elements.CODE,code)}

                    {this.props.renderBlockElement(AppConstants.Elements.QUOTE, ic_format_quote)}
                    {this.props.renderBlockElement(AppConstants.Elements.HEADING1, ic_looks_one)}                    
                    {this.props.renderBlockElement(AppConstants.Elements.HEADING2, ic_looks_two)} 
					{this.props.renderBlockElement(AppConstants.Elements.BULLETLIST, ic_format_list_bulleted)}
					{this.props.renderBlockElement(AppConstants.Elements.NUMBERLIST, ic_format_list_numbered)}					
                    {this.props.renderBlockElement(AppConstants.Elements.IMAGE, ic_insert_photo)}       

                    
                    {this.props.renderMarkElement(AppConstants.Elements.SAVE,ic_save)}
                    {this.props.renderMarkElement(AppConstants.Elements.CANCEL,ic_cancel)}             
                </div>
				<Editor
					value={this.props.state.value}
					onChange={this.props.onChange}
					onKeyDown={this.props.onKeyDown}
					renderMark={this.props.renderMark}
					renderNode={this.props.renderNode}
				/>
			</Fragment>
        );
    }

}