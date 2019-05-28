import React from 'react';
import MyButton from '../utils/button';

   
const AddToCartComponent= (props) => {

    //Shows price and add to card button
    const showProdActions = (details) => (
        <div className="product_actions">
            <div className="price">€ { details.price }</div>
            <div className="cart_actions">
                <MyButton
                    type="add_to_cart_link"
                    runAction={()=>{
                    props.addToCart(details._id)
                    }}
                
                />
                {/* {console.log("addToCart: details._id: ",details._id)} */}
                <div className="quantity-input">
                    <MyButton
                        type='simple'
                        className="quantity-input__modifier quantity-input__modifier--left"
                        text="+"
                        runAction={()=> {props.plusaction()}}
                    />
                     <MyButton />
                     <input 
                        className="quantity-input__screen" 
                        type="number" 
                        value={props.value} 
                        onChange={props.onchange}
                    />
                    <MyButton
                        type='simple'
                        className="quantity-input__modifier quantity-input__modifier--right"
                        text="-"
                        runAction={()=> props.minusaction()}
                    />
                     <MyButton />
                </div>
            </div>
        </div>
    )

return (
        // <div>
            showProdActions(props.details)
        // </div>
    )
}
 
export default AddToCartComponent;