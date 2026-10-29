// Array que guarda os gastos em memória
let expenses = [];

// Formata número como moeda brasileira (ex: 1234.5 -> R$ 1.234,50)
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ===== READ: carrega do localStorage ao abrir a página =====
function loadExpenses() {
  const saved = localStorage.getItem('expenses');
  expenses = saved ? JSON.parse(saved) : [];
  renderExpenses();
}

// Salva o array no localStorage
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// ===== READ: renderiza a lista e calcula o total =====
function renderExpenses() {
  const list = document.getElementById('expense-list');
  list.innerHTML = '';

  let total = 0;

  expenses.forEach(exp => {
    total += exp.amount;

    const li = document.createElement('li');

    const desc = document.createElement('span');
    desc.className = 'desc';
    desc.textContent = exp.description;

    const cat = document.createElement('span');
    cat.className = 'cat';
    cat.textContent = exp.category;

    const amount = document.createElement('span');
    amount.className = 'amount';
    amount.textContent = formatCurrency(exp.amount);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.onclick = () => editExpense(exp.id); // UPDATE

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Excluir';
    delBtn.onclick = () => deleteExpense(exp.id); // DELETE

    li.append(desc, cat, amount, editBtn, delBtn);
    list.appendChild(li);
  });

  document.getElementById('total').textContent = 'Total: ' + formatCurrency(total);
}

// ===== CREATE: adiciona novo gasto =====
function addExpense() {
  const descInput = document.getElementById('desc-input');
  const amountInput = document.getElementById('amount-input');
  const categoryInput = document.getElementById('category-input');

  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!description || isNaN(amount) || amount <= 0) {
    alert('Preencha uma descrição e um valor válido maior que zero.');
    return;
  }

  const newExpense = {
    id: Date.now(),
    description: description,
    amount: amount,
    category: categoryInput.value
  };

  expenses.push(newExpense);
  saveExpenses();
  renderExpenses();

  descInput.value = '';
  amountInput.value = '';
}

// ===== UPDATE: edita descrição e valor =====
function editExpense(id) {
  const exp = expenses.find(e => e.id === id);
  if (!exp) return;

  const newDesc = prompt('Nova descrição:', exp.description);
  if (newDesc === null) return; // usuário cancelou

  const newAmount = prompt('Novo valor (R$):', exp.amount);
  if (newAmount === null) return;

  const parsed = parseFloat(newAmount);
  if (!newDesc.trim() || isNaN(parsed) || parsed <= 0) {
    alert('Valores inválidos. Nada foi alterado.');
    return;
  }

  exp.description = newDesc.trim();
  exp.amount = parsed;
  saveExpenses();
  renderExpenses();
}

// ===== DELETE: remove gasto =====
function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  saveExpenses();
  renderExpenses();
}

// Setup: liga o formulário e carrega os gastos salvos
document.getElementById('expense-form').addEventListener('submit', (e) => {
  e.preventDefault();
  addExpense();
});

loadExpenses();
