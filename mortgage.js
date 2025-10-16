const form = document.getElementById('mortgage-form');
const amountInput = document.getElementById('amount');
const yearsInput = document.getElementById('years');
const rateInput = document.getElementById('rate');
const radioInputs = document.querySelectorAll('input[name="type"]');
const requiredMsg = 'This field is required';

// 🧮 Format number with commas
function formatNumberWithCommas(num) {
  return num.toLocaleString('en-UK', { maximumFractionDigits: 2 });
}

// 🧹 Remove commas before parsing
function removeCommas(value) {
  return value.replace(/,/g, '');
}

// Function to show or hide error for one input
function toggleError(input, show, message = '') {
  let group, errorMsg;

  if (input.type === 'radio') {
    group = input.closest('.radio-group');
    errorMsg = group.querySelector('.error-message');
  } else {
    group = input.closest('.input-group');
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

// 🧩 Add live comma formatting to amount input
amountInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/,/g, '');
  if (isNaN(value) || value === '') {
    e.target.value = '';
    return;
  }
  e.target.value = Number(value).toLocaleString('en-UK');
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  // Remove commas for numeric validation
  const cleanAmount = removeCommas(amountInput.value);
  const cleanYears = removeCommas(yearsInput.value);
  const cleanRate = removeCommas(rateInput.value);

  if (cleanAmount.trim() === '' || isNaN(cleanAmount) || cleanAmount <= 0) {
    toggleError(amountInput, true, requiredMsg);
    valid = false;
  } else toggleError(amountInput, false);

  if (cleanYears.trim() === '' || isNaN(cleanYears) || cleanYears <= 0) {
    toggleError(yearsInput, true, requiredMsg);
    valid = false;
  } else toggleError(yearsInput, false);

  if (cleanRate.trim() === '' || isNaN(cleanRate) || cleanRate <= 0) {
    toggleError(rateInput, true, requiredMsg);
    valid = false;
  } else toggleError(rateInput, false);

  const checkedType = document.querySelector('input[name="type"]:checked');
  if (!checkedType) {
    toggleError(radioInputs[0], true, requiredMsg);
    valid = false;
  } else toggleError(radioInputs[0], false);

  if (!valid) return;

  calculateRepayments(
    parseFloat(cleanAmount),
    parseFloat(cleanRate),
    parseFloat(cleanYears),
    checkedType.value
  );
});

// Format numbers with commas and 2 decimal places
function formatNumberWithCommas(num) {
  return num.toLocaleString('en-UK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function calculateRepayments(amount, rate, years, type) {
  const monthlyEl = document.getElementById('monthly-repayments');
  const totalEl = document.getElementById('total-repayments');

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

  // ✅ Format correctly
  monthlyEl.textContent = `£${formatNumberWithCommas(monthlyPayment)}`;
  totalEl.textContent = `£${formatNumberWithCommas(totalRepayment)}`;

  const before = document.querySelector('.display-before');
  const after = document.querySelector('.display-after');
  before.style.display = 'none';
  after.style.display = 'block';
}

// Reset button
const resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', () => {
  document.querySelector('.display-before').style.display = 'block';
  document.querySelector('.display-after').style.display = 'none';

  document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
  document.querySelectorAll('.input-group, .radio-group').forEach(g => g.classList.remove('error'));

  form.reset();
});
