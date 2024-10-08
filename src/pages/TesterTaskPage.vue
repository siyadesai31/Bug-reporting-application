<template>
  <q-page padding>
    <h5>Hello Tester</h5>
    <div class="header-section">
      <h4>Bug List</h4>
      <q-btn label="add task" color="primary" @click="showAddBugDialog = true" />
    </div>
    <div class="row">
      <q-select
        v-model="filterStatus"
        clearable
        @update:model-value="applyFilter"
        :options="statusOptions"
        class="col-6 q-pl-sm"
        style="border: 1px solid black"
        label="Filter By Status"
      />
      <q-select
        v-model="filterPriority"
        clearable
        @update:model-value="applyFilter"
        :options="priorityOptions"
        class="col-6 q-pl-sm"
        style="border: 1px solid black"
        label="Filter By Priority"
      />
    </div>
    <div class="search">
      <q-item-section side top>
      <input 
        type="text" 
        placeholder="Search by title" 
        v-model="searchTitle" 
        @input="filterBugs" 
        style="width:50%; padding:10px; margin-bottom:10px;"
      >
      </q-item-section>
    </div>
    
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
      </q-item-section>

      <q-item-section side>
        <q-select
          v-model="bug.priority"
          :options="priorityOptions"
          dense
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
            <q-input v-model="selectedBug.title" label="Title" readonly />
            <q-input v-model="selectedBug.description" label="Description" type="textarea" readonly />
            <q-item-label>Priority: {{ selectedBug.priority }}</q-item-label>
            <q-item-label v-if="selectedBug.dueDate">
              Due Date: From {{ selectedBug.dueDate?.from || 'N/A' }} To {{ selectedBug.dueDate?.to || 'N/A' }}
            </q-item-label>
            <q-item-label>
              Days Left: 
              <span v-if="selectedBug.daysLeft > 0">{{ selectedBug.daysLeft }} day(s) left</span>
              <span v-else class="overdue">Overdue by {{ selectedBug.overdue }} day(s)</span>
            </q-item-label>
            <!-- Editable comment section -->
            <q-input v-model="selectedBug.comment" label="Comment" type="textarea" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
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

    <!-- Add Bug Dialog -->
    <q-dialog v-model="showAddBugDialog">
      <q-card>
        <q-card-section>
          <div>
            <q-input v-model="newBug.title" label="Title" />
            <q-input v-model="newBug.description" label="Description" type="textarea" />
            <q-select
              v-model="newBug.priority"
              :options="priorityOptions"
              label="Priority"
              dense
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="showAddBugDialog = false" />
          <q-btn flat label="Add Bug" @click="addNewBug" />
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
const showAddBugDialog = ref(false);
const selectedBug = ref(null);
const searchTitle = ref('');
const newBug = ref({ title: '', description: '', priority: 'Low' });

// Dropdown filter values
const filterStatus = ref(null);
const filterPriority = ref(null);

const statusOptions = [ 'completed', 'pending'];
const priorityOptions = [ 'High', 'Med', 'Low'];

const filteredBugs = computed(() => {
  let bugs = bugStore.bugs;

  if (searchTitle.value) {
    bugs = bugs.filter(bug => bug.title.toLowerCase().includes(searchTitle.value.toLowerCase()));
  }

  if (filterStatus.value && filterStatus.value !== 'all') {
    if (filterStatus.value === 'completed') {
      bugs = bugs.filter(bug => bug.completed);
    } else if (filterStatus.value === 'pending') {
      bugs = bugs.filter(bug => !bug.completed);
    }
  }

  if (filterPriority.value && filterPriority.value !== 'all') {
    bugs = bugs.filter(bug => bug.priority === filterPriority.value);
  }

  return bugs;
});

function viewBugDetails(bug) {
  selectedBug.value = { ...bug };
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
    showViewDialog.value = false;
  }
}

function addNewBug() {
  bugStore.addBug(newBug.value);
  newBug.value = { title: '', description: '', priority: 'Low' };
  showAddBugDialog.value = false;
}

function applyFilter() {
  // Trigger the computed property to recalculate based on filters
  filteredBugs.value;
}

onMounted(() => {
  bugStore.fetchBugs();
});
</script>

<style scoped>
h4 {
  color: blueviolet;
  text-align: center;
}

h5 {
  width: 100%;
  text-align: center;
  background-color: lavender;
  margin: 0;
  padding: 20px;
  color: blueviolet;
  font-weight: 500;
  font-size: 1cm;
}

.search{
  margin-top: 10px;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 4px;
}

.buttons button {
  background-color: lavender;
  border-radius: 20px;
  border: none;
  outline: none;
  cursor: pointer;
  color: grey;
  flex: 1;
  min-width: 80px;
  text-align: center;
}

.buttons button:hover {
  background-color: blueviolet;
  color: white;
}

.q-dialog--large {
  max-width: 70vw;
  max-height: 90vh;
  width: 90vw;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bug-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bg-lightgreen {
  background-color: rgb(178, 254, 178);
}

.bg-lavender {
  background-color: lavender;
}

.q-item-label {
  margin-bottom: 10px;
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
