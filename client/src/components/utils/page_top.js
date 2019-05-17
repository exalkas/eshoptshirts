import React from 'react';
import {Link} from 'react-router-dom';

const PageTop = (props) => {
    return (
        <div className="page_top">
            <div className={props.class ? props.class :"container"}> 
                {props.title}
                {props.linkto ? 
                <Link to={props.linkto}>
                    {props.linkName}
                </Link>
                :null
                }
            </div>
        </div>
    );
};

export default PageTop;