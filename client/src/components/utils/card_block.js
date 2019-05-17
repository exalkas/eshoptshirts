//Used to render 4 in a row such as best selling or newest
import React from 'react';
import Card from './card';

const CardBlock = (props) => {


    const renderCards = () =>(
        
        props.list && props.list.length>0 ? //check if list is undefined and it has items as well
            props.list.map((card,i)=>(
                    <Card
                        key={i}
                        {...card}
                    />
            ))
        :null
    )

    return (
        <div className="card_block">
            <div className="container">
                {
                    props.title ? //should we add a title?
                        <div className="title">
                            {props.title}
                        </div>
                    :null
                }
                <div style={{
                    display:'flex',
                    flexWrap:'wrap'
                }}>
                    {/* {console.log("Cardblock:",props.list)} */}
                    { renderCards(props.list)}
                </div>

            </div>
        </div>
    );
};

export default CardBlock;