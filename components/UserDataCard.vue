<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

//  props to receive user data
const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

//  emits for parent communication
const emit = defineEmits(["edit-user", "delete-user"]);

const openEditModal = (user) => {
  console.log("Editing user:", user);
  emit("edit-user", user);
};

const openDeleteModal = (user) => {
  emit("delete-user", user);
};

//  get user full name
const getUserFullName = () => {
  const firstName = props.user?.firstName;
  const lastName = props.user?.lastName;
  return `${firstName} ${lastName}`.trim() || "نام کاربر";
};

// get account type
const getAccountType = () => {
  // return props.user?.accountType || props.user?.type || "کاربر عادی";
  const type = props.user?.accountType;
  if (type === "normal") return "عادی";
  if (type === "vip") return "ویژه";
  if (type === "manager") return "مدیر";
  return "نامشخص";
};

//  get gender
const getGenderDisplay = () => {
  const gender = props.user?.gender;
  if (gender === "male" || gender === "مرد") return "آقا";
  if (gender === "female" || gender === "زن") return "خانم";
  return gender || "نامشخص";
};
</script>

<template>
  <div class="user-card-wrapper">
    <section class="user-data-card">
      <div class="card-gradient"></div>

      <div class="user-header">
        <div class="user-info">
          <div class="vertical-accent"></div>
          <div class="user-details">
            <h1 class="card-title">{{ getUserFullName() }}</h1>
            <p class="account-type">{{ getAccountType() }}</p>
          </div>
        </div>

        <div class="action-buttons">
          <button
            @click="openEditModal(user)"
            class="action-btn edit-btn"
            title="ویرایش کاربر"
          >
            <Icon name="ep:edit" />
          </button>
          <button
            @click="openDeleteModal(user)"
            class="action-btn delete-btn"
            title="حذف کاربر"
          >
            <Icon name="uiw:user-delete" />
          </button>
        </div>
      </div>

      <div class="user-body">
        <div class="user-data-grid">
          <div class="user-data-item">
            <span class="data-label">ایمیل:</span>
            <span class="data-value">{{ user.email || "ثبت نشده" }}</span>
          </div>
          <div class="user-data-item">
            <span class="data-label">جنسیت:</span>
            <span class="data-value">{{ getGenderDisplay() }}</span>
          </div>
          <div class="user-data-item">
            <span class="data-label">تلفن همراه:</span>
            <span class="data-value">{{ user.mobile }}</span>
          </div>
          <div class="user-data-item">
            <span class="data-label">تلفن ثابت:</span>
            <span class="data-value">{{ user.phone || "ثبت نشده" }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.user-card-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.user-data-card {
  position: relative;
  width: 100%;
  min-height: 200px;
  background: var(--primary-color);
  border-radius: var(--border-radius);
  box-shadow: 0 6px 15px -3px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--accent-color);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-data-card:hover {
  transform: translateY(-2px);
}

.card-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #ffffff05;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vertical-accent {
  height: 40px;
  width: 3px;
  background: linear-gradient(180deg, #9f7cff 0%, #fea463 100%);
  border-radius: 2px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  text-shadow: 0 2px 4px black;
}

.account-type {
  font-size: 0.5rem;
  font-weight: 400;
  color: #0d0d0d;
  margin: 0;
  padding: 0.125rem 0.5rem;
  background: #9f7cff;
  border: 1px solid var(--accent-color);
  border-radius: 0.75rem;
  display: inline-block;
  width: fit-content;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: #ffffff0d;
  border: 1px solid #ffffff1a;
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 36px;
  height: 36px;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.edit-btn {
  color: #fea463;
  border-color: #fea4634e;
}

.edit-btn:hover {
  box-shadow: 0 6px 12px #fea4634e;
}

.delete-btn {
  color: #fd6a6a;
  border-color: #fd6a6a34;
}

.delete-btn:hover {
  box-shadow: 0 6px 12px #fd6a6a34;
}

.user-body {
  padding: 1rem;
}

.user-data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.user-data-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.user-data-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.data-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-color);
}

.data-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  line-height: 1.4;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .user-card-wrapper {
    margin: 0.5rem;
  }

  .user-data-card {
    border-radius: 0.75rem;
  }

  .user-header {
    padding: 0.75rem;
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .user-info {
    width: 100%;
  }

  .action-buttons {
    align-self: flex-end;
  }

  .card-title {
    font-size: 1rem;
  }

  .user-body {
    padding: 0.75rem;
  }

  .user-data-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .user-data-item {
    padding: 0.5rem;
  }

  .vertical-accent {
    height: 35px;
    width: 3px;
  }
}

@media (max-width: 480px) {
  .user-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .user-info {
    gap: 0.75rem;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .account-type {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
  }

  .action-buttons {
    gap: 0.25rem;
  }

  .action-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .vertical-accent {
    height: 45px;
  }
}

/* Animation  */
.user-data-item {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.user-data-item:nth-child(1) {
  animation-delay: 0.1s;
}
.user-data-item:nth-child(2) {
  animation-delay: 0.2s;
}
.user-data-item:nth-child(3) {
  animation-delay: 0.3s;
}
.user-data-item:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
