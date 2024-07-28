// DeveloperStore.js
import { defineStore } from 'pinia';
import { useBugStore } from './BugStore';

export const useDeveloperStore = defineStore('Developer', {
  state: () => ({
    developers: [
      { name: 'Developer1', password: 'developerpassword' },
      { name: 'Developer2', password: 'developerpassword2' }
    ],
    currentDeveloper: '',
    assignedBugs: [],
    errorMessage: '',
    filter: 'all',
    sort: 'none'
  }),
  getters: {
    filteredBugs: (state) => {
      let bugs = state.assignedBugs;

      if (state.filter === 'completed') {
        bugs = bugs.filter(bug => bug.completed);
      } else if (state.filter === 'pending') {
        bugs = bugs.filter(bug => !bug.completed);
      }

      if (state.sort === 'priority') {
        const priorityOrder = { 'High': 3, 'Med': 2, 'Low': 1 };
        bugs = bugs.slice().sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      }

      return bugs;
    }
  },
  actions: {
    setName(name) {
      this.currentDeveloper = name;
    },
    loginDeveloper(username, password) {
      const developer = this.developers.find(developer => developer.name === username && developer.password === password);
      if (developer) {
        this.setName(developer.name);
        this.fetchAssignedBugs(); // Load bugs assigned to the current developer
        this.errorMessage = '';
        return true;
      } else {
        this.errorMessage = 'Developer not found';
        return false;
      }
    },
    fetchAssignedBugs() {
      console.log('fetchAssignedBugs in developerStore');
      const bugStore = useBugStore();
      this.assignedBugs = bugStore.bugs.filter(bug => bug.assignedTo === this.currentDeveloper);
      console.log(this.assignedBugs);
    },
    setFilter(filter) {
      this.filter = filter;
      this.fetchAssignedBugs(); // Re-fetch bugs after filter change
    },
    setSort(sort) {
      this.sort = sort;
      this.fetchAssignedBugs(); // Re-fetch bugs after sort change
    },
    fetchDevelopers() {
      try {
        const response = api.get('/developers'); // Adjust the API endpoint accordingly
        this.developers = response.data;
      } catch (error) {
        console.error('Error fetching developers:', error);
      }
    }
  }
});
