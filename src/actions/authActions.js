export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";

export const loginSuccess = (token) => {
  return {
    type: LOGIN_SUCCESS,
    payload: token,
  };
};

export const loginFailure = (message) => {
  return {
    type: LOGIN_FAILURE,
    payload: message,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};
