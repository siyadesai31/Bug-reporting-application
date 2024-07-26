// TesterStore.js
import { defineStore } from 'pinia';

export const useTesterStore = defineStore('tester', {
  state: () => ({
    testers: [
      { name: 'Tester1', password: 'testerpassword' },
      { name: 'Tester2', password: 'testerpassword2' }
    ],
    currentTester: null,
    errorMessage: ''
  }),
  actions: {
    setName(name) {
      this.currentTester = name;
    },
    loginTester(username, password) {
      const tester = this.testers.find(tester => tester.name === username && tester.password === password);
      if (tester) {
        this.setName(tester.name);
        this.errorMessage = '';
        return true;
      } else {
        this.errorMessage = 'Tester not found';
        return false;
      }
    }
  }
});
