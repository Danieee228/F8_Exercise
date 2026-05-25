function setupTabs(containerSelector) {
  const ACTIVE_CLASS = "active";
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const storageKey = "activeTab_" + containerSelector;
  const tabButtons = container.querySelectorAll(".js-tab-btn");
  const tabContents = container.querySelectorAll(".js-tab-content");
  // Load active tab from localStorage
  const savedActiveTab = localStorage.getItem(storageKey);
  if (!savedActiveTab) {
    // If no saved tab, activate the first one by default
    if (tabButtons.length > 0 && tabContents.length > 0) {
      tabButtons[0].classList.add(ACTIVE_CLASS);
      tabContents[0].classList.add(ACTIVE_CLASS);
    }
  } else {
    const targetButton = container.querySelector(
      `.js-tab-btn[data-target="${savedActiveTab}"]`,
    );
    const targetContent = container.querySelector(`#${savedActiveTab}`);
    if (!targetButton || !targetContent) {
      // If saved tab is not found, activate the first one by default
      if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons[0].classList.add(ACTIVE_CLASS);
        tabContents[0].classList.add(ACTIVE_CLASS);
      }
    } else {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove(ACTIVE_CLASS));
      tabContents.forEach((content) => content.classList.remove(ACTIVE_CLASS));
      // Add active class to saved button and content
      targetButton.classList.add(ACTIVE_CLASS);
      targetContent.classList.add(ACTIVE_CLASS);
    }
  }

  // Handle click tab button
  container.addEventListener("click", function (event) {
    if (event.target.classList.contains("js-tab-btn")) {
      const targetId = event.target.dataset.target;
      const targetContent = container.querySelector(`#${targetId}`);
      if (!targetContent) return;
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove(ACTIVE_CLASS));
      tabContents.forEach((content) => content.classList.remove(ACTIVE_CLASS));
      // Add active class to clicked button and content
      event.target.classList.add(ACTIVE_CLASS);
      targetContent.classList.add(ACTIVE_CLASS);
      // Save active tab to localStorage
      localStorage.setItem(storageKey, targetId);
    }
  });

  // Handle keyboard navigation
  document.addEventListener("keydown", function (event) {
    const keyNumber = parseInt(event.key);
    if (keyNumber >= 1 && keyNumber <= tabButtons.length) {
      const targetIndex = keyNumber - 1;
      tabButtons[targetIndex].click();
    }
  });
}

setupTabs(".tabs-container");
