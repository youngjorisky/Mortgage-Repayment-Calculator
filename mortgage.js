document.getElementById('mortgage-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value);
  const term = parseInt(document.getElementById('term').value);
  const rate = parseFloat(document.getElementById('rate').value);
  const type = document.getElementById('type').value;

  let monthlyPayment;

  if (type === 'repayment') {
    const monthlyRate = rate / 100 / 12;
    const totalPayments = term * 12;
    monthlyPayment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalPayments));
  } else {
    monthlyPayment = (amount * rate) / 100 / 12;
  }

  document.getElementById('output').textContent = 
    `Your monthly payment is £${monthlyPayment.toFixed(2)}`;
});