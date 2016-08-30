import React from "react";
import AddFishForm from "./AddFishForm";
import autobind from "autobind-decorator";
import firebase from "firebase";

const config = {
  apiKey: "AIzaSyAYEJt_aoAUrOME4AolLfxVbmlfAYjp5KI",
  authDomain: "catch-of-the-day-f1466.firebaseapp.com",
  databaseURL: "https://catch-of-the-day-f1466.firebaseio.com",
  storageBucket: "catch-of-the-day-f1466.appspot.com",
};
firebase.initializeApp(config);
var provider = new firebase.auth.GithubAuthProvider();

@autobind
class Inventory extends React.Component {

  constructor() {
    super();
    this.state = {
      uid : "",
      owner : ""
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.authHandler(user);
      } else {
        this.setState({
          uid : null
        })
      }
    });
  }

  authenticate(provider) {
    firebase.auth().signInWithPopup(provider)
    .then(this.authHandler)
    .catch((error) => {
      console.error("Login Failed", error.message);
    });
  }

  authHandler(authData) {
    var storeRef = firebase.database().ref("store/" + this.props.params.storeid)

    storeRef.on("value", (snapshot) => {
      var data = snapshot.val() || {};
      var user = authData.user || authData;
      if (!data.owner) {
        // claim the store
        storeRef.set({
          owner : user.uid
        })
      }
      // update our state to refelct current store owner and user
      this.setState({
        uid : user.uid,
        owner : data.owner || user.uid
      })
    })
  }

  signOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      this.setState({
        uid : null
      });
    }, function(error) {
      // An error happened.
    });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your stores inventory</p>
        <button className="github" onClick={this.authenticate.bind(this, provider)}>Login with Github</button>
      </nav>
    )
  }

  renderInventory(key) {
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState("fishes." + key + ".name")} />
        <input type="text" valueLink={linkState("fishes." + key + ".price")} />
        <select valueLink={linkState("fishes." + key + ".status")}>
          <option value="unavailable">Sold Out!</option>
          <option value="available">Fresh</option>
        </select>
        <textarea valueLink={linkState("fishes." + key + ".desc")}></textarea>
        <input type="text" valueLink={linkState("fishes." + key + ".image")}></input>
        <button onClick={this.props.removeFish.bind(null, key)}>Delete</button>
      </div>
    )
  }

  render() {
    let logoutButton = <button onClick={this.signOut}>Log Out</button>

    if(!this.state.uid) {
      return (
        <div>{this.renderLogin()}</div>
      )
    }
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of this store</p>
          {logoutButton}
        </div>
      )
    }
    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        <AddFishForm {...this.props}/>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <button onClick={this.props.loadSamples}>Load Sample Fish</button>
      </div>
    )
  }
};

Inventory.propTypes = {
  fishes : React.PropTypes.object.isRequired,
  addFish : React.PropTypes.func.isRequired,
  removeFish : React.PropTypes.func.isRequired,
  loadSamples : React.PropTypes.func.isRequired,
  linkState : React.PropTypes.func.isRequired
}

export default Inventory;
