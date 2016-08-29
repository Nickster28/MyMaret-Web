/* 
 * FUNCTION: Visibility
 * ----------------------------
 * A component that lets you easily insert simple visible/hidden logic within a
 * React component.  Instead of doing something like:
 *
 * return (
 *		{
 *			!isVisible ? null :
 *			<div>Hello world!</div>
 *		}
 * )
 *
 * You can just write:
 *
 * return <Visibility visible={isVisible}>Hello world!</Visibility>
 *
 * If visible evaluates to true, it renders to display its children (which must
 * be a *single* React component).  Otherwise, it renders to null.
 * ----------------------------
 */

import { Component, PropTypes } from "react";

class Visibility extends Component {
	render() {
		return this.props.visible ? this.props.children : null;
	}
}

Visibility.propTypes = {
	visible: PropTypes.bool.isRequired,
	children: PropTypes.element.isRequired
};

export default Visibility;