import React from "react";
import h from "../helpers";
import CSSTransitionGroup from "react-addons-css-transition-group";
import autobind from "autobind-decorator";

@autobind
class Order extends React.Component {
  renderOrder(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButton = <button onClick={this.props.removeFromOrder.bind(null, key)}>&times;</button>

    if(!fish) {
      return <li key={key}>Sorry, fish no longer available {removeButton}</li>
    }
    return (
      <li key={key}>
        <CSSTransitionGroup component="span" transitionName="count" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
          <span key={key}>{count}</span>
        </CSSTransitionGroup>
        lbs {fish.name} {removeButton}
        <span className="price">{h.formatPrice(count * fish.price)}</span>
      </li>
    )
  }

  render(){
    var orderIds = Object.keys(this.props.order);
    var total = orderIds.reduce((prevTotal, key)=> {
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === "available";

      if(fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }
      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <CSSTransitionGroup className="order" component="ul" transitionName="order" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    )
  }
};

Order.propTypes = {
  order : React.PropTypes.object.isRequired,
  fishes : React.PropTypes.object.isRequired,
  removeFromOrder : React.PropTypes.func.isRequired
}

export default Order;
