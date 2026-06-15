let tree = [
  // --- 5 THƯ MỤC ROOT CÓ CHỨA THƯ MỤC CON ---
  {
    id: "f_src",
    type: "folder",
    name: "src",
    children: [
      {
        id: "f_components",
        type: "folder",
        name: "components",
        children: [
          { id: "fi_header", type: "file", name: "Header.js" },
          { id: "fi_footer", type: "file", name: "Footer.js" },
        ],
      },
      {
        id: "f_hooks",
        type: "folder",
        name: "hooks",
        children: [
          { id: "fi_useauth", type: "file", name: "useAuth.js" },
          { id: "fi_usefetch", type: "file", name: "useFetch.js" },
        ],
      },
      { id: "fi_app", type: "file", name: "App.js" },
      { id: "fi_index", type: "file", name: "index.js" },
    ],
  },
  {
    id: "f_public",
    type: "folder",
    name: "public",
    children: [
      {
        id: "f_assets",
        type: "folder",
        name: "assets",
        children: [
          { id: "fi_logo", type: "file", name: "logo.png" },
          { id: "fi_banner", type: "file", name: "banner.jpg" },
        ],
      },
      { id: "fi_favicon", type: "file", name: "favicon.ico" },
      { id: "fi_robots", type: "file", name: "robots.txt" },
    ],
  },
  {
    id: "f_config",
    type: "folder",
    name: "config",
    children: [
      {
        id: "f_env",
        type: "folder",
        name: "env",
        children: [
          { id: "fi_dev", type: "file", name: "dev.env" },
          { id: "fi_prod", type: "file", name: "prod.env" },
        ],
      },
      { id: "fi_webpack", type: "file", name: "webpack.config.js" },
      { id: "fi_babel", type: "file", name: "babel.config.js" },
    ],
  },
  {
    id: "f_utils",
    type: "folder",
    name: "utils",
    children: [
      {
        id: "f_formatters",
        type: "folder",
        name: "formatters",
        children: [
          { id: "fi_date", type: "file", name: "dateFormatter.js" },
          { id: "fi_currency", type: "file", name: "currency.js" },
        ],
      },
      { id: "fi_math", type: "file", name: "mathUtils.js" },
      { id: "fi_string", type: "file", name: "stringUtils.js" },
    ],
  },
  {
    id: "f_docs",
    type: "folder",
    name: "docs",
    children: [
      {
        id: "f_api",
        type: "folder",
        name: "api",
        children: [
          { id: "fi_auth_md", type: "file", name: "authentication.md" },
          { id: "fi_users_md", type: "file", name: "users.md" },
        ],
      },
      { id: "fi_setup", type: "file", name: "setup.md" },
      { id: "fi_deploy", type: "file", name: "deployment.md" },
    ],
  },

  // --- 4 THƯ MỤC ROOT KHÔNG CÓ THƯ MỤC CON (Chỉ có file) ---
  {
    id: "f_tests",
    type: "folder",
    name: "tests",
    children: [
      { id: "fi_apptest", type: "file", name: "App.test.js" },
      { id: "fi_utiltest", type: "file", name: "utils.test.js" },
    ],
  },
  {
    id: "f_scripts",
    type: "folder",
    name: "scripts",
    children: [
      { id: "fi_buildsh", type: "file", name: "build.sh" },
      { id: "fi_deploysh", type: "file", name: "deploy.sh" },
    ],
  },
  {
    id: "f_build",
    type: "folder",
    name: "build",
    children: [
      { id: "fi_mainjs", type: "file", name: "main.bundle.js" },
      { id: "fi_vendorjs", type: "file", name: "vendor.bundle.js" },
    ],
  },
  {
    id: "f_vendor",
    type: "folder",
    name: "vendor",
    children: [
      { id: "fi_lib1", type: "file", name: "lodash.js" },
      { id: "fi_lib2", type: "file", name: "moment.js" },
    ],
  },

  // --- 1 THƯ MỤC ROOT RỖNG HOÀN TOÀN ---
  {
    id: "f_empty",
    type: "folder",
    name: "empty_folder",
    children: [],
  },

  // --- 4 FILE NẰM Ở ROOT ---
  { id: "fi_readme", type: "file", name: "README.md" },
  { id: "fi_package", type: "file", name: "package.json" },
  { id: "fi_gitignore", type: "file", name: ".gitignore" },
  { id: "fi_license", type: "file", name: "LICENSE" },
];

const treeRoot = document.querySelector("#tree-root");
const contextMenu = document.querySelector("#context-menu");
let activeElement = null;
let contextTargetId = null;

function createTree(data) {
  return data
    .map((element) => {
      if (element.type === "file") {
        return `<li>
            <div class="tree-label" data-id="${element.id}">[File] ${element.name}</div>
        </li>`;
      } else {
        return `<li>
            <div class="tree-label" data-id="${element.id}">[Folder] ${element.name}</div>
            <ul>
              ${createTree(element.children)}
            </ul>
        </li>`;
      }
    })
    .join("");
}

treeRoot.innerHTML = createTree(tree);

treeRoot.addEventListener("click", (event) => {
  const clickedLabel = event.target.closest(".tree-label");
  if (!clickedLabel) return;

  if (activeElement) {
    activeElement.classList.remove("highlight");
  }
  clickedLabel.classList.add("highlight");
  activeElement = clickedLabel;

  const parentLi = clickedLabel.parentElement;
  const childList = parentLi.querySelector("ul");
  if (childList) {
    childList.classList.toggle("open");
  }
});

treeRoot.addEventListener("contextmenu", (event) => {
  const clickedLabel = event.target.closest(".tree-label");
  if (clickedLabel) {
    event.preventDefault();
    contextTargetId = clickedLabel.dataset.id;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    contextMenu.classList.add("show");
    openContextMenu(mouseX, mouseY);
  }
});

function openContextMenu(mouseX, mouseY) {
  if (mouseX + contextMenu.offsetWidth >= window.innerWidth) {
    contextMenu.style.left = mouseX - contextMenu.offsetWidth + "px";
  } else {
    contextMenu.style.left = mouseX + "px";
  }

  if (mouseY + contextMenu.offsetHeight >= window.innerHeight) {
    contextMenu.style.top = mouseY - contextMenu.offsetHeight + "px";
  } else {
    contextMenu.style.top = mouseY + "px";
  }
}

document.addEventListener("click", () => {
  contextMenu.classList.remove("show");
});

contextMenu.addEventListener("click", (event) => {
  const actionItem = event.target;
  if (actionItem.classList.contains("menu-item")) {
    const action = actionItem.dataset.action;

    if (action === "rename") {
      const newName = prompt("Nhập tên mới cho mục này:");
      if (newName && newName.trim() !== "") {
        tree = renameNode(tree, contextTargetId, newName.trim());
        treeRoot.innerHTML = createTree(tree);
        activeElement = null;
      }
    } else if (action === "delete") {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa mục này không?");
      if (isConfirm) {
        tree = deleteNode(tree, contextTargetId);
        treeRoot.innerHTML = createTree(tree);
        activeElement = null;
      }
    }
    contextMenu.classList.remove("show");
  }
});

function deleteNode(dataArray, targetId) {
  return dataArray
    .filter((item) => item.id !== targetId)
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: deleteNode(item.children, targetId),
        };
      }
      return item;
    });
}

function renameNode(dataArray, targetId, newName) {
  return dataArray.map((item) => {
    if (item.id === targetId) {
      return {
        ...item,
        name: newName,
      };
    }
    if (item.children) {
      return {
        ...item,
        children: renameNode(item.children, targetId, newName),
      };
    }
    return item;
  });
}
