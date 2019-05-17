import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserLayout from '../../hoc/user';
import { getOrderHistory } from '../../actions/user_actions';

import moment from 'moment';

// {moment(product.dateOfPurchase).format("MM-DD-YYYY")}

class PurchaseHistory extends Component {
    state={
        orders:[]
    }

    async componentDidMount(){
        await this.props.dispatch(getOrderHistory()); //this.props.user.id

            this.updateState();

    }

    updateState(){
        const tmpArr=this.props.user.history;

        console.log("purchase_history: updateState: tmpArr=",tmpArr);

        // tmpArr.push(this.props.user.history.products)
        this.setState({
            orders:tmpArr
        });
        
        console.log("purchase_history: updateState: this.state=",this.state.orders);


    }

    renderBlocks = () => (
        // const history=this.props.user.history;

        this.state.orders ?
                this.state.orders.map((order,i)=>(
                <tr key={i}>
                    <td>{order._id}</td>
                    <td>{moment(order.dateOfPurchase).format("DD-MM-YYYY")}</td>
                    <td>{order.totalPaid}€</td>
                </tr>
            ))
            :null
    )

    render() {
        return (
            <UserLayout>
               <div className="history_blocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Order number</th>
                                <th>Date of Purchase</th>
                                <th>Price paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderBlocks()}
                        </tbody>
                    </table>
        </div>
            </UserLayout>
        );
    }
}

const mapStateToProps= (state) => {//do we need mapState to props?
    return{
        user : state.user
    }
}

export default connect(mapStateToProps)(PurchaseHistory);