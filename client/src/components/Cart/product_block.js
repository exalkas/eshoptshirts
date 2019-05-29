// Renders products in cart
import React from 'react';

import plus_icon from '../../Resources/svg/plus-4.svg';
import minus_icon from '../../Resources/svg/minus-4.svg';

const UserProductBlock = (props) => {

    //renders image for product or image not avail
    const renderCartImage = (images) => {
        if(images && images.length > 0){
            console.log("product BLOCK: renderCartImage: URL=", images[0].url);
            return images[0].url
        } else {
            return '/images/image_not_available.png'
        }
    }

    const renderItems = () => (
        props.products.length>0  ?
            props.products.map((product,i)=>( //loop through products in cart
                <div className="user_product_block" key={i}>
                    <div className="item">
                        <div className="image"
                            style={{background:`url(${renderCartImage(product.image)}) no-repeat`}}
                        ></div>
                    </div>
                    <div className="item">
                        <h4>Name</h4>
                        <p>{product.name}</p>
                    </div>
                    <div className="item">
                        <h4>Color</h4>
                        <p>{product.color}</p>
                    </div>
                    <div className="item">
                        <h4>Size</h4>
                        <p>{product.size}</p>
                    </div>
                    <div className="item">
                        <h4>Quantity</h4>
                        <div className="quantity">
                            <div className="plus_button"  onClick={() => props.plusButtonHandler(i)}>
                                <img src={plus_icon} className="plus_icon" alt=''/>
                            </div>
                            <input 
                                className="quantity-input__screen" 
                                type="number" 
                                value={product.quantity} 
                                onChange={props.onInputChange}
                                id={i}
                            />
                            <div className="plus_button"  onClick={() => props.minusButtonHandler(i)}>
                                <img src={minus_icon} className="minus_icon" alt=''/>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <h4>Price</h4>
                        <p className="price">{product.price}€</p>
                    </div>
                    <div className="item_btn">
                       <div className="cart_update_btn" //remove button. product is in the loop
                            onClick={()=> props.updateItem(product.product_Id,product.size, product.color,product.quantity)}> 
                            Update
                       </div>
                    </div>
                    <div className="item_btn">
                       <div className="cart_remove_btn" //remove button. product is in the loop
                            onClick={()=> props.removeItem(product.product_Id,product.size, product.color)}> 
                            Remove
                       </div>
                    </div>
                </div>
            ))
        :null
    )

    return ( 
            renderItems()
        );
};

export default UserProductBlock;