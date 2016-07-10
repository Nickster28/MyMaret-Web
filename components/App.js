import React from 'react'

export default React.createClass({
  render() {
    return (
    	<div>
    		<h1>MyMaret</h1>
    		{this.props.children}
    	</div>
    )
  }
})