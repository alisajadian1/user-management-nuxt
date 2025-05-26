<script setup lang="ts">
interface Props {
  show: boolean;
  userName?: string;
}

interface Emits {
  (e: "close"): void;
  (e: "confirm"): void;
}

const props = withDefaults(defineProps<Props>(), {
  userName: "این کاربر",
});

const emit = defineEmits<Emits>();

const closeModal = () => {
  emit("close");
};

const confirmDelete = () => {
  emit("confirm");
  closeModal();
};
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-gradient"></div>

      <div class="modal-header">
        <div class="modal-info">
          <div class="vertical-accent"></div>
          <div class="modal-details">
            <h2 class="modal-title">حذف کاربر</h2>
            <p class="modal-subtitle">تأیید حذف</p>
          </div>
        </div>

        <button @click="closeModal" class="close-btn" title="بستن">
          <Icon name="material-symbols:close" />
        </button>
      </div>

      <div class="modal-body">
        <div class="warning-icon">
          <Icon name="material-symbols:warning" />
        </div>

        <div class="confirmation-text">
          <p class="main-question">
            آیا می‌خواهید کاربر
            <span class="user-name">{{ userName }}</span>
            را حذف کنید؟
          </p>
          <p class="warning-text">
            این عمل قابل بازگشت نیست و تمام اطلاعات کاربر حذف خواهد شد.
          </p>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="action-btn cancel-btn">
          انصراف
        </button>
        <button @click="confirmDelete" class="action-btn delete-btn">
          حذف کاربر
        </button>
      </div>
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
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 1rem;
  background: var(--primary-color);
  border-radius: var(--border-radius);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--accent-color);
  overflow: hidden;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #fd6a6a 0%, #ff4444 50%, #cc0000 100%);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #ffffff05;
}

.modal-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vertical-accent {
  height: 30px;
  width: 3px;
  background: linear-gradient(180deg, #fd6a6a 0%, #ff4444 100%);
  border-radius: 2px;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  text-shadow: 0 2px 4px black;
}

.modal-subtitle {
  font-size: 0.75rem;
  font-weight: 400;
  color: #0d0d0d;
  margin: 0;
  padding: 0.125rem 0.5rem;
  background: #fd6a6a;
  border: 1px solid var(--accent-color);
  border-radius: 0.75rem;
  display: inline-block;
  width: fit-content;
}

.close-btn {
  background: #ffffff0d;
  border: 1px solid #ffffff1a;
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 36px;
  height: 36px;
  color: #fd6a6a;
}

.close-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px #fd6a6a34;
}

.modal-body {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.warning-icon {
  font-size: 2.5rem;
  color: #fd6a6a;
  animation: pulse 2s infinite;
}

.confirmation-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-question {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  line-height: 1.6;
}

.user-name {
  color: #fea463;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.warning-text {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--accent-color);
  margin: 0;
  line-height: 1.5;
  opacity: 0.8;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: #ffffff05;
  justify-content: flex-end;
}

.action-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  min-width: 80px;
}

.cancel-btn {
  background: #ffffff0d;
  color: var(--text-color);
  border-color: var(--accent-color);
}

.cancel-btn:hover {
  background: #ffffff15;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
}

.delete-btn {
  background: #fd6a6a;
  color: white;
  border-color: var(--accent-color);
}

.delete-btn:hover {
  background: #ff5555;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px #fd6a6a34;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .modal-container {
    margin: 0.5rem;
    max-width: none;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .modal-body {
    padding: 1.5rem 1rem;
  }

  .warning-icon {
    font-size: 3rem;
  }

  .main-question {
    font-size: 1rem;
  }

  .modal-footer {
    padding: 1rem;
    flex-direction: column-reverse;
  }

  .action-btn {
    width: 100%;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .modal-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .close-btn {
    align-self: flex-end;
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .modal-info {
    width: 100%;
  }

  .warning-icon {
    font-size: 2.5rem;
  }

  .main-question {
    font-size: 0.95rem;
  }
}
</style>
