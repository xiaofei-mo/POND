import pageActions from './page'
import userActions from './user'
import C from 'src/constants'

const additionalActions = {
  setWindowSize(width, height) {
    return {
      type: C.WINDOW_CHANGED_SIZE,
      width: width,
      height: height
    }
  }
}

export default Object.assign({}, pageActions, userActions, additionalActions)
