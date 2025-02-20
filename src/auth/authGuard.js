import { ref } from 'vue';

export const isAuthenticated = ref(false);
export const currentUser = ref(null);

export function setAuthState(user) {
  isAuthenticated.value = true;
  currentUser.value = user;
}

export function clearAuthState() {
  isAuthenticated.value = false;
  currentUser.value = null;
}