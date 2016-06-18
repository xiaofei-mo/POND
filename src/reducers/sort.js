import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  isOpen: false,
  vocabularies: Immutable.List()
})

export default function sortReducer (state = initialState, action) {
  switch (action.type) {

    case C.CLOSE_ALL_VOCABULARIES:
      return state.set(
        'vocabularies', 
        state.get('vocabularies').map(v => v.set('isOpen', false))
      )

    case C.CLOSE_SORT:
      return state.merge({
        isOpen: false,
        vocabularies: state.get('vocabularies').map(v => v.set('isOpen', false))
      })

    case C.OPEN_SORT:
      return state.set('isOpen', true)

    case C.RECEIVED_VOCABULARIES:
      return state.set('vocabularies', action.payload.get('vocabularies'))
    
    case C.TOGGLE_VOCABULARY:
      return state.set('vocabularies', 
        state.get('vocabularies').map((v) => {
          if (v.get('name') === action.payload.get('name')) {
            return v.set('isOpen', !v.get('isOpen'))
          }
          else {
            return v.set('isOpen', false)
          }
        })
      )

    default:
      return state
  }
}

const _getVocabularyByName = (name) => {
  return state.find((v) => v.name === name)
}
