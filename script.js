const Modal = {
  open() {
    document.querySelector("#modal-overlay").classList.add("active");
  },
  close() {
    document.querySelector("#modal-overlay").classList.remove("active");
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances-transactions")) || []; // Transformando String para Array
  },

  set(transactions) {
    localStorage.setItem(
      "dev.finances-transactions",
      JSON.stringify(transactions) // Transformando Array para String
    );
  },
};

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let income = 0;

    Transaction.all.forEach(({ amount }) => {
      if (amount > 0) {
        income += amount;
      }
    });

    return income;
  },

  expenses() {
    let expense = 0;

    Transaction.all.forEach(({ amount }) => {
      if (amount < 0) {
        expense += amount;
      }
    });

    return expense;
  },

  total() {
    const { incomes, expenses } = Transaction;

    return incomes() + expenses();
  },
};

const DOM = {
  transactionContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const { description, amount, date } = transaction;
    const classCSS = transaction.amount > 0 ? "income" : "expense";
    const formatedAmount = Utils.formatCurrency(amount);

    const html = `
      <td class="description">${description}</td>
      <td class="${classCSS}">${formatedAmount}</td>
      <td class="date">${date}</td>
      <td><img onclick="Transaction.remove(${index});" src="./assets/minus.svg" alt="Remover Transação" class="button-remove"/></td>
    `;

    return html;
  },

  updateBalance() {
    const { incomes, expenses, total } = Transaction;
    const { formatCurrency } = Utils;

    document.getElementById("incomeDisplay").innerHTML = formatCurrency(
      incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = formatCurrency(
      expenses()
    );
    document.getElementById("totalDisplay").innerHTML = formatCurrency(total());
  },

  clearTransactions() {
    DOM.transactionContainer.innerHTML = "";
  },
};

const Utils = {
  formatAmount(value) {
    value = Number(value) * 100;
    return value;
  },

  formatDate(value) {
    const splittedDate = value.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  saveTransaction(transaction) {
    Transaction.add(transaction);
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatValues();

      Form.saveTransaction(transaction);
      Form.clearFields();

      Modal.close();
      // App.reload();
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();

    Storage.set(Transaction.all);
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();
