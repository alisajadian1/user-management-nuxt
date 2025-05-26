<script setup lang="ts">
import { computed, ref, watch, defineProps, defineEmits } from "vue";

import {
  firstError,
  validateRequiredField,
  validateLength,
  validateMobile,
  validatePhone,
  validateGender,
  validateAccountType,
} from "~/utils/FormValidation";

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  phone?: string;
  gender: string;
  accountType: string;
}

interface Props {
  show: boolean;
  mode: "add" | "edit";
  user?: User | null;
}

interface Emits {
  close: [];
  userSaved: [user: User];
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
});

const emit = defineEmits<Emits>();

// Form reactive data
const formData = ref<User>({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  phone: "",
  gender: "",
  accountType: "",
});

// Define resetForm function
const resetForm = () => {
  formData.value = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    phone: "",
    gender: "",
    accountType: "",
  };
};

// Form validation
const errors = computed(() => ({
  firstName: firstError([
    validateRequiredField(formData.value.firstName, "نام الزامی است"),
    validateLength(
      formData.value.firstName,
      3,
      "نام باید دارای حداقل 3 کارکتر باشد"
    ),
  ]),
  lastName: firstError([
    validateRequiredField(formData.value.lastName, "نام خانوادگی الزامی است"),
    validateLength(
      formData.value.lastName,
      3,
      "نام خانوادگی باید دارای حداقل 3 کارکتر باشد"
    ),
  ]),
  email: firstError([
    validateRequiredField(formData.value.lastName, "ایمیل  الزامی است"),
    validateLength(
      formData.value.lastName,
      10,
      "ایمیل باید دارای حداقل 10 کارکتر باشد"
    ),
  ]),
  mobile: firstError([
    validateRequiredField(formData.value.mobile, "شماره موبایل الزامی است"),
    validateMobile(formData.value.mobile),
  ]),
  phone: formData.value.phone
    ? firstError([validatePhone(formData.value.phone)])
    : null,
  gender: firstError([
    validateGender(formData.value.gender, "انتخاب جنسیت الزامی است"),
  ]),
  accountType: firstError([
    validateAccountType(
      formData.value.accountType,
      "انتخاب نوع حساب کاربری الزامی است"
    ),
  ]),
}));

// Check if form is valid
const isFormValid = computed(() => {
  return (
    !errors.value.firstName &&
    !errors.value.lastName &&
    !errors.value.email &&
    !errors.value.mobile &&
    !errors.value.phone &&
    !errors.value.gender &&
    !errors.value.accountType
  );
});

// Watch for prop changes to populate form
watch(
  () => [props.user, props.mode, props.show],
  ([newUser, newMode, isShow]) => {
    if (isShow) {
      if (newMode === "edit" && newUser) {
        formData.value = { ...newUser };
      } else if (newMode === "add") {
        resetForm();
      }
    }
  },
  { immediate: true, deep: true }
);

// localStorage functions
const getUsersFromStorage = (): User[] => {
  try {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

const saveUsersToStorage = (users: User[]): void => {
  try {
    localStorage.setItem("users", JSON.stringify(users));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const closeModal = () => {
  emit("close");
};

const handleSubmit = () => {
  if (!isFormValid.value) {
    return;
  }

  const userData = { ...formData.value };
  const users = getUsersFromStorage();

  if (props.mode === "add") {
    // Add new user
    userData.id =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    users.push(userData);
  } else if (props.mode === "edit" && props.user?.id) {
    // Edit  user
    userData.id = props.user.id;
    const userIndex = users.findIndex((u) => u.id === props.user?.id);
    if (userIndex !== -1) {
      users[userIndex] = userData;
    }
  }

  // Save to localStorage
  saveUsersToStorage(users);

  // Emit event to parent
  emit("userSaved", userData);
};
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          {{ mode === "add" ? "افزودن کاربر جدید" : "ویرایش کاربر" }}
        </h2>
        <button @click="closeModal" class="close-btn" type="button">
          <Icon name="material-symbols:close" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Personal Information -->
        <div class="form-row">
          <div class="form-group">
            <label>نام:</label>
            <input
              v-model="formData.firstName"
              type="text"
              class="form-input"
              :class="{ error: errors.firstName }"
              placeholder="مثال: رضا"
            />
            <span v-if="errors.firstName" class="error-text">{{
              errors.firstName
            }}</span>
          </div>

          <div class="form-group">
            <label>نام خانوادگی:</label>
            <input
              v-model="formData.lastName"
              type="text"
              class="form-input"
              :class="{ error: errors.lastName }"
              placeholder="مثال: رضایی"
            />
            <span v-if="errors.lastName" class="error-text">{{
              errors.lastName
            }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>ایمیل:</label>
          <input
            v-model="formData.email"
            type="email"
            class="form-input"
            placeholder="example@gmail.com"
          />
        </div>


        <div class="form-row">
          <div class="form-group">
            <label>تلفن همراه:</label>
            <input
              v-model="formData.mobile"
              type="tel"
              class="form-input"
              :class="{ error: errors.mobile }"
              placeholder="09xxxxxxxxx"
            />
            <span v-if="errors.mobile" class="error-text">{{
              errors.mobile
            }}</span>
          </div>

          <div class="form-group">
            <label>تلفن ثابت:</label>
            <input
              v-model="formData.phone"
              type="tel"
              class="form-input"
              :class="{ error: errors.phone }"
              placeholder="021xxxxxxxx"
            />
            <span v-if="errors.phone" class="error-text">{{
              errors.phone
            }}</span>
          </div>
        </div>

        <!-- Gender and Account Type -->
        <div class="form-row">
          <div class="form-group">
            <label>جنسیت:</label>
            <select
              v-model="formData.gender"
              class="form-select"
              :class="{ error: errors.gender }"
            >
              <option value="">انتخاب کنید</option>
              <option value="male">آقا</option>
              <option value="female">خانم</option>
            </select>
            <span v-if="errors.gender" class="error-text">{{
              errors.gender
            }}</span>
          </div>

          <div class="form-group">
            <label>نوع حساب کاربری:</label>
            <select
              v-model="formData.accountType"
              class="form-select"
              :class="{ error: errors.accountType }"
            >
              <option value="">انتخاب کنید</option>
              <option value="normal">عادی</option>
              <option value="vip">ویژه</option>
              <option value="admin">مدیر</option>
            </select>
            <span v-if="errors.accountType" class="error-text">{{
              errors.accountType
            }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="closeModal" class="btn btn-cancel">
            انصراف
          </button>
          <button
            type="submit"
            class="btn btn-save"
            :disabled="!isFormValid"
            :class="{ disabled: !isFormValid }"
          >
            {{ mode === "add" ? "افزودن" : "ذخیره تغییرات" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: var(--primary-color);
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--accent-color);
  animation: slideUp 0.3s ease-out;
  margin: 1rem;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--accent-color);
  background: var(--accent-color);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--primary-color);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.close-btn:hover {
  color: #fd6a6a;
  background: rgba(253, 106, 106, 0.1);
}

.modal-body {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.875rem;
}

.form-input,
.form-select {
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--accent-color);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: var(--primary-color);
  color: var(--text-color);
  font-family: inherit;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #9f7cff;
  box-shadow: 0 0 0 2px rgba(159, 124, 255, 0.2);
}

.form-input.error,
.form-select.error {
  border-color: #fd6a6a;
  box-shadow: 0 0 0 2px rgba(253, 106, 106, 0.2);
}

.form-input::placeholder {
  color: var(--accent-color);
  opacity: 0.7;
}

.form-select {
  cursor: pointer;
}

.form-select option {
  background-color: var(--primary-color);
  color: var(--text-color);
}

.error-text {
  color: #fd6a6a;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn {
  font: inherit;
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.btn-cancel {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  border: 1px solid var(--accent-color);
}

.btn-cancel:hover {
  background-color: #fd6a6a;
  color: white;
  border-color: #fd6a6a;
}

.btn-save {
  background: #059669;
  color: white;
}

.btn-save:hover:not(.disabled) {
  background: #047857;
}

.btn-save.disabled {
  background: #6b7280;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn:active:not(.disabled) {
  transform: translateY(1px);
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .modal-container {
    max-width: 95vw;
    max-height: 90vh;
    margin: 0.5rem;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-title {
    font-size: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .modal-actions {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  .btn {
    width: 100%;
    padding: 0.75rem;
  }
}

/* Scrollbar styling */
.modal-container::-webkit-scrollbar {
  width: 4px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
}

.modal-container::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 2px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #9f7cff;
}
</style>
