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
 * return <Visibility visible={isVisible}
 *			createElement={() => { return "Hello world!"; }} />
 *
 * If visible evaluates to true, it renders whatever is returned by the
 * createElement function.  Otherwise, it renders to null.  It takes a function
 * instead of children elements because the children elements might only be
 * render-able when the visibility condition is true (e.g. an error message that
 * relies on error.message, which would error when error is undefined).
 * ----------------------------
 */

import { Component, PropTypes } from "react";

class Visibility extends Component {
	render() {
		return this.props.visible ? this.props.createElement() : null;
	}
}

Visibility.propTypes = {
	visible: PropTypes.bool.isRequired,
	createElement: PropTypes.func.isRequired
};

export default Visibility;