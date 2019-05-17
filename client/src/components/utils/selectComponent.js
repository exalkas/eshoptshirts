// Custom select component to render selects

import React from 'react';

export default function SelectComponent(props) {
    return (
        <form className= {props.classname ? props.classname : "form-select" }>
            { props.list && props.list.length > 0 ?
            <select
                value={props.value}
                onBlur={props.handleSelect}
                onChange={props.handleSelect}
            >
            <option value="" >{props.title}</option>
            {props.list.map((item,id)=>(
                <option 
                    key={id} 
                    value={item}
                >
                    {item}
                </option>
                    ))
            }
            </select>
            :null
            }
        </form>
    )
}