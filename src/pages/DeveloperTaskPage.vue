<template>
  <q-page padding>
    <h5>Hello Developer</h5>
    <h4>Bug List</h4>

    <!-- Filters -->
    <div class="row">
      <q-select
        v-model="filterStatus"
        clearable
        @update:model-value="applyFilters"
        :options="statusOptions"
        class="col-6 q-pl-sm"
        style="border: 1px solid black"
        label="Filter By Status"
      />
      <q-select
        v-model="filterPriority"
        clearable
        @update:model-value="applyFilters"
        :options="priorityOptions"
        class="col-6 q-pl-sm"
        style="border: 1px solid black"
        label="Filter By Priority"
      />
    </div>

    <!-- Filter Buttons -->
    <!-- <div class="buttons">
      <button @click="showAll">All</button>
      <button @click="filterCompleted">Completed</button>
      <button @click="filterPending">Pending</button>
      <button @click="filterByPriority('High')">High</button>
      <button @click="filterByPriority('Med')">Med</button>
      <button @click="filterByPriority('Low')">Low</button>
    </div> -->

    <div>
      <div v-if="filteredBugs.length > 0">
        <q-item 
          v-for="bug in filteredBugs"
          :key="bug.bugid"
          @click="toggleCompletion(bug)"
          :class="bug.completed ? 'bg-lightgreen' : 'bg-lavender'"
          clickable
          class="bug-card"
          v-ripple>
          
          <q-item-section side top>
            <q-checkbox v-model="bug.completed" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ bug.title }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn 
              icon="visibility"
              @click.stop="viewBugDetails(bug)" 
              dense 
              color="primary"
              rounded
            />
          </q-item-section>
        </q-item>

        <!-- Bug Details Dialog -->
        <q-dialog v-model="showViewDialog">
          <q-card class="q-dialog--large">
            <q-card-section>
              <q-input v-model="selectedBug.title" label="Title" readonly />
              <q-input v-model="selectedBug.description" label="Description" type="textarea" readonly />
              <q-item-label>Priority: {{ selectedBug.priority }}</q-item-label>
              <q-item-label>Status: {{ selectedBug.completed ? 'Completed' : 'Pending' }}</q-item-label>
              <q-item-label>Assigned To: {{ selectedBug.assignedTo }}</q-item-label>
              <div v-if="selectedBug.dueDate">
                <q-item-label>Due Date: From {{ selectedBug.dueDate.from }} To {{ selectedBug.dueDate.to }}</q-item-label>
                <q-item-label>
                  Days Left: 
                  <span v-if="daysLeft > 0">{{ daysLeft }} day(s) left</span>
                  <span v-else class="overdue">Overdue by {{ -daysLeft }} day(s)</span>
                </q-item-label>
              </div>
              <q-input v-model="selectedBug.comment" label="Comment" type="textarea" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Close" v-close-popup />
              <q-btn flat label="Save" @click="saveComment(selectedBug)" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Date Range Dialog -->
        <q-dialog v-model="showDateDialog">
          <q-card>
            <q-card-section>
              <q-date v-model="selectedDateRange" range />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Save" @click="saveDateRange" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
      <div v-else>
        <p>No tasks assigned to you.</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDeveloperStore } from '../stores/DeveloperStore';
import { useBugStore } from '../stores/BugStore';

const developerStore = useDeveloperStore();
const bugStore = useBugStore();

const showViewDialog = ref(false);
const showDateDialog = ref(false);
const selectedBug = ref(null);
const selectedDateRange = ref(null);

// Filters
const filterStatus = ref(null);
const filterPriority = ref(null);

const statusOptions = ['Pending', 'Completed'];
const priorityOptions = ['High', 'Med', 'Low'];

const filteredBugs = computed(() => {
  let bugs = developerStore.filteredBugs;

  // Apply status filter
  if (filterStatus.value) {
    if (filterStatus.value === 'Completed') {
      bugs = bugs.filter(bug => bug.completed);
    } else if (filterStatus.value === 'Pending') {
      bugs = bugs.filter(bug => !bug.completed);
    }
  }

  // Apply priority filter
  if (filterPriority.value) {
    bugs = bugs.filter(bug => bug.priority === filterPriority.value);
  }

  return bugs;
});

const daysLeft = computed(() => {
  if (!selectedBug.value || !selectedBug.value.dueDate || !selectedBug.value.dueDate.to) {
    return null;
  }
  const dueDate = new Date(selectedBug.value.dueDate.to);
  const currentDate = new Date();
  return Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
});

function viewBugDetails(bug) {
  selectedBug.value = { ...bug };  // Create a copy of the bug object
  showViewDialog.value = true;
}

function saveComment(bug) {
  const bugIndex = developerStore.filteredBugs.findIndex(b => b.bugid === bug.bugid);
  if (bugIndex !== -1) {
    developerStore.filteredBugs[bugIndex].comment = bug.comment;
  }
  showViewDialog.value = false;
}

function toggleCompletion(bug) {
  bug.completed = !bug.completed;
  bugStore.updateBug(bug); // Assuming updateBug is available in the store
}

function showAll() {
  filterStatus.value = null;
  filterPriority.value = null;
}

function filterCompleted() {
  filterStatus.value = 'Completed';
}

function filterPending() {
  filterStatus.value = 'Pending';
}

function filterByPriority(priority) {
  filterPriority.value = priority;
}

function saveDateRange() {
  if (selectedBug.value) {
    selectedBug.value.dueDate = selectedDateRange.value;
    showDateDialog.value = false;
    saveComment(selectedBug.value);
  }
}

function applyFilters() {
  // This function will be automatically triggered by the computed property
}
</script>


<style>
h4 {
  color: blueviolet;
  justify-content: center;
  display: flex;
  align-items: center;
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
/* .row{
  margin-bottom: 10px;
} */

.bug-card {
  display: flex;
  background: lavender;
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
}

.bg-lightgreen {
  background: rgb(178, 254, 178);
}

.bg-lavender {
  background: lavender;
}

.buttons {
  gap: 20px;
  display: flex;
  margin-bottom: 4px;
}

.buttons button {
  background-color: lavender;
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  outline: none;
  cursor: pointer;
  color: grey;
}

.buttons button:hover {
  background-color: blueviolet;
}

.q-dialog--large {
  width: 80vw; /* Adjust the width as needed */
  max-width: 900px; /* Max width for larger screens */
}

.overdue {
  color: red;
  font-weight: bold;
}
</style>
