import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';//arrows
import faAngleUp from '@fortawesome/fontawesome-free-solid/faAngleUp';

//import from material ui stuff
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class CollapseRadio extends Component {

    state = {
        open: false,
        value:'0'
    }

    //set state from props
    componentDidMount(){
        if(this.props.initState){
            this.setState({
                open: this.props.initState
            })
        }
    }

    //change open state
    handleClick = () => {
        this.setState({open: !this.state.open})
    }

    //change the arrow direction
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

    //renders the radio buttons
    renderList = () => (
        this.props.list ? //Loops through list of fixed prices that are passed in
            this.props.list.map( value =>(
                <FormControlLabel
                    key={value._id}
                    value={`${value._id}`}
                    control={<Radio/>} //which type of control to be rendered
                    label={value.name}
                />
            ))
        :null
    )


    //sets active radio button
    handleChange = event => {
        this.props.handleFilters(event.target.value) //update filter array in the parent component
        this.setState({value: event.target.value}) //update state of this component with the radio button id
    }


    render() {
        return (
            <div>
                 <List style={{borderBottom: '1px solid #dbdbdb'}}>
                    <ListItem onClick={this.handleClick} style={{padding:'10px 23px 10px 0'}}>
                        <ListItemText
                            primary={this.props.title} //renders title
                            className="collapse_title"
                        />
                        {this.handleAngle()}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>

                            <RadioGroup //renders radio buttons
                                aria-label="prices"
                                name="prices"
                                value={this.state.value} //must be string
                                onChange={this.handleChange}
                            >
                                { this.renderList() }
                            </RadioGroup>

                        </List>
                    </Collapse>
                </List>
            </div>
        );
    }
}

export default CollapseRadio;