//Renders product details
import React from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTruck from '@fortawesome/fontawesome-free-solid/faTruck';//truck for shipping icon
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';//check mark
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';//x mark



const ProductInfo = (props) => {

    //gets deetails and renders product tags
    const showProdTags = (detail) => (
        <div className="product_tags">
            { detail.shipping ? //shipping yes?
                <div className="tag">
                    <div><FontAwesomeIcon icon={faTruck}/></div>
                    <div className="tag_text">
                        <div>Free shipping</div>
                        <div>And return</div>
                    </div>
                </div>
            :null
            }
            { detail.available ? //is it available?
                <div className="tag">
                    <div><FontAwesomeIcon icon={faCheck}/></div>
                    <div className="tag_text">
                        <div>Available</div>
                        <div>in store</div>
                    </div>
                </div>
            :
                <div className="tag">
                    <div><FontAwesomeIcon icon={faTimes}/></div>
                    <div className="tag_text">
                        <div>Not Available</div>
                        <div>Preorder only</div>
                    </div>
                </div>
            }
        </div>
    )

    const detail = props.detail;
    return (
        <div className="product_info">
            <h1>{detail.name}</h1>
            <p>
                {detail.description}
            </p>
            { showProdTags(detail)}
            {console.log("Product Info: Props:",props)}
        </div>
    );
};

export default ProductInfo;