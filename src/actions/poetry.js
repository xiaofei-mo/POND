import axios from 'axios';
import Immutable from 'immutable';
import { A } from '../constants';

const request = axios.create({
  baseURL: '//ec2-54-202-149-86.us-west-2.compute.amazonaws.com:5000'
});

export default {
  getPoetry: (url, mime) => (dispatch, getState) => {
    dispatch({
      type: A.REQUEST_POETRY,
    });

    console.log('getState', getState().getIn(['app', 'token']))

    request.get('poetry', {
      params: {
        imageUri: url,
        mime: mime
      },
      headers: {
        'Authorization': `Token ${getState().getIn(['app', 'token'])}`
      }
    }).then((res) => {
      dispatch({
        type: A.RECEIVED_POETRY,
        payload: Immutable.Map({
          poetry: res.data.poetry,
        }),
      });
    });
  }
}
