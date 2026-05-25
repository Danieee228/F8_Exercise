function setupTabs(containerSelector) {
  const ACTIVE_CLASS = "active";
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const storageKey = "activeTab_" + containerSelector;
  const tabButtons = container.querySelectorAll(".js-tab-btn");
  const tabContents = container.querySelectorAll(".js-tab-content");

  //Handle clear active class
  function clearAllActive() {
    tabButtons.forEach((btn) => btn.classList.remove(ACTIVE_CLASS));
    tabContents.forEach((content) => content.classList.remove(ACTIVE_CLASS));
  }

  // Handle activate tab
  function activateTab(btn, content) {
    clearAllActive();
    btn.classList.add(ACTIVE_CLASS);
    content.classList.add(ACTIVE_CLASS);
  }
  // Load active tab from localStorage
  const savedActiveTab = localStorage.getItem(storageKey);
  if (!savedActiveTab) {
    // If no saved tab, activate the first one by default
    if (tabButtons.length > 0 && tabContents.length > 0) {
      activateTab(tabButtons[0], tabContents[0]);
    }
  } else {
    const targetButton = container.querySelector(
      `.js-tab-btn[data-target="${savedActiveTab}"]`,
    );
    const targetContent = container.querySelector(`#${savedActiveTab}`);
    if (!targetButton || !targetContent) {
      // If saved tab is not found, activate the first one by default
      if (tabButtons.length > 0 && tabContents.length > 0) {
        activateTab(tabButtons[0], tabContents[0]);
      }
    } else {
      activateTab(targetButton, targetContent);
    }
  }

  // Handle click tab button
  container.addEventListener("click", function (event) {
    if (event.target.classList.contains("js-tab-btn")) {
      const targetId = event.target.dataset.target;
      const targetContent = container.querySelector(`#${targetId}`);
      if (!targetContent) return;
      // Add active class to clicked button and content
      activateTab(event.target, targetContent);
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
