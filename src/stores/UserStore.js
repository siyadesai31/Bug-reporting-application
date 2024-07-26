// stores/useUserStore.js
import { defineStore } from 'pinia';
import { useAdminStore } from './AdminStore';
import { useDeveloperStore } from './DeveloperStore';
import { useTesterStore } from './TesterStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    role: '',
    errorMessage: ''
  }),
  actions: {
    login(username, password) {
      const adminStore = useAdminStore();
      const developerStore = useDeveloperStore();
      const testerStore = useTesterStore();

      if (adminStore.loginAdmin(username, password)) {
        this.currentUser = username;
        this.role = 'admin';
        return '/admin/task';
      } 
      else if (developerStore.loginDeveloper(username, password)) {
        this.currentUser = username;
        this.role = 'developer';
        return '/develop/task';
      } 
      else if (testerStore.loginTester(username, password)) {
        this.currentUser = username;
        this.role = 'tester';
        return '/test/task';
      } 
      else {
        this.errorMessage = 'Invalid username or password';
        return null;
      }
    }
  }
});
