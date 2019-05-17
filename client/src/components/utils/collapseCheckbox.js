import React, { Component } from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';//arrows
import faAngleUp from '@fortawesome/fontawesome-free-solid/faAngleUp';

//import from material ui stuff
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';


class CollapseCheckbox extends Component {

    state = {
        open: false,
        checked: [] //which boxes are checked
    }


    componentDidMount(){
        if(this.props.initState){ //is it open?
            this.setState({
                open: this.props.initState //update state of this component
            })
        }
    }

    //handles List's state
    handleClick = () => {
        this.setState({open: !this.state.open})
    }

    //changes the icon facing down/up
    handleAngle = () => (
        this.state.open ?
            <FontAwesomeIcon
                icon={faAngleUp}
                className="icon"
            />
        : 
            <FontAwesomeIcon
                icon={faAngleDown}
                className="icon"
            />
    )

    //renders checkboxes
    renderList = () => (
        this.props.list ?
            this.props.list.map((value)=>( //Loop through list
                <ListItem key={value._id} style={{padding:'10px 0'}}>
                    <ListItemText primary={value.name}/>
                    <ListItemSecondaryAction>
                        <Checkbox
                            color="primary"
                            onChange={this.handleToggle(value._id)} //update state for the change
                            checked={this.state.checked.indexOf(value._id) !== -1}//change checkbox's state
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            ))
        :null
    )


    //Updates checked array in the state
    handleToggle = value => () => {
        const { checked } = this.state; //based on Checkbox's documentation
        const currentIndex = checked.indexOf(value); //search array Checked and get the index of the item we are searching for. -1 if not found
        const newChecked = [...checked]; //pass state to new parameter to don't mutate it

        if(currentIndex === -1){//if there was no such value in the array
            newChecked.push(value) //add it to the array
        } else{
            newChecked.splice(currentIndex,1)//there was such item in the array, so remove it.1 is the number of items to remove. 1 in this case
        }

        this.setState({
            checked: newChecked //update state in any case
        },()=>{
            this.props.handleFilters(newChecked)//use it here as CB after the setstate. run function in parent by passing the new state
        })

    }

    render() {
        return (
            <div className="collapse_items_wrapper">
                <List style={{borderBottom: '1px solid #dbdbdb'}}>
                    <ListItem onClick={this.handleClick} style={{padding:'10px 23px 10px 0'}}> {/**This is the title and the arrow */}
                        <ListItemText
                            primary={this.props.title}
                            className="collapse_title"
                        />
                        {this.handleAngle()}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit> {/**Here are rendered checkboxes */}
                        <List component="div" disablePadding>
                            {this.renderList()}
                        </List>
                    </Collapse>
                </List>
            </div>
        );
    }
}

export default CollapseCheckbox;