<template>
  <q-page padding>
    <h5>Hello Developer</h5>
    <h4>Bug List</h4>
    <div class="buttons">
      <button @click="showAll">All</button>
      <button @click="filterCompleted">Completed</button>
      <button @click="filterPending">Pending</button>
      <button @click="sortByPriority">Priority</button>
    </div>
    <div>
      <div v-if="assignedBugs.length > 0">
        <q-item 
          v-for="bug in assignedBugs"
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
          <q-card class=".q-dialog--large">
            <q-card-section>
              <q-input v-model="selectedBug.title" label="Title" readonly />
              <q-input v-model="selectedBug.description" label="Description" type="textarea" readonly />
              <q-item-label>Priority: {{ selectedBug.priority }}</q-item-label>
              <q-item-label>Status: {{ selectedBug.completed ? 'Completed' : 'Pending' }}</q-item-label>
              <q-item-label>Assigned To: {{ selectedBug.assignedTo }}</q-item-label>
              <div v-if="selectedBug.dueDate">
                <q-item-label>Due Date: From {{ selectedBug.dueDate.from }} To {{ selectedBug.dueDate.to }}</q-item-label>
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
const assignedBugs = computed(() => developerStore.filteredBugs);

const showViewDialog = ref(false);
const showDateDialog = ref(false);
const selectedBug = ref(null);
const selectedDateRange = ref(null);

function viewBugDetails(bug) {
  selectedBug.value = { ...bug };  // Create a copy of the bug object
  showViewDialog.value = true;
}

function saveComment(bug) {
  const bugIndex = assignedBugs.value.findIndex(b => b.bugid === bug.bugid);
  if (bugIndex !== -1) {
    assignedBugs.value[bugIndex].comment = bug.comment;
  }
  showViewDialog.value = false;
}

function toggleCompletion(bug) {
  bug.completed = !bug.completed;
}

function showAll() {
  developerStore.setFilter('all');
}

function filterCompleted() {
  developerStore.setFilter('completed');
}

function filterPending() {
  developerStore.setFilter('pending');
}

function sortByPriority() {
  developerStore.setSort('priority');
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
</style>
