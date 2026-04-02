class Todo {
  constructor(text, category = "General", completed = false, previousTodoId = null, dueDate = "", dueTime = "") {
    this.id = `${Date.now()}-${Math.random()}`;
    this.text = text;
    this.category = category;
    this.completed = completed;
    this.hidden = false;
    this.dateDisplay = new Date().toLocaleDateString();
    this.timeDisplay = new Date().toLocaleTimeString();
    this.previousTodoId = previousTodoId;
    this.dueDate = dueDate;
    this.dueTime = dueTime;
    this.color;
  }
}

class Category {
  constructor(name, importanceIndex = 1, color = "#9CAAF") {
    this.name = name;
    this.importanceIndex = importanceIndex;
    this.color = color;
  }
}

const categories = [
  new Category("General", 1, "#4CAF50")
];
const todos = [];

const app = {
  elements: {
    header: null,
    card: null,
    menuBlock: null,
    todoBlock: null,
    todoSection: null,
    categorySection: null,
    todoTabButton: null,
    categoryTabButton: null,
    categorySelect: null,
    todoInput: null,
    previousTodoInput: null,
    dueDateInput: null,
    dueTimeInput: null,
    categoryInput: null,
    importanceInput: null,
      colorInput: null,
      todoList: null,
      categoryList: null,
      collapseButton: null,
  },
    collapsed: false,

  init() {
    this.elements.header = document.querySelector(".app-header");
    this.elements.card = document.querySelector(".card");

    this.setupHeader();
    this.buildBlocks();
    this.renderCategories();
    this.renderPreviousTodoOptions();
    this.renderTodos();
  },

  setupHeader() {
    const title = document.createElement("h1");
    title.textContent = "ftodo Starter";

    const description = document.createElement("p");
    description.textContent = "Use the menu below to add todos and categories.";

    this.elements.header.append(title, description);
  },

  buildBlocks() {
    this.elements.menuBlock = document.createElement("section");
    this.elements.menuBlock.className = "menu-block";

    const tabBar = document.createElement("div");
    tabBar.className = "menu-tabs";

    this.elements.todoTabButton = document.createElement("button");
    this.elements.todoTabButton.type = "button";
    this.elements.todoTabButton.textContent = "Create todo";
    this.elements.todoTabButton.className = "tab-button active";
    this.elements.todoTabButton.addEventListener("click", () => this.showMenuSection("todo"));

    this.elements.categoryTabButton = document.createElement("button");
    this.elements.categoryTabButton.type = "button";
    this.elements.categoryTabButton.textContent = "Create category";
    this.elements.categoryTabButton.className = "tab-button";
    this.elements.categoryTabButton.addEventListener("click", () => this.showMenuSection("category"));

    tabBar.append(this.elements.todoTabButton, this.elements.categoryTabButton);

    this.elements.todoSection = document.createElement("div");
    this.elements.todoSection.className = "menu-section todo-section";

    const todoTitle = document.createElement("h2");
    todoTitle.textContent = "Create new todo";

    const todoForm = document.createElement("form");
    todoForm.className = "todo-form";
    todoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.addTodo();
    });

    this.elements.todoInput = document.createElement("input");
    this.elements.todoInput.type = "text";
    this.elements.todoInput.placeholder = "Enter todo description";
    this.elements.todoInput.required = true;

    this.elements.categorySelect = document.createElement("select");
    this.elements.categorySelect.name = "category";

    this.elements.previousTodoInput = document.createElement("select");
    this.elements.previousTodoInput.name = "previousTodo";

    this.elements.dueDateInput = document.createElement("input");
    this.elements.dueDateInput.type = "date";
    this.elements.dueDateInput.placeholder = "Date (optional)";

    this.elements.dueTimeInput = document.createElement("input");
    this.elements.dueTimeInput.type = "time";
    this.elements.dueTimeInput.placeholder = "Time (optional)";

    const addTodoButton = document.createElement("button");
    addTodoButton.type = "submit";
    addTodoButton.textContent = "Add todo";
    addTodoButton.className = "primary-button";

    todoForm.append(
      this.elements.todoInput,
      this.elements.categorySelect,
      this.elements.previousTodoInput,
      this.elements.dueDateInput,
      this.elements.dueTimeInput,
      addTodoButton
    );

    this.elements.todoSection.append(todoTitle, todoForm);

    this.elements.categorySection = document.createElement("div");
    this.elements.categorySection.className = "menu-section category-section";
    this.elements.categorySection.style.display = "none";

    const categoryTitle = document.createElement("h2");
    categoryTitle.textContent = "Add new category";

    const categoryForm = document.createElement("form");
    categoryForm.className = "category-form";
    categoryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.addCategory();
    });

    this.elements.categoryInput = document.createElement("input");
    this.elements.categoryInput.type = "text";
    this.elements.categoryInput.placeholder = "Category name";
    this.elements.categoryInput.required = true;

    this.elements.importanceInput = document.createElement("input");
    this.elements.importanceInput.type = "number";
    this.elements.importanceInput.min = "1";
    this.elements.importanceInput.placeholder = "Importance index";
    this.elements.importanceInput.value = "1";

    this.elements.colorInput = document.createElement("input");
    this.elements.colorInput.type = "color";
    this.elements.colorInput.value = "#4CAF50";
    this.elements.colorInput.title = "Category color";

    // export / import buttons and hidden file input
    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.textContent = "Export";
    exportButton.className = "secondary-button";
    exportButton.addEventListener("click", () => this.exportAll());

    const importButton = document.createElement("button");
    importButton.type = "button";
    importButton.textContent = "Import";
    importButton.className = "secondary-button";

    const importFileInput = document.createElement("input");
    importFileInput.type = "file";
    importFileInput.accept = ".txt,application/json,text/plain";
    importFileInput.style.display = "none";
    importFileInput.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) this.importFromFile(f);
      importFileInput.value = null;
    });

    importButton.addEventListener("click", () => importFileInput.click());

    const addCategoryButton = document.createElement("button");
    addCategoryButton.type = "submit";
    addCategoryButton.textContent = "Add category";
    addCategoryButton.className = "primary-button";

    this.elements.categoryList = document.createElement("div");
    this.elements.categoryList.className = "category-list";

    categoryForm.append(this.elements.categoryInput, this.elements.importanceInput, this.elements.colorInput, addCategoryButton, exportButton, importButton, importFileInput);
    this.elements.categorySection.append(categoryTitle, categoryForm, this.elements.categoryList);

    this.elements.menuBlock.append(tabBar, this.elements.todoSection, this.elements.categorySection);

    this.elements.todoBlock = document.createElement("section");
    this.elements.todoBlock.className = "todo-block";

    const listTitle = document.createElement("h2");
    listTitle.textContent = "Todo list";

    this.elements.todoList = document.createElement("ul");
    this.elements.todoList.className = "todo-list";

    // collapse/expand button for todo list
    this.elements.collapseButton = document.createElement("button");
    this.elements.collapseButton.type = "button";
    this.elements.collapseButton.className = "collapse-button";
    this.elements.collapseButton.textContent = "Collapse";
    this.elements.collapseButton.addEventListener("click", () => {
      this.collapsed = !this.collapsed;
      this.elements.collapseButton.textContent = this.collapsed ? "Show all" : "Collapse";
      this.renderTodos();
    });

    const headerWrap = document.createElement("div");
    headerWrap.style.display = "flex";
    headerWrap.style.justifyContent = "space-between";
    headerWrap.style.alignItems = "center";
    headerWrap.append(listTitle, this.elements.collapseButton);

    this.elements.todoBlock.append(headerWrap, this.elements.todoList);

    this.elements.card.append(this.elements.menuBlock, this.elements.todoBlock);
  },

  showMenuSection(section) {
    const isTodo = section === "todo";
    this.elements.todoSection.style.display = isTodo ? "block" : "none";
    this.elements.categorySection.style.display = isTodo ? "none" : "block";

    this.elements.todoTabButton.classList.toggle("active", isTodo);
    this.elements.categoryTabButton.classList.toggle("active", !isTodo);

    this.elements.todoTabButton.disabled = isTodo;
    this.elements.categoryTabButton.disabled = !isTodo;
  },

  renderCategories() {
    this.elements.categorySelect.innerHTML = "";
    this.elements.categoryList.innerHTML = "";

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = `${category.name} (${category.importanceIndex})`;
      option.dataset.color = category.color || "";
      this.elements.categorySelect.append(option);

      const categoryBadge = document.createElement("span");
      categoryBadge.className = "category-badge";
      categoryBadge.textContent = `${category.name} [${category.importanceIndex}]`;
      if (category.color) {
        categoryBadge.style.backgroundColor = category.color;
        categoryBadge.style.color = "#ffffff";
      }
      this.elements.categoryList.append(categoryBadge);
    });
  },

  renderPreviousTodoOptions() {
    this.elements.previousTodoInput.innerHTML = "";
    const noneOption = document.createElement("option");
    noneOption.value = "";
    noneOption.textContent = "No previous todo";
    this.elements.previousTodoInput.append(noneOption);

    todos.forEach((todo) => {
      const option = document.createElement("option");
      option.value = todo.id;
      option.textContent = todo.text;
      this.elements.previousTodoInput.append(option);
    });
  },

  renderTodos() {
    this.elements.todoList.innerHTML = "";

    const visibleTodos = todos.filter((todo) => this.shouldDisplayTodo(todo));

    if (visibleTodos.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No visible todos yet. Add one using the menu above.";
      this.elements.todoList.append(emptyMessage);
      return;
    }

    // support collapsed view: only show top two when collapsed
    const listToRender = this.collapsed ? visibleTodos.slice(0, 2) : visibleTodos;

    listToRender.forEach((todo) => {
      const todoItem = document.createElement("li");
      todoItem.className = "todo-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        this.renderTodos();
      });

      const label = document.createElement("label");
      label.textContent = `${todo.text} — ${todo.category}`;
      label.className = "todo-label";

      // apply category background color if available
      const cat = categories.find((c) => c.name === todo.category);
      if (cat && cat.color) {
        todoItem.style.backgroundColor = cat.color;
        const textColor = this.getContrastColor(cat.color);
        label.style.color = textColor;
        todoItem.style.padding = "8px";
        todoItem.style.borderRadius = "4px";
      }

      const notes = [];
      if (todo.previousTodoId) {
        const prev = todos.find((item) => String(item.id) === String(todo.previousTodoId));
        if (prev) {
          notes.push(`Previous todo: ${prev.text}`);
        }
      }
      if (todo.dueDate) {
        notes.push(`Date: ${todo.dueDate}`);
      }
      if (todo.dueTime) {
        notes.push(`Time: ${todo.dueTime}`);
      }

      const meta = document.createElement("small");
      meta.textContent = `${todo.dateDisplay} ${todo.timeDisplay}` + (notes.length ? ` · ${notes.join(" · ")}` : "");
      meta.className = "todo-meta";
      if (cat && cat.color) {
        meta.style.color = this.getContrastColor(cat.color);
      }

      const info = document.createElement("div");
      info.className = "todo-info";
      info.append(label, meta);

      todoItem.append(checkbox, info);
      this.elements.todoList.append(todoItem);
    });

    if (this.collapsed && visibleTodos.length > listToRender.length) {
      const moreCount = visibleTodos.length - listToRender.length;
      const moreItem = document.createElement("li");
      moreItem.className = "more-indicator";
      moreItem.textContent = `+${moreCount} more`;
      moreItem.style.listStyle = "none";
      moreItem.style.marginTop = "8px";
      moreItem.style.color = "#6b7280";
      this.elements.todoList.append(moreItem);
    }
  },

  shouldDisplayTodo(todo) {
    if (todo.completed) {
      return false;
    }

    if (todo.previousTodoId) {
      const previous = todos.find((item) => String(item.id) === String(todo.previousTodoId));
      if (!previous || !previous.completed) {
        return false;
      }
    }

    if (todo.dueDate || todo.dueTime) {
      const target = this.buildDueDateTime(todo.dueDate, todo.dueTime);
      if (target) {
        const now = new Date();
        // If only a dueDate is provided (no specific time), treat todos due today as visible.
        if (todo.dueDate && !todo.dueTime) {
          const [y, m, d] = todo.dueDate.split("-").map(Number);
          const dueDateOnly = new Date(y, m - 1, d);
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          // hide only when the due date is strictly in the future
          if (dueDateOnly > today) {
            return false;
          }
        } else {
          // when a time is provided, hide if the target datetime is in the future
          if (target > now) {
            return false;
          }
        }
      }
    }

    return true;
  },

  buildDueDateTime(dueDate, dueTime) {
    const now = new Date();
    if (!dueDate && !dueTime) {
      return null;
    }

    let year = now.getFullYear();
    let month = now.getMonth();
    let day = now.getDate();
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (dueDate) {
      const [y, m, d] = dueDate.split("-").map(Number);
      year = y;
      month = m - 1;
      day = d;
    }

    if (dueTime) {
      const [h, min] = dueTime.split(":").map(Number);
      hours = h;
      minutes = min;
    } else if (dueDate) {
      hours = 23;
      minutes = 59;
      seconds = 59;
    }

    return new Date(year, month, day, hours, minutes, seconds);
  },

  getContrastColor(hex) {
    if (!hex) return "#000000";
    const c = hex.replace('#', '');
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  },

  addTodo() {
    const text = this.elements.todoInput.value.trim();
    const category = this.elements.categorySelect.value;
    const previousTodoId = this.elements.previousTodoInput.value || null;
    const dueDate = this.elements.dueDateInput.value;
    const dueTime = this.elements.dueTimeInput.value;

    if (!text) {
      return;
    }

    const newTodo = new Todo(text, category, false, previousTodoId, dueDate, dueTime);
    todos.push(newTodo);
    this.elements.todoInput.value = "";
    this.elements.previousTodoInput.value = "";
    this.elements.dueDateInput.value = "";
    this.elements.dueTimeInput.value = "";
    this.renderPreviousTodoOptions();
    this.renderTodos();
  },

  addCategory() {
    const name = this.elements.categoryInput.value.trim();
    const importance = Number(this.elements.importanceInput.value) || 1;

    if (!name) {
      return;
    }

    const color = this.elements.colorInput && this.elements.colorInput.value ? this.elements.colorInput.value : "#9CAAF";
    categories.push(new Category(name, importance, color));
    this.elements.categoryInput.value = "";
    this.elements.importanceInput.value = "1";
    if (this.elements.colorInput) this.elements.colorInput.value = "#4CAF50";
    this.renderCategories();
  },

  exportAll() {
    try {
      const data = {
        categories: categories.map((c) => ({ name: c.name, importanceIndex: c.importanceIndex, color: c.color })),
        todos: todos.map((t) => ({
          id: t.id,
          text: t.text,
          category: t.category,
          completed: t.completed,
          hidden: t.hidden,
          dateDisplay: t.dateDisplay,
          timeDisplay: t.timeDisplay,
          previousTodoId: t.previousTodoId,
          dueDate: t.dueDate,
          dueTime: t.dueTime,
        })),
      };

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const now = new Date();
      const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
      a.href = url;
      a.download = `ftodo-backup-${ts}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export data: " + err.message);
    }
  },

  importFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target.result || "");
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid file format');

        // replace categories
        categories.length = 0;
        if (Array.isArray(parsed.categories)) {
          parsed.categories.forEach((c) => {
            const name = c.name || 'Unnamed';
            const importance = Number(c.importanceIndex) || 1;
            const color = c.color || '#9CAAF';
            categories.push(new Category(name, importance, color));
          });
        }

        // replace todos
        todos.length = 0;
        if (Array.isArray(parsed.todos)) {
          parsed.todos.forEach((t) => {
            todos.push({
              id: t.id || `${Date.now()}-${Math.random()}`,
              text: t.text || '',
              category: t.category || (categories[0] && categories[0].name) || 'General',
              completed: !!t.completed,
              hidden: !!t.hidden,
              dateDisplay: t.dateDisplay || new Date().toLocaleDateString(),
              timeDisplay: t.timeDisplay || new Date().toLocaleTimeString(),
              previousTodoId: t.previousTodoId || null,
              dueDate: t.dueDate || '',
              dueTime: t.dueTime || '',
            });
          });
        }

        this.renderCategories();
        this.renderPreviousTodoOptions();
        this.renderTodos();
      } catch (err) {
        alert('Failed to import file: ' + err.message);
      }
    };
    reader.onerror = () => alert('Failed to read file');
    reader.readAsText(file);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  app.init();
  console.log("ftodo starter script loaded.");
});


