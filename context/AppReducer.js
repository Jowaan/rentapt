export const initialState = {
  user: null,
};

export const AppReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_USER":
      return {
        ...state,
        user: action.value,
      };
  }
};
