/*
 * REDUCER: routing
 * ---------------------
 * We must write our own reducer for routing state, since we're using
 * Immutable.js, which the default router reducer from react-router-redux isn't
 * compatible with.  Thanks to https://github.com/gajus/redux-immutable for the
 * guide.
 * ---------------------
 */
import Immutable from "immutable";
import { LOCATION_CHANGE } from "react-router-redux";

const initialState = Immutable.fromJS({
	locationBeforeTransitions: null
});

export default (state = initialState, action) => {
	switch (action.type) {
		case LOCATION_CHANGE:
			return state.merge({
				locationBeforeTransitions: action.payload
			});
		default:
			return state;
	}
};