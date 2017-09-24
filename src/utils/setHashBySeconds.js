import debounce from 'lodash.debounce';
import getStringFromSeconds from './getStringFromSeconds';

const setHashBySeconds = (secondsInput) => {
  const timingString = getStringFromSeconds(secondsInput);
  location.hash = timingString;
}

export default debounce(setHashBySeconds, .2e3);
