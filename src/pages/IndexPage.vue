<template>
  <q-page class="flex flex-center">
    <div class="login-section">
      <img
        alt="logo"
        src="~assets/bug-reporting-logo.png"
        class="logo"
      >
      <form @submit.prevent="handleSubmit">
        <label>Username:</label>
        <input type="text" required v-model="username">
        <label>Password:</label>
        <input type="password" required v-model="password">
        <div class="submit">
          <button>Login</button>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/UserStore';

defineOptions({
  name: 'IndexPage'
});

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();
const userStore = useUserStore();

const handleSubmit = () => {
  console.log('Username:', username.value);
  console.log('Password:', password.value);
  const route = userStore.login(username.value, password.value);
  if (route) {
    router.push(route);
  } else {
    errorMessage.value = userStore.errorMessage;
  }
};
</script>

<style scoped>
.login-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-direction: column;
}

.logo {
  width: 400px;
  height: 400px;
}

form {
  background: lavender;
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
}

label {
  color: blueviolet;
  display: inline-block;
  margin: 15px 0 10px;
  font-size: 0.9em;
  text-transform: uppercase;
  font-weight: bold;
}

input {
  display: block;
  padding: 10px;
  border: none;
  border-bottom: 1px solid gray;
  color: grey;
}

button {
  background: blueviolet;
  border: 0;
  padding: 10px 20px;
  margin-top: 20px;
  color: white;
  border-radius: 20px;
}

.error {
  color: red;
  margin-top: 10px;
}

@media (min-width: 600px) {
  .login-section {
    flex-direction: row;
    justify-content: center;
  }

  .logo {
    max-width: 200px;
  }

  form {
    padding: 40px;
    max-width: 420px;
  }

  label {
    font-size: 1em;
  }

  button {
    width: auto;
  }
}
</style>
