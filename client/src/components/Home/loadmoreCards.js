import React from 'react';
import CardBlockShop from '../../components/utils/card_block_shop';

const LoadmoreCards = (props) => {
    return (
        <div>
            <div>
                <CardBlockShop
                    grid={props.grid}
                    list={props.products}
                />
            </div>
            {
                props.size > 0 && props.size >= props.limit ? //check if there are more products coming, so let button load more exist or not. if coming less than the limit that means that there are no more coming
                    <div className="load_more_container">
                        <span onClick={()=> props.loadMore()}>
                            Load More
                        </span>
                    </div>
                :null
            }
            

    
        </div>
    );
};

export default LoadmoreCards;