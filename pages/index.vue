<script setup>
import { ref, onMounted } from "vue";

const users = ref([]);
const isLoading = ref(true);
const error = ref(null);

const modalMode = ref("add");
const showModal = ref(false);
const selectedUser = ref(null);

// Delete modal state
const showDeleteModal = ref(false);
const userToDelete = ref(null);

// Load users
const loadUsersFromStorage = () => {
  try {
    isLoading.value = true;
    const storedUsers = localStorage.getItem("users");

    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      users.value = Array.isArray(parsedUsers) ? parsedUsers : [parsedUsers];
    } else {
      users.value = [];
    }

    error.value = null;
  } catch (err) {
    console.error("Error loading users from localStorage:", err);
    error.value = "خطا در بارگذاری اطلاعات کاربران";
    users.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Save user
const saveUsersToStorage = () => {
  try {
    localStorage.setItem("users", JSON.stringify(users.value));
  } catch (err) {
    console.error("Error saving users to localStorage:", err);
    error.value = "خطا در ذخیره اطلاعات کاربران";
  }
};

//   edit modal open
const handleEditUser = (user) => {
  console.log("Editing user:", user);
  modalMode.value = "edit";
  selectedUser.value = user;
  showModal.value = true;
};

//  delete modal open
const handleDeleteUser = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

//  delete modal close
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

// confirm  deletion
const confirmDelete = () => {
  if (!userToDelete.value) return;

  try {
    const userIndex = users.value.findIndex(
      (u) =>
        u.id === userToDelete.value.id ||
        (u.email === userToDelete.value.email &&
          u.firstName === userToDelete.value.firstName)
    );

    if (userIndex !== -1) {
      users.value.splice(userIndex, 1);
      saveUsersToStorage();
      console.log("User deleted successfully");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    error.value = "خطا در حذف کاربر";
  } finally {
    closeDeleteModal();
  }
};

// Get user full name for delete modal
const getUserFullName = (user) => {
  if (!user) return "کاربر";
  const firstName = user.firstName;
  const lastName = user.lastName;
  return `${firstName} ${lastName}`;
};

// Modal close
const handleModalClose = () => {
  showModal.value = false;
  selectedUser.value = null;
};

// User saved handler
const handleUserSaved = (userData) => {
  if (modalMode.value === "add") {
    users.value.push(userData);
  } else if (modalMode.value === "edit") {
    const userIndex = users.value.findIndex((u) => u.id === userData.id);
    if (userIndex !== -1) {
      users.value[userIndex] = userData;
    }
  }
  saveUsersToStorage();
  showModal.value = false;
  selectedUser.value = null;
};

// Refresh data
const refreshData = () => {
  loadUsersFromStorage();
};

// Add new user
const addUser = (newUser) => {
  try {
    if (!newUser.id) {
      newUser.id = Date.now() + Math.random();
    }

    users.value.push(newUser);
    saveUsersToStorage();
    console.log("User added successfully");
  } catch (err) {
    console.error("Error adding user:", err);
    error.value = "خطا در افزودن کاربر";
  }
};

// Update existing user
const updateUser = (updatedUser) => {
  try {
    const userIndex = users.value.findIndex(
      (u) =>
        u.id === updatedUser.id ||
        (u.email === updatedUser.email && u.firstName === updatedUser.firstName)
    );

    if (userIndex !== -1) {
      users.value[userIndex] = { ...users.value[userIndex], ...updatedUser };
      saveUsersToStorage();
      console.log("User updated successfully");
    }
  } catch (err) {
    console.error("Error updating user:", err);
    error.value = "خطا در بروزرسانی کاربر";
  }
};

onMounted(() => {
  loadUsersFromStorage();
});

defineExpose({
  refreshData,
  addUser,
  updateUser,
  users,
});

const openAddModal = () => {
  modalMode.value = "add";
  selectedUser.value = null;
  showModal.value = true;
};
</script>

<template>
  <div class="users-container">
    <!-- Loading  -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>در حال بارگذاری اطلاعات ...</p>
    </div>

    <!-- error message -->
    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <Icon name="material-symbols:error" />
        <p>{{ error }}</p>
        <button @click="refreshData" class="retry-btn">تلاش مجدد</button>
      </div>
    </div>

    <!-- no user in localstorage -->
    <div v-else-if="users.length === 0" class="empty-container">
      <div class="empty-message">
        <Icon name="material-symbols:person-off" />
        <h3>هیچ کاربری یافت نشد</h3>
        <p>اطلاعات کاربران در حافظه محلی مرورگر موجود نیست</p>
      </div>
    </div>

    <!-- Users cart -->
    <div v-else class="users-grid">
      <UserDataCard
        v-for="(user, index) in users"
        :key="user.id || `user-${index}`"
        :user="user"
        class="data-card"
        @edit-user="handleEditUser"
        @delete-user="handleDeleteUser"
      />
    </div>

    <!-- add new user button -->
    <button
      @click="openAddModal"
      class="fab-add-user"
      title="افزودن کاربر جدید"
    >
      <Icon name="material-symbols:add" />
    </button>

    <!--  add and edit modal -->
    <userModal
      :show="showModal"
      :mode="modalMode"
      :user="selectedUser"
      @close="handleModalClose"
      @user-saved="handleUserSaved"
    />

    <!--  delete confirmation  -->
    <DeleteModal
      :show="showDeleteModal"
      :userName="getUserFullName(userToDelete)"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.users-container {
  min-height: 100vh;
  padding: 1rem;
  position: relative;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 1.5rem;
  justify-items: center;
  padding: 1rem 0;
}

.data-card {
  width: 100%;
  max-width: 600px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  color: var(--text-color);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(159, 124, 255, 0.3);
  border-top: 3px solid #9f7cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: rgba(253, 106, 106, 0.1);
  border: 1px solid rgba(253, 106, 106, 0.3);
  border-radius: 1rem;
  color: #fd6a6a;
  text-align: center;
}

.error-message svg {
  font-size: 3rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #fd6a6a;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #e55555;
  transform: translateY(-2px);
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  color: var(--text-color);
  text-align: center;
}

.empty-message svg {
  font-size: 4rem;
  color: var(--accent-color);
}

.empty-message h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.empty-message p {
  margin: 0;
  opacity: 0.7;
}

.fab-add-user {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #9f7cff, #fea463);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(159, 124, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab-add-user:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(159, 124, 255, 0.6);
}

.fab-add-user:active {
  transform: translateY(-1px) scale(0.98);
}

/* Responsive  */
@media (max-width: 768px) {
  .users-container {
    padding: 0.5rem;
  }

  .users-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .fab-add-user {
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .users-grid {
    padding: 0.5rem 0;
  }

  .error-message,
  .empty-message {
    margin: 0 1rem;
    padding: 1.5rem;
  }
}

/* Animation  */
.data-card {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.data-card:nth-child(1) {
  animation-delay: 0.1s;
}
.data-card:nth-child(2) {
  animation-delay: 0.2s;
}
.data-card:nth-child(3) {
  animation-delay: 0.3s;
}
.data-card:nth-child(4) {
  animation-delay: 0.4s;
}
.data-card:nth-child(5) {
  animation-delay: 0.5s;
}
.data-card:nth-child(6) {
  animation-delay: 0.6s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
