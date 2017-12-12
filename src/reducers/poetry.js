import { A } from '../constants';
import Immutable from 'immutable';

const initialState = Immutable.Map({
  poetry: '',
});

export default function poetryReducer(state = initialState, action) {
  switch (action.type) {
    case A.REQUEST_POETRY:
      return state.merge({
        poetry: 'generating...'
      });

    case A.RECEIVED_POETRY:
      return state.merge(action.payload);

    default:
      return state;
  }
}