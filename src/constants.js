// Authentication Action Types
export const LOGGED_IN_SUCCESS = "LOGGED_IN_SUCCESS";
export const LOGGED_IN_ERROR = "LOGGED_IN_ERROR";
export const LOGGED_OUT_SUCCESS = "LOGGED_OUT_SUCCESS";
export const LOGGED_OUT_ERROR = "LOGGED_OUT_ERROR";

// Actions for fetching and manipulating editions
export const FETCH_EDITIONS = "FETCH_EDITIONS";
export const FETCHED_EDITIONS_SUCCESS = "FETCHED_EDITIONS_SUCCESS"
export const FETCHED_EDITIONS_ERROR = "FETCHED_EDITIONS_ERROR";

// Actions for handling redirect from /editions to /editions/edition/:id
export const EDITIONS_INDEX_REDIRECT_TRUE = "EDITIONS_INDEX_REDIRECT_TRUE";
export const EDITIONS_INDEX_REDIRECT_FALSE = "EDITIONS_INDEX_REDIRECT_FALSE"

// Actions for viewing/switching between editions
export const SELECT_EDITION = "SELECT_EDITION";