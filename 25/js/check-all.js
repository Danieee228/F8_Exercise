function setupCheckAll(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const checkAll = container.querySelector(".js-check-all");
  const countCheckboxes = container.querySelector(".js-checked-count");
  const checkboxes = container.querySelectorAll(".js-check-item");
  // Handle check all change
  checkAll.addEventListener("change", function (event) {
    const isChecked = event.target.checked;
    checkboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
    updateCheckedCount();
  });
  // Handle counter checked
  function updateCheckedCount() {
    const checkedCount = Array.from(checkboxes).filter(
      (checkbox) => checkbox.checked,
    ).length;
    countCheckboxes.textContent = `Đã chọn: ${checkedCount}`;
    if (checkedCount === 0) {
      checkAll.checked = false;
      checkAll.indeterminate = false;
    } else if (checkedCount === checkboxes.length) {
      checkAll.checked = true;
      checkAll.indeterminate = false;
    } else {
      checkAll.checked = false;
      checkAll.indeterminate = true;
    }
  }
  // Handle check item change
  container.addEventListener("change", function (event) {
    if (event.target.classList.contains("js-check-item")) {
      updateCheckedCount();
    }
  });
}

setupCheckAll(".check-all-container");
