import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default class CustomRadioGroup extends Component {

    // handleChange = event => {
    //     this.setState({ value: event.target.value });
    //     console.log("Colors value:",event.target.value);
    //   };

    //renders radio buttons
    renderRadioButtons=(colors)=>(
        colors && colors.length > 0 ?
            
                <FormControl component="fieldset" className="radiogroup-container" >
                    <FormLabel component="legend">{this.props.title}</FormLabel>
                    <RadioGroup row
                        aria-label="Gender"
                        name={this.props.title}
                        className="custom-radio-group"
                        // value={this.state.value}
                        value={this.props.value}
                        onChange={this.props.onchange}
                    >
                        {colors.map((item,i)=>(
                            <FormControlLabel 
                                key={i} 
                                value={item} 
                                control={<Radio />} 
                                label={item} 
                            />
                        ))}
                    </RadioGroup>
                 </FormControl>
        :null
    )

    render() {
        return (
            <div className="radiogroup-wrapper">
                {this.renderRadioButtons(this.props.list)}
            </div>
        );
    }
}    