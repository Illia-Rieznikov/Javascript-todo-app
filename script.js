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
  constructor(name, importanceIndex = 1) {
    this.name = name;
    this.importanceIndex = importanceIndex;
  }
}

const categories = [
  new Category("General", 1)
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
    todoList: null,
    categoryList: null,
  },

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

    const addCategoryButton = document.createElement("button");
    addCategoryButton.type = "submit";
    addCategoryButton.textContent = "Add category";
    addCategoryButton.className = "primary-button";

    this.elements.categoryList = document.createElement("div");
    this.elements.categoryList.className = "category-list";

    categoryForm.append(this.elements.categoryInput, this.elements.importanceInput, addCategoryButton);
    this.elements.categorySection.append(categoryTitle, categoryForm, this.elements.categoryList);

    this.elements.menuBlock.append(tabBar, this.elements.todoSection, this.elements.categorySection);

    this.elements.todoBlock = document.createElement("section");
    this.elements.todoBlock.className = "todo-block";

    const listTitle = document.createElement("h2");
    listTitle.textContent = "Todo list";

    this.elements.todoList = document.createElement("ul");
    this.elements.todoList.className = "todo-list";

    this.elements.todoBlock.append(listTitle, this.elements.todoList);

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
      this.elements.categorySelect.append(option);

      const categoryBadge = document.createElement("span");
      categoryBadge.className = "category-badge";
      categoryBadge.textContent = `${category.name} [${category.importanceIndex}]`;
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

    visibleTodos.forEach((todo) => {
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

      const info = document.createElement("div");
      info.className = "todo-info";
      info.append(label, meta);

      todoItem.append(checkbox, info);
      this.elements.todoList.append(todoItem);
    });
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
      if (target && target > new Date()) {
        return false;
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

    categories.push(new Category(name, importance));
    this.elements.categoryInput.value = "";
    this.elements.importanceInput.value = "1";
    this.renderCategories();
  },
};

document.addEventListener("DOMContentLoaded", () => {
  app.init();
  console.log("ftodo starter script loaded.");
});


