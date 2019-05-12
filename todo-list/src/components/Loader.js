import React, { Component } from 'react';
import '../css/components/loader.css';

class Loader extends Component {
  render() {
    const divStyle = {
      width: '100%',
      height: '100%',
    };

    return (
      <div className="lds-css ng-scope">
        <div style={divStyle} className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}

export default Loader;