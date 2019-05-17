/**
 * Component based on material ui checkbox
 * Needs array of values as input
 * and CB to update state in the parent
 */
import React from 'react';


const CheckboxGroup = (props) => {
  
  return (
    <div className='group-checkbox'>
      {props.items ?
        props.items.map((item,i) => (
          <div className="group-checkbox__item" key={i}>
              <label>
                <input
                  type="checkbox" 
                  onChange={() => props.onChange(item.name)}
                  checked={props.value[item.name] || false} // in case is null so don't get warning
                />
            {item.name}
          </label>
        </div>
        ))
      :null}
    </div>
  )};


export default CheckboxGroup;
