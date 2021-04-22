import React, {Component} from 'react';
import classNames from './ContextMenu.module.css';
import { connect } from 'react-redux';
import actionTypes from '../../store/actions/actionTypes';

class ContextMenu extends Component {


    CONTEXT_MENU_WIDTH = 150;        
    contextRef = React.createRef();

    state = {
      top: 0,
      left: 0,
      menuItems: []
    }

    componentDidMount() {
      document.addEventListener('mousedown', this.closeContextMenu); 
      this.updatePosition(this.props.contextMenu.x, this.props.contextMenu.y, this.props.contextMenu.items)     
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.closeContextMenu);
    }

    getNewTop(top) {
      const menuHight = 35 * this.props.contextMenu.items.length;
      if (top +  menuHight / 2 > document.body.offsetHeight) {        
        return top - menuHight;
      }
      return top;
    }
    
   updatePosition( left ,top, menuItems) {     
     this.setState({
       top: this.getNewTop(top) ,
       left : ( left + this.CONTEXT_MENU_WIDTH )  > document.body.offsetWidth ? document.body.offsetWidth - 20 : left ,       
       menuItems
     })
   }

   
   closeContextMenu = (e) => {
     if (this.contextRef && this.contextRef.current && !this.contextRef.current.contains(e.target)) {
        this.props.closeContextMenu();
     }
   }


   onItemClick = (menuItem) => {     
      menuItem.func(menuItem.task);
      this.props.closeContextMenu();
   }

    render() {
      const closeClass = ((this.state.menuItems != null) && (this.state.menuItems.length > 0))  ?  '' : classNames.Close;
      const side = this.props.contextMenu.options && this.props.contextMenu.options.side ? classNames[this.props.contextMenu.options.side] : '';
      let menuItems = "";

      if (this.state.menuItems && this.state.menuItems.length > 0) {

        menuItems = 
           this.state.menuItems.map((menuItem,index) => 
                                    <li key={index}
                                        title={menuItem.title}
                                        className={classNames.menuItem} 
                                        onClick={() => this.onItemClick(menuItem)}
                                    >
                                        <span className={`${classNames.ContextMenuIcon} ${classNames[menuItem.iconCss]}`}></span>
                                        <div>{menuItem.name}</div>
                                    </li>
                         );
      }

      return(
        <div style={{top: this.state.top , left: this.state.left}} className={`${classNames.contextMenu} ${closeClass}`} ref={this.contextRef}>
          <ul  className={`${classNames.contextMenuUL} ${closeClass} ${side}`}>
            {menuItems}
          </ul>
        </div>
      )
    }
}

const mapStateToProps = state => {
  return {
    
  }
};

const mapDispachToProps = dispatch => {
  return {
    closeContextMenu: () => dispatch({ type: actionTypes.CLOSE_CONTEXT_MENU}),
  }
}

export default connect(
  mapStateToProps,
  mapDispachToProps
)(ContextMenu)

   