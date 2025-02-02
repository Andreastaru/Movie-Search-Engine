export const handleBackdropClick = (event, onClose) => {
  if (event.target.classList.contains("custom-modal")) {
    onClose();
  }
};
