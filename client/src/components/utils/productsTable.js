/**
 * Functional component to render products in a table
 */

import React from 'react';

const ProductsTable = (props) => {

    const image= (images) => {
        if(images && images.length > 0){ //if # of images is >0 then return image url
            return images[0].url
        } else {// return the "not available" image
            return '/images/image_not_available.png'
        }
    }

    const renderProducts= () => (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Department</th>
                    <th>Price</th>
                    <th>Published</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {console.log('PRODUCTS TABLE: props=',props)}
                {props.products ?
                    props.products.map((product,i) => (
                        <tr key={i} className="table-products">
                            <td><img src={`${image(product.images)}`} height="30px" width="30px" alt=''/></td>
                            <td>{product.name}</td>
                            <td>{product.categoryName}</td>
                            <td>{product.departmentName}</td>
                            <td>{product.price}€</td>
                            <td>{product.publish.toString()}</td>
                            <td><a onClick={() => props.handleUpdate(product)}>Update</a></td>
                            <td><a onClick={() => props.handleRemove(product._id)}>Remove</a></td>
                        </tr>        
                    ))
                :<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>}
            </tbody>

        </table>
    )


    return (
        <div>
            {renderProducts()}
        </div>
    );
};

export default ProductsTable;