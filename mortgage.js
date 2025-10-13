const options = document.querySelectorAll(".repayment, .interest-only");

options.forEach(option => {
  option.addEventListener("click", () => {
    options.forEach(o => o.classList.remove("clicked"));
    option.classList.add("clicked");

    const input = option.querySelector("input[type='radio']");
    if (input) input.checked = true;
  });
});
