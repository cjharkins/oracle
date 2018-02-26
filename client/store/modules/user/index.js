/**
 * @Author: warrensadler
 * @Date:   2017-09-10T19:35:17-05:00
 * @Last modified by:   warrensadler
 * @Last modified time: 2017-09-17T15:26:21-05:00
 */

// client/store/modules/user/index.js
import firebaseService from '../../../services/firebase'
import router from '../../../router'

const state = {
  user: null,
  properties: null,
  loginError: null
}

const getters = {
  /**
   * [isUserLoggedOut description]
   * @param  {[type]}  state [description]
   * @return {Boolean}       [description]
   */
  isUserLoggedOut (state) {
    return !!state.user
  },
  /**
   * [currentUser description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  currentUser (state) {
    return state.user
      ? state.user : {}
  },
  /**
   * [isLoginError description]
   * @param  {[type]}  state [description]
   * @return {Boolean}       [description]
   */
  isLoginError (state) {
    return !!state.loginError
  },
  /**
   * [loginError description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  loginError (state) {
    return state.loginError
      ? state.loginError.message
      : ''
  },
  selectedTopics (state) {
    return state.properties ? state.properties.topics.filter(t => t.selected) : []
  },
  userDefinedKeywords (state) {
    return state.properties ? state.properties.keywords : []
  },
  currentUsersCompany (state) {
    return state.properties ? state.properties.details.company.name : 'Default Company'
  },
  userContactsLists (state) {
    if (!state.properties) return []
    if (!state.properties.contacts) return []
    return state.properties.contacts
  }
}

// Action Types
const RECEIVE_USER = 'RECEIVE_USER'
const UPDATE_CONTACTS_EDIT = 'UPDATE_CONTACTS_EDIT'
const RECEIVE_USER_PROPERTIES = 'RECEIVE_USER_PROPERTIES'
const LOGOUT = 'LOGOUT'
const LOGIN_ERROR = 'LOGIN_ERROR'
const UPDATE_SELECTED_TOPICS = 'UPDATE_SELECTED_TOPICS'
const UPDATE_KEYWORDS = 'UPDATE_KEYWORDS'
const UPDATE_CONTACTS = 'UPDATE_CONTACTS'
const UPDATE_CONTACTS_DELETE = 'UPDATE_CONTACTS_DELETE'

// Mutations
const mutations = {
  [RECEIVE_USER]: (state, user) => {
    state.user = user
    state.loginError = null
  },
  [RECEIVE_USER_PROPERTIES]: (state, userProperties) => {
    if (userProperties.keywords) {
      if (userProperties.contacts) {
        state.properties = userProperties
      } else {
        state.properties = Object.assign({}, userProperties, {
          contacts: []
        })
      }
    } else {
      state.properties = Object.assign({}, userProperties, {
        contacts: [],
        keywords: []
      })
    }
  },
  [LOGOUT]: (state) => {
    state.user = null
    state.properties = null
  },
  [LOGIN_ERROR]: (state, loginError) => {
    state.loginError = loginError
  },
  [UPDATE_SELECTED_TOPICS]: (state, index) => {
    state.properties.topics[index].selected = !state.properties.topics[index].selected
  },
  [UPDATE_KEYWORDS]: (state, keywords) => {
    state.properties.keywords = keywords
  },
  [UPDATE_CONTACTS]: (state, contacts) => {
    if (state.properties.contacts) {
      state.properties.contacts.push(contacts)
    } else {
      state.properties.contacts = []
      state.properties.contacts.push(contacts)
    }
  },
  [UPDATE_CONTACTS_EDIT]: (state, {
    index,
    editedContactList
  }) => {
    state.properties.contacts = state.properties.contacts.map((cl, i) => {
      if (i === index) {
        return editedContactList
      } else {
        return cl
      }
    })
  },
  [UPDATE_CONTACTS_DELETE]: (state, index) => {
    state.properties.contacts.splice(index, 1)
  }
}

const actions = {
  attemptLogin ({
    commit
  }, {
    email,
    password
  }) {
    firebaseService.login(email, password).then(user => {
      commit(RECEIVE_USER, user)
      return firebaseService.getUserProperties(user.uid)
    }).then(properties => commit(RECEIVE_USER_PROPERTIES, properties))
      .then(() => router.push({
        path: '/stories'
      }))
      .catch(loginError => commit(LOGIN_ERROR, loginError))
  },
  logout ({
    commit
  }) {
    firebaseService.logout().then(() => commit(LOGOUT)).then(() => {
      router.push({
        path: '/'
      })
      return
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
