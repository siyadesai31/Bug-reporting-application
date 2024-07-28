<template>
  <q-page padding>
    <h4>Bug List</h4>
    <div class="header-section">
      <div class="buttons">
        <button @click="setFilter('all')">all</button>
        <button @click="setFilter('completed')">completed</button>
        <button @click="setFilter('pending')">pending</button>
        <button @click="setPriority('High')">high</button>
        <button @click="setPriority('Med')">med</button>
        <button @click="setPriority('Low')">low</button>
        <button @click="setSort('assignTo')">Assignto</button>
        <button @click="setSort('dueDate')">DueDate</button>
      </div>
    </div>

    <q-item-section side top>
      <input
        type="text"
        placeholder="Search by title"
        v-model="searchTitle"
        @input="filterBugs"
        style="width:16em"
      >
    </q-item-section>

    <q-item
      v-for="bug in filteredBugs"
      :key="bug.bugid"
      class="bug-card"
      :class="bug.completed ? 'bg-lightgreen' : 'bg-lavender'"
      v-ripple
    >
      <q-item-section side top>
        <q-checkbox v-model="bug.completed" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <span>{{ bug.title }}</span>
        </q-item-label>
        <q-item-label caption>
          <span>{{ bug.description }}</span>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-select
          v-model="bug.priority"
          :options="['High', 'Med', 'Low']"
          dense
        />
      </q-item-section>

      <q-item-section side>
        <q-select
          icon="person"
          v-model="bug.assignedTo"
          :options="assignToOptions"
          label="Assign to"
          dense
          @update:model-value="updateAssignment(bug.bugid, bug.assignedTo)"
        />
      </q-item-section>

      <q-item-section side>
        <q-btn
          icon="visibility"
          @click="viewBugDetails(bug)"
          dense
          color="primary"
          rounded
        />
      </q-item-section>
    </q-item>

    <!-- View Bug Details Dialog -->
    <q-dialog v-model="showViewDialog" persistent>
      <q-card class="q-dialog--large">
        <q-card-section>
          <div>
            <q-input v-model="selectedBug.title" label="Title" />
            <q-input v-model="selectedBug.description" label="Description" type="textarea" />
            <q-item-label>Priority: {{ selectedBug.priority }}</q-item-label>
            <q-item-label>Status: {{ selectedBug.completed ? 'Completed' : 'Pending' }}</q-item-label>
            <q-item-label>Assigned To: {{ selectedBug.assignedTo }}</q-item-label>
            <!-- Conditionally render the date range -->
            <div v-if="showDateRange">
              <q-item-label>Due Date: From {{ selectedBug.dueDate?.from || 'N/A' }} To {{ selectedBug.dueDate?.to || 'N/A' }}</q-item-label>
              <q-item-label>
                Days Left: 
                <span v-if="selectedBug.daysLeft > 0">{{ selectedBug.daysLeft }} day(s) left</span>
                <span v-else class="overdue">Overdue by {{ selectedBug.overdue }} day(s)</span>
              </q-item-label>
            </div>
            <!-- Editable comment section -->
            <q-input v-model="selectedBug.comment" label="Comment" type="textarea" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            icon="event"
            @click="showDateDialog = true; showDateRange = true"
            dense
            color="primary"
          />
          <q-btn
            icon="check"
            @click="saveBug(selectedBug)"
            dense
            color="primary"
          />
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Date Selection Dialog -->
    <q-dialog v-model="showDateDialog">
      <q-card>
        <q-card-section>
          <q-date v-model="selectedDateRange" range />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="showDateDialog = false" />
          <q-btn flat label="Save" @click="saveDateRange" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useBugStore } from '../stores/BugStore';
import { useDeveloperStore } from '../stores/DeveloperStore';
import { ref, computed, onMounted } from 'vue';

const bugStore = useBugStore();
const developerStore = useDeveloperStore();

const showViewDialog = ref(false);
const showDateDialog = ref(false);
const selectedDateRange = ref(null);
const selectedBug = ref(null);
const filter = ref('all');
const priority = ref('all');
const sort = ref('none');
const searchTitle = ref('');
const showDateRange = ref(false);

const assignToOptions = computed(() => {
  return developerStore.developers.map(dev => ({
    label: `${dev.name}`,
    value: dev.name,
  }));
});

const filteredBugs = computed(() => {
  let bugs = bugStore.bugs;

  // Apply search filter first
  if (searchTitle.value) {
    bugs = bugs.filter(bug => bug.title.toLowerCase().includes(searchTitle.value.toLowerCase()));
  }

  // Apply filter
  if (filter.value === 'completed') {
    bugs = bugs.filter(bug => bug.completed);
  } else if (filter.value === 'pending') {
    bugs = bugs.filter(bug => !bug.completed);
  }

  // Apply priority filter
  if (priority.value !== 'all') {
    bugs = bugs.filter(bug => bug.priority === priority.value);
  }

  // Apply sorting
  if (sort.value === 'priority') {
    const priorityOrder = { 'High': 3, 'Med': 2, 'Low': 1 };
    bugs = bugs.slice().sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  } else if (sort.value === 'assignTo') {
    bugs = bugs.slice().sort((a, b) => {
      return assignToOptions.value.findIndex(option => option.value === b.assignedTo) -
             assignToOptions.value.findIndex(option => option.value === a.assignedTo);
    });
  } else if (sort.value === 'dueDate') {
    bugs = bugs.slice().sort((a, b) => {
      const aDueDate = new Date(a.dueDate?.to || '').getTime();
      const bDueDate = new Date(b.dueDate?.to || '').getTime();
      return aDueDate - bDueDate;
    });
  }

  // Apply due date filter
  if (filter.value === 'dueDate') {
    const currentDate = new Date();
    bugs = bugs.filter(bug => {
      if (!bug.dueDate || !bug.dueDate.to) return false;
      const dueDate = new Date(bug.dueDate.to);
      const daysLeft = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
      return daysLeft >= 0;
    });
  }

  return bugs;
});

function updateAssignment(bugid, assignedTo) {
  console.log('updateAssignment in Task.vue');
  console.log(bugid);
  console.log(assignedTo);

  const bug = bugStore.bugs.find(b => b.bugid === bugid);
  if (bug) {
    bug.assignedTo = assignedTo.value; // Ensure correct value extraction
    bugStore.updateBug(bug); // Update the bug in the store
    developerStore.fetchAssignedBugs(); // Re-fetch assigned bugs for the developer
  }
}

function viewBugDetails(bug) {
  selectedBug.value = { ...bug }; // Create a copy to edit
  selectedDateRange.value = bug.dueDate || { from: null, to: null }; // Set the date range for the selected bug
  
  // Calculate days left or overdue status
  const currentDate = new Date();
  const dueDate = new Date(bug.dueDate?.to);
  const timeDiff = dueDate - currentDate;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  if (daysLeft > 0) {
    selectedBug.value.daysLeft = daysLeft;
  } else {
    selectedBug.value.overdue = Math.abs(daysLeft);
  }

  showViewDialog.value = true;
}

function saveBug(bug) {
  if (bug) {
    bugStore.updateBug(bug);
    selectedBug.value = null;
    showViewDialog.value = false; // Close the dialog after saving
  }
}

function saveDateRange() {
  if (selectedBug.value) {
    selectedBug.value.dueDate = { ...selectedDateRange.value };
    showDateDialog.value = false; // Close the date selection dialog
  }
}

function setFilter(newFilter) {
  filter.value = newFilter;
}

function setPriority(newPriority) {
  priority.value = newPriority;
}

function setSort(newSort) {
  sort.value = newSort;
}

onMounted(() => {
  bugStore.fetchBugs();
  developerStore.fetchDevelopers();
});

</script>

<style>
h4 {
  color: blueviolet;
  text-align: center;
}

.bug-card {
  display: flex;
  background: lavender;
  padding: 20px;
  margin: 10px 0;
  border-radius: 10px;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 4px;
}

.buttons button {
  background-color: lavender;
  /* padding: 8px 16px; */
  border-radius: 20px;
  border: none;
  outline: none;
  cursor: pointer;
  color: grey;
  flex: 1; /* Ensure buttons take equal space in the container */
  min-width: 80px; /* Set a minimum width for buttons */
  text-align: center; /* Center text in buttons */
}

.buttons button:hover {
  background-color: blueviolet;
  color: white; /* Change text color on hover for better contrast */
}

.bg-lightgreen {
  background: rgb(178, 254, 178);
}

.bg-lavender {
  background: lavender;
}

.header-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.header-section .buttons {
  flex: 1;
}

.due-date-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.q-dialog--large {
  width: 80vw; /* Adjust the width as needed */
  max-width: 900px; /* Max width for larger screens */
}

.overdue {
  color: red;
  font-weight: bold;
}

@media (max-width: 600px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .header-section .buttons {
    width: 100%;
  }

  .bug-card {
    flex-direction: column;
  }

  .buttons {
    width: 100%; /* Make buttons container full width */
  }

  .buttons button {
    min-width: auto; /* Remove fixed minimum width on small screens */
    flex: 1 1 auto; /* Allow buttons to grow and shrink as needed */
    margin-bottom: 5px; /* Add spacing between buttons on smaller screens */
  }
}
</style>
