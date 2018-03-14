import {
  db
} from '../../constants/fb'
import {
  isUpdateMutation
} from 'utils'

export const syncUserState = (store) => {
  store.subscribe(({
    type
  }, state) => {
    if (isUpdateMutation(type)) {
      console.log('Updating fb')
      db.ref(`/users/${state.user.user.uid}/userProperties`).set(state.user.properties)
    }
  })
}
