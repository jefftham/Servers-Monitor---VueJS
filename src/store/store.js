import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import axiosFB from '../axios/firebase';
import router from '../router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    idToken: null,
    userId: null,
    firebaseApiKey: process.env.FIREBASE_API_KEY,
  },
  mutations: {
    authUserData(state, userData) {
      state.idToken = userData.idToken;
      state.userId = userData.userId;
    },
    storeUser(state, user) {
      state.user = Object.assign({}, user);
    },
    clearAuthData(state) {
      state.user = null;
      state.idToken = null;
      state.userId = null;
      localStorage.clear();
    },
    saveUserServers(state, servers) {
      state.user.servers = servers;
    },
  },
  actions: {
    // refresh token before expired
    refreshToken(context, expirationTime) {
      setTimeout(() => {
        Vue.$log.info('store.js refreshToken run');

        axios
          .post(`https://securetoken.googleapis.com/v1/token?key=${this.state.firebaseApiKey}`, {
            grant_type: 'refresh_token',
            refresh_token: context.state.user.refreshToken,
          })
          .then((res) => {
            Vue.$log.info('store.js authUserData res ', res);

            const obj = {
              idToken: res.data.id_token,
              userId: res.data.user_id,
              expiresIn: res.data.expires_in,
            };

            context.dispatch('afterLogin', obj);
          })
          .catch((error) => {
            Vue.$log.error('store.js refreshToken error = ', error);
          });
      }, expirationTime);
      // }, 10000);
    },

    // async fn for sign up
    signup(context, formData) {
      const authData = {
        email: formData.email,
        password: formData.pass,
        returnSecureToken: true,
      };

      // create account in firebase
      axios
        .post(
          `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
            this.state.firebaseApiKey
          }`,
          authData,
        )
        .then((res) => {
          Vue.$log.info('store.js signup res = ', res);

          // store data in vuex
          context.commit('storeUser', {
            fullName: formData.fullName,
            email: formData.email,
            refreshToken: res.data.refreshToken,
          });

          const obj = {
            idToken: res.data.idToken,
            userId: res.data.localId,
            expiresIn: res.data.expiresIn,
          };

          context.dispatch('afterLogin', obj);

          // store data in firebase
          context.dispatch('storeUserToFB');
        })
        .catch((error) => {
          Vue.$log.info('store.js - signup error = ', error);
        });
    },
    login(context, authData) {
      Vue.$log.info('store.js - login authData = ', authData);
      axios
        .post(
          `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
            this.state.firebaseApiKey
          }`,
        {
          email: authData.email,
          password: authData.pass,
          returnSecureToken: true,
        },
        )
        .then((res) => {
          Vue.$log.info('store.js - login res ', res);

          const obj = {
            idToken: res.data.idToken,
            userId: res.data.localId,
            expiresIn: res.data.expiresIn,
          };

          context.dispatch('afterLogin', obj);
        })
        .catch(error => Vue.$log.error(`store.js - login = ${error}`));
    },
    afterLogin(context, obj) {
      // store authenticated user
      context.commit('authUserData', {
        idToken: obj.idToken,
        userId: obj.userId,
      });

      const now = new Date();
      const expiredIn = obj.expiresIn * 1000; // millisecond
      const expirationDate = new Date(now.getTime() + expiredIn);

      // store data in localStorage
      localStorage.setItem('idToken', obj.idToken);
      localStorage.setItem('userId', obj.userId);
      localStorage.setItem('expirationDate', expirationDate);

      // retrieve saved user data in firebase
      if (!context.state.user) {
        context.dispatch('retrieveUserFromFB');
      }

      // 10 seconds before actual expireDate
      context.dispatch('refreshToken', expiredIn - 10000);

      //
      router.replace('/servers');
    },
    logout(context) {
      context.commit('clearAuthData');
      router.replace('/login');
    },
    // User UID as a key in /user table
    storeUserToFB(context) {
      if (!context.state.idToken) {
        return;
      }
      axiosFB
        .put(
          `/users/${context.state.userId}.json?auth=${context.state.idToken}`,
          context.state.user,
        )
        .then(res => Vue.$log.info('store.js - storeUserToFB res ', res))
        .catch(error => Vue.$log.info('store.js - storeUserToFB err', error));
    },
    retrieveUserFromFB(context) {
      Vue.$log.info('store.js - retrieving user from FB');
      if (!context.state.idToken) {
        return;
      }
      axiosFB
        .get(`/users/${context.state.userId}.json?auth=${context.state.idToken}`)
        .then((res) => {
          Vue.$log.info('store.js - retrieveUserFromFB res ', res);
          const data = res.data;
          Vue.$log.info('store.js - retrieveUserFromFB user', data);
          context.commit('storeUser', data);
        })
        .catch(error => Vue.$log.info('store.js - retrieveUserFromFB err ', error));
    },
    tryAutoLogin(context) {
      Vue.$log.info('store.js - tryAutoLogin run');

      const idToken = localStorage.getItem('idToken');
      if (!idToken) {
        context.commit('clearAuthData');
        return;
      }
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      const now = new Date();

      if (now >= expirationDate) {
        Vue.$log.info('store.js - expired token ...');
        context.commit('clearAuthData');
        return;
      }
      const userId = localStorage.getItem('userId');
      context.commit('authUserData', {
        idToken,
        userId,
      });

      context.dispatch('retrieveUserFromFB');
    },
    longPolling(context, url) {
      // a third party website that handle cors issue.
      // because this project does not include backend server
      const proxyWebsite = 'https://cors-anywhere.herokuapp.com/';
      return new Promise((resolve, reject) => {
        axios
          .get(proxyWebsite + url)
          .then((res) => {
            resolve(res.status);
          })
          .catch((error) => {
            reject(error.response.status);
          });
      });
    },
  },
});
