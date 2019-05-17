// Renders products in cart
import MyButton from '../utils/button';
import React from 'react';

const UserProductBlock = (props) => {

    //renders image for product or image not avail
    const renderCartImage = (images) => {
        if(images && images.length > 0){
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
                        <div
                            className="image"
                            style={{background:`url(${renderCartImage(product.image)}) no-repeat`}}
                        ></div>
                    </div>
                    <div className="item">
                        <h4>Name</h4>
                        <div>
                            {product.name} 
                        </div>
                    </div>
                    <div className="item">
                        <h4>Color</h4>
                        <div>
                            {product.color} 
                        </div>
                    </div>
                    <div className="item">
                        <h4>Size</h4>
                        <div>
                            {product.size} 
                        </div>
                    </div>

                    <div className="item">
                        <h4>Quantity</h4>
                        <div>
                            <MyButton
                                type='simple'
                                className="quantity-input__modifier quantity-input__modifier--left"
                                text="+"
                                runAction={() => props.plusButtonHandler(i)}
                            />
                            <input 
                                className="quantity-input__screen" 
                                type="number" 
                                value={product.quantity} 
                                onChange={props.onInputChange}
                                id={i}
                            />
                            <MyButton
                                type='simple'
                                text="-"
                                runAction={()=> props.minusButtonHandler(i)}
                            />
                        </div>
                    </div>
                    <div className="item">
                        <h4>Price</h4>
                        <div>
                           € {product.price}
                        </div>
                    </div>
                    <div className="item btn">
                       <div className="cart_update_btn" //remove button. product is in the loop
                            onClick={()=> props.updateItem(product.product_Id,product.size, product.color,product.quantity)}> 
                            Update
                       </div>
                    </div>
                    <div className="item btn">
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
            <div>
                {renderItems()}
            </div>
        );
};
    // Pass product quantities to state
    // componentDidMount(){
    //     let arr=[];
    //     this.props.products.map((item,i)=> arr[i]=item.quantity);
    //     this.setState({quantities:arr});

    //     console.log("product_block: props=",this.props);

    //     console.log("product_block: quantities in state=",this.state.quantities);
    // }

    // static getDerivedStateFromProps(props,state){
    //     let arr=[];
    //     props.products.map((item,i)=> arr[i]=item.quantity);
    //     this.setState({quantities:arr});

    //     console.log("product_block: props=",props);

    //     console.log("product_block: quantities in state=",this.state.quantities);
    // }

export default UserProductBlock;