import React from "react";
import h from "../helpers";
import autobind from "autobind-decorator";

@autobind
class Fish extends React.Component {
  onButtonClick() {
    this.props.addToOrder(this.props.index);
  }

  render() {
    var details = this.props.details;
    var isAvailable = ( details.status === "available" ? true : false );
    var buttonText = ( isAvailable ? "Add to Order" : "Sold Out!" );
    return (
      <li className="menu-fish">
        <img src={details.image} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    )
  }
};

export default Fish;
