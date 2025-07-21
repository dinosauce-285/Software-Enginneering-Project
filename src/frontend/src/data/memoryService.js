// memoryService.js

// Load memories từ localStorage
export const loadMemories = () => {
  const stored = localStorage.getItem("memories");
  return stored ? JSON.parse(stored) : [];
};

// Lưu memories vào localStorage
export const saveMemory = (newMemory) => {
  const current = loadMemories();
  current.push(newMemory);
  localStorage.setItem("memories", JSON.stringify(current));
};
