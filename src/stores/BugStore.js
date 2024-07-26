import { defineStore } from 'pinia';
import { useDeveloperStore } from './DeveloperStore';
export const useBugStore = defineStore('bugs', {
  state: () => ({
    bugs: [
      {
        bugid: 1,
        title: 'test-1',
        description: 'This is to report the bug in test-1',
        priority: 'High',
        completed: false,
        assignedTo: '',
        dueDate: null
      },
      {
        bugid: 2,
        title: 'test-2',
        description: 'This is to report the bug in test-2',
        priority: 'Med',
        completed: false,
        assignedTo: '',
        dueDate: null
      },
      {
        bugid: 3,
        title: 'test-3',
        description: 'This is to report the bug in test-3',
        priority: 'Low',
        completed: false,
        assignedTo: '',
        dueDate: null
      },
      {
        bugid: 4,
        title: 'test-4',
        description: 'This is to report the bug in test-4',
        priority: 'Med',
        completed: false,
        assignedTo: '',
        dueDate: null
      },
      {
        bugid: 5,
        title: 'test-5',
        description: 'This is to report the bug in test-5',
        priority: 'High',
        completed: false,
        assignedTo: '',
        dueDate: null
      },
      {
        bugid: 6,
        title: 'test-6',
        description: 'This is to report the bug in test-6',
        priority: 'Low',
        completed: false,
        assignedTo: '',
        dueDate: null
      },
      {
        bugid: 7,
        title: 'test-7',
        description: 'This is to report the bug in test-7',
        priority: 'Med',
        completed: false,
        assignedTo: '',
        dueDate: null
      },
      {
        bugid: 8,
        title: 'test-8',
        description: 'This is to report the bug in test-8',
        priority: 'Low',
        completed: false,
        assignedTo: '',
        dueDate: null
      },
      {
        bugid: 9,
        title: 'test-9',
        description: 'This is to report the bug in test-9',
        priority: 'High',
        completed: false,
        assignedTo: '',
        dueDate: null
      },
      {
        bugid: 10,
        title: 'test-10',
        description: 'This is to report the bug in test-10',
        priority: 'Low',
        completed: false,
        assignedTo: '',
        dueDate: null
      },
    ],
    users: [
      { name: 'User1' },
      { name: 'User2' }
    ],
    developers: [
      { name: 'Developer1' },
      { name: 'Developer2' }
    ]
  }),
  getters: {
    getBugById: (state) => (bugid) => {
      console.log('getBugById in bugsstore');
      console.log(bugid)
      return state.bugs.find(bug => bug.bugid === bugid);
    }
  },
  actions: {
    fetchBugs() {
      // Logic to fetch bugs
    },
    addBug(bug) {
      const newBugId = this.bugs.length ? Math.max(...this.bugs.map(b => b.bugid)) + 1 : 1;
      this.bugs.push({ ...bug, bugid: newBugId });
    },
    updateBug(updatedBug) {
      console.log('updateBug in BugStore.js');
      console.log(updatedBug);
      const index = this.bugs.findIndex(bug => bug.bugid === updatedBug.bugid);
      if (index !== -1) {
        this.bugs[index] = updatedBug;
        // const developerStore = useDeveloperStore();
        // developerStore.updateAssignedBugs(updatedBug.bugid); // Pass bugid
      }
    }
  }
});
