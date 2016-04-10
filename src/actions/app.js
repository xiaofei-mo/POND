import C from 'src/constants'

export default {
  enterAddMode: () => {
    return {
      type: C.ENTERED_ADD_MODE
    }
  },

  exitAddMode: () => {
    return {
      type: C.EXITED_ADD_MODE
    }
  },

  handleDroppedFile: (file) => {
    return {
      type: C.FILE_WAS_DROPPED,
      file: file
    }
  }
}
