import C from 'src/constants'

export default {
  handleDroppedFiles: (files) => {
    return (dispatch, getState) => {
      dispatch({
        type: C.FILES_WERE_DROPPED, 
        files: files
      })
    }
  }
}
