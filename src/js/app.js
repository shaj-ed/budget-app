class UI {
  constructor() {
    this.toggleButton = document.getElementById("add-budget");
    this.budgetInput = document.getElementById("budget");
    this.errorMsg = document.querySelector(".error");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseTitleInp = document.getElementById("expense-title-inp");
    this.expenseAmountInp = document.getElementById("expense-amount-inp");
    this.expenseList = document.querySelector(".expenses__list");
    this.expenseListArr = [];
    this.expenseId = 0;
  }

  // Get Budget
  submitBudgetForm() {
    const value = this.budgetInput.value;

    if (value === "" || value <= 0) {
      this.errorMsg.classList.add("show-error");

      setTimeout(() => {
        this.errorMsg.classList.remove("show-error");
      }, 1000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = "";
      this.addBalance();
    }
  }

  // Add Balance
  addBalance() {
    const expenses = this.totalExpence();
    const totalBalance = parseInt(this.budgetAmount.textContent) - expenses;

    this.balanceAmount.textContent = totalBalance;
  }

  // Submit Expense Form
  submitExpenseForm() {
    const titleValue = this.expenseTitleInp.value;
    const amountValue = this.expenseAmountInp.value;

    if (amountValue === "" || titleValue === "" || amountValue <= 0) {
      this.errorMsg.classList.add("show-error");

      setTimeout(() => {
        this.errorMsg.classList.remove("show-error");
      }, 1000);
    } else {
      this.expenseTitleInp.value = "";
      this.expenseAmountInp.value = "";

      let expenseItem = {
        id: this.expenseId,
        title: titleValue,
        amount: amountValue,
      };

      this.expenseId++;

      this.expenseListArr.push(expenseItem);

      this.addExpense(expenseItem);
      this.totalExpence();
      this.addBalance();
    }
  }

  // Add Expense
  addExpense(item) {
    const li = document.createElement("li");
    li.classList.add("expenses__item");
    li.innerHTML = `
    <div class="expenses__top">
      <h3 class="expenses__title">${item.title}</h3>
      <span class="expenses__date">${this.getDate()}</span>
    </div>

    <span class="expenses__amount">${item.amount}</span>

    <div class="expenses__icon">
      <span class="edit-item" data-id="${
        item.id
      }"><i class="fas fa-edit"></i></span>
      <span class="delete-item" data-id="${
        item.id
      }"><i class="fas fa-trash"></i></span>
    </div>
  `;
    this.expenseList.appendChild(li);
  }

  // Get Date
  getDate() {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth =
      today.getMonth() < 10 ? `0${today.getMonth()}` : `${today.getMonth()}`;
    const todayDate =
      today.getDate() < 10 ? `0${today.getDate}` : `${today.getDate()}`;

    return `${todayDate}/${todayMonth}/${todayYear}`;
  }

  // Total Expence
  totalExpence() {
    let total = 0;

    if (this.expenseListArr.length > 0) {
      total = this.expenseListArr.reduce((acc, curr) => {
        acc += parseInt(curr.amount);
        return acc;
      }, 0);
    }

    this.expenseAmount.textContent = total;
    return total;
  }

  // Edit Item
  editItem(element) {
    let elemId = parseInt(element.dataset.id);
    let elemParent = element.parentElement.parentElement;

    // Remove from dom
    this.expenseList.removeChild(elemParent);

    // Get from list array
    let elemItem = this.expenseListArr.filter((item) => {
      return item.id === elemId;
    });

    // Edit at form
    this.expenseAmountInp.value = elemItem[0].amount;
    this.expenseTitleInp.value = elemItem[0].title;

    // Remove from list array
    let newList = this.expenseListArr.filter((item) => {
      return item.id !== elemId;
    });

    this.expenseListArr = newList;
    this.addBalance();
  }

  // Delete Item
  deleteItem(element) {
    let elemId = parseInt(element.dataset.id);
    let elemParent = element.parentElement.parentElement;

    // Remove from dom
    this.expenseList.removeChild(elemParent);

    // Remove from list array
    let newList = this.expenseListArr.filter((item) => {
      return item.id !== elemId;
    });

    this.expenseListArr = newList;
    this.addBalance();
  }
}

// All Events
function eventHappen() {
  const toggleButton = document.querySelector("#add-budget");
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expenses-form");
  const expensesList = document.querySelector(".expenses__list");

  // instantiate UI class
  const ui = new UI();

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("show-form");
  });

  budgetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ui.submitBudgetForm();
  });

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ui.submitExpenseForm();
  });

  expensesList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-item")) {
      ui.editItem(e.target);
    } else if (e.target.classList.contains("delete-item")) {
      ui.deleteItem(e.target);
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  eventHappen();
});
