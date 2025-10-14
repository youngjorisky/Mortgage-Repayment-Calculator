const form = document.getElementById('mortgage-form');
const amountInput = document.getElementById('amount');
const yearsInput = document.getElementById('years');
const rateInput = document.getElementById('rate');
const radioInputs = document.querySelectorAll('input[name="type"]');

// Function to show or hide error for one input
function toggleError(input, show, message = '') {
  let group = input.closest('.input-group');
  let errorMsg;

  // Handle radio separately
  if (input.type === 'radio') {
    group = input.closest('.radio-group');
    errorMsg = group.querySelector('.error-message');
  } else {
    errorMsg = group.nextElementSibling;
  }

  if (show) {
    if (group) group.classList.add('error');
    if (errorMsg) errorMsg.textContent = message;
  } else {
    if (group) group.classList.remove('error');
    if (errorMsg) errorMsg.textContent = '';
  }
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  if (amountInput.value.trim() === '' || isNaN(amountInput.value) || amountInput.value <= 0) {
    toggleError(amountInput, true, 'Please enter a valid amount');
    valid = false;
  } else toggleError(amountInput, false);

  if (yearsInput.value.trim() === '' || isNaN(yearsInput.value) || yearsInput.value <= 0) {
    toggleError(yearsInput, true, 'Please enter valid years');
    valid = false;
  } else toggleError(yearsInput, false);

  if (rateInput.value.trim() === '' || isNaN(rateInput.value) || rateInput.value <= 0) {
    toggleError(rateInput, true, 'Please enter a valid interest rate');
    valid = false;
  } else toggleError(rateInput, false);

  const checkedType = document.querySelector('input[name="type"]:checked');
  if (!checkedType) {
    toggleError(radioInputs[0], true, 'Please select a mortgage type');
    valid = false;
  } else toggleError(radioInputs[0], false);

  if (!valid) return;

  calculateRepayments(
    parseFloat(amountInput.value),
    parseFloat(rateInput.value),
    parseFloat(yearsInput.value),
    checkedType.value
  );
});

function calculateRepayments(amount, rate, years, type) {
  const monthlyEl = document.getElementById('monthly repayments');
  const totalEl = document.getElementById('total repayments');

  const monthlyRate = rate / 100 / 12;
  const totalPayments = years * 12;
  let monthlyPayment, totalRepayment;

  if (type === 'repayment') {
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
    const denominator = Math.pow(1 + monthlyRate, totalPayments) - 1;
    monthlyPayment = amount * (numerator / denominator);
    totalRepayment = monthlyPayment * totalPayments;
  } else {
    monthlyPayment = amount * monthlyRate;
    totalRepayment = monthlyPayment * totalPayments;
  }

  monthlyEl.textContent = `£${monthlyPayment.toFixed(2)}`;
  totalEl.textContent = `£${totalRepayment.toFixed(2)}`;

  // Show result area
  const before = document.querySelector('.display-before');
  const after = document.querySelector('.display-after');
  before.style.display = 'none';
  after.style.display = 'block';
}

// Reset button returns to initial view
const resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', () => {
  document.querySelector('.display-before').style.display = 'block';
  document.querySelector('.display-after').style.display = 'none';
});
