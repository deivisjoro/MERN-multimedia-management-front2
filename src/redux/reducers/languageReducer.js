const initialState = {
  value: 'en'
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        value: action.payload
      };
    default:
      return state;
  }
};

export default languageReducer;
