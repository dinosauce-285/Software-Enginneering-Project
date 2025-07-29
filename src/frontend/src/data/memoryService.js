// memoryService.js

export const loadMemories = () => {
  const stored = localStorage.getItem("memories");
  return stored ? JSON.parse(stored) : [];
};


export const saveMemory = (newMemory) => {
  const current = loadMemories();
  current.push(newMemory);
  localStorage.setItem("memories", JSON.stringify(current));
};
