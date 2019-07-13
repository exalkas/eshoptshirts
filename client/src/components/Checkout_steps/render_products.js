// Renders a table with products along with total
import React from 'react';

const RenderProducts = (props) => {
    return (
        <div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Color</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.products ?
                        props.products.map((item,i) => (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.size}</td>
                                <td>{item.color}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                            </tr>
                            )
                        )
                            :<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
                    }
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Total:</td>
                            <td>{props.total>0 ? props.total : 0}€</td> 
                        </tr>
                    </tbody>
                </table>
             </div>
        </div>
    );
};

export default RenderProducts;