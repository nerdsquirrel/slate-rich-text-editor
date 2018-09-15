import React, { Component, Fragment } from 'react';
import { Editor } from 'slate-react';

import { bold, italic, code, underline } from 'react-icons-kit/feather/';
import { ic_looks_one, ic_looks_two, ic_format_quote, ic_insert_photo, 
    ic_format_list_bulleted, ic_format_list_numbered } from 'react-icons-kit/md/';
import MarkElement from './MarkElement';
import AppConstants from '../../constants/AppConstants';

export default class TextEditorView extends Component{
    render(){
        return (
            <Fragment>
                <div className='format-toolbar'>  
                    <MarkElement type={AppConstants.Elements.BOLD} icon = {bold} onClick={this.props.onMarkClick}></MarkElement>  
                    <MarkElement type={AppConstants.Elements.ITALIC} icon = {italic} onClick={this.props.onMarkClick}></MarkElement>
                    <MarkElement type={AppConstants.Elements.UNDERLINE} icon = {underline} onClick={this.props.onMarkClick}></MarkElement>
                    <MarkElement type={AppConstants.Elements.CODE} icon = {code} onClick={this.props.onMarkClick}></MarkElement>   


                    {this.props.renderBlockElement(AppConstants.Elements.QUOTE, ic_format_quote)}
                    {this.props.renderBlockElement(AppConstants.Elements.HEADING1, ic_looks_one)}                    
                    {this.props.renderBlockElement(AppConstants.Elements.HEADING2, ic_looks_two)} 
					{this.props.renderBlockElement(AppConstants.Elements.BULLETLIST, ic_format_list_bulleted)}
					{this.props.renderBlockElement(AppConstants.Elements.NUMBERLIST, ic_format_list_numbered)}					
                    {this.props.renderBlockElement(AppConstants.Elements.IMAGE, ic_insert_photo)}                    
                </div>
				<Editor
					value={this.props.value}
					onChange={this.props.onChange}
					onKeyDown={this.props.onKeyDown}
					renderMark={this.props.renderMark}
					renderNode={this.props.renderNode}
				/>
			</Fragment>
        );
    }

}