import axios from 'axios';
import Immutable from 'immutable';
import { A } from '../constants';

const request = axios.create({
  baseURL: '//54.245.220.55:5000'
});

export default {
  getPoetry: (url, mime) => (dispatch, getState) => {
    dispatch({
      type: A.REQUEST_POETRY,
    });

    request.get('poetry', {
      params: {
        imageUri: url,
        mime: mime
      },
      // headers: {
      //   'Authorization': `Token ${getState().getIn(['app', 'token'])}`
      // }
    }).then((res) => {
      dispatch({
        type: A.RECEIVED_POETRY,
        payload: Immutable.Map({
          poetry: res.data.poetry,
        }),
      });
    });
  },

  getCaption: (url, mime, duration) => (dispatch) => {
    dispatch({
      type: A.REQUEST_POETRY,
    });

    request.get('caption', {
      params: {
        videoUri: url,
        mime: mime,
        duration: duration,
      },
    }).then((res) => {
      const poetry = res.data.captions
        .map(i => i.caption)
        .reduce((l, r) => l + ', ' + r);

      dispatch({
        type: A.RECEIVED_POETRY,
        payload: Immutable.Map({
          poetry,
        }),
      });
    });
  }
}
