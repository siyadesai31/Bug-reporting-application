// AdminStore.js
import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    admins: [
      { name: 'Admin1', password: 'adminpassword' },
      { name: 'Admin2', password: 'adminpassword2' }
    ],
    currentAdmin: null,
    errorMessage: ''
  }),
  actions: {
    setName(name) {
      this.currentAdmin = name;
    },
    loginAdmin(username, password) {
      const admin = this.admins.find(admin => admin.name === username && admin.password === password);
      if (admin) {
        this.setName(admin.name);
        this.errorMessage = '';
        return true;
      } else {
        this.errorMessage = 'Admin not found';
        return false;
      }
    }
  }
});
