// utils/domUtils.js
export const createElement = (tag, classes = '', attributes = {}) => {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  Object.entries(attributes).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
};

export const toggleClass = (element, className, condition) => {
  element.classList.toggle(className, condition);
};

export const setAttributes = (element, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};