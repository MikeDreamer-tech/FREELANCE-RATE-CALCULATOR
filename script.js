/* =========================================================
   FREELANCE RATE CALCULATOR
   script.js

   No external dependencies.
   Works with the HTML structure provided.
   ========================================================= */


/* =========================================================
   1. GET HTML ELEMENTS
   ========================================================= */

const form = document.getElementById("rate-calculator-form");

const annualIncomeInput =
  document.getElementById("annual-income");

const workingWeeksInput =
  document.getElementById("working-weeks");

const hoursPerWeekInput =
  document.getElementById("hours-per-week");

const billablePercentageInput =
  document.getElementById("billable-percentage");

const annualExpensesInput =
  document.getElementById("annual-expenses");

const taxRateInput =
  document.getElementById("tax-rate");

const annualRevenueOutput =
  document.getElementById("annual-revenue");

const monthlyRevenueOutput =
  document.getElementById("monthly-revenue");

const weeklyRevenueOutput =
  document.getElementById("weekly-revenue");

const hourlyRateOutput =
  document.getElementById("hourly-rate");

const dailyRateOutput =
  document.getElementById("daily-rate");

const copyResultsButton =
  document.getElementById("copy-results");

const copyStatus =
  document.getElementById("copy-status");

const calculatorError =
  document.getElementById("calculator-error");

const currentYear =
  document.getElementById("current-year");


/* =========================================================
   2. CONSTANTS
   ========================================================= */

const HOURS_PER_DAY = 8;

const MONTHS_PER_YEAR = 12;

const WEEKS_PER_YEAR = 52;


/* =========================================================
   3. FORMAT CURRENCY
   ========================================================= */

function formatCurrency(value, decimals = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}


/* =========================================================
   4. GET NUMERIC VALUE
   ========================================================= */

function getNumber(input) {
  return Number.parseFloat(input.value);
}


/* =========================================================
   5. VALIDATE INPUTS
   ========================================================= */

function validateInputs(values) {

  const {
    annualIncome,
    workingWeeks,
    hoursPerWeek,
    billablePercentage,
    annualExpenses,
    taxRate
  } = values;


  if (
    !Number.isFinite(annualIncome) ||
    annualIncome < 0
  ) {
    return "Please enter a valid desired annual income.";
  }


  if (
    !Number.isFinite(workingWeeks) ||
    workingWeeks <= 0 ||
    workingWeeks > WEEKS_PER_YEAR
  ) {
    return "Working weeks must be between 1 and 52.";
  }


  if (
    !Number.isFinite(hoursPerWeek) ||
    hoursPerWeek <= 0 ||
    hoursPerWeek > 168
  ) {
    return "Hours worked per week must be between 1 and 168.";
  }


  if (
    !Number.isFinite(billablePercentage) ||
    billablePercentage <= 0 ||
    billablePercentage > 100
  ) {
    return "Billable hours must be between 1% and 100%.";
  }


  if (
    !Number.isFinite(annualExpenses) ||
    annualExpenses < 0
  ) {
    return "Please enter valid annual business expenses.";
  }


  if (
    !Number.isFinite(taxRate) ||
    taxRate < 0 ||
    taxRate >= 100
  ) {
    return "Estimated tax rate must be between 0% and 99%.";
  }


  return null;
}


/* =========================================================
   6. SHOW ERROR
   ========================================================= */

function showError(message) {

  calculatorError.textContent = message;

  calculatorError.hidden = false;
}


/* =========================================================
   7. HIDE ERROR
   ========================================================= */

function hideError() {

  calculatorError.textContent = "";

  calculatorError.hidden = true;
}


/* =========================================================
   8. CALCULATE RESULTS
   ========================================================= */

function calculateResults() {

  const annualIncome =
    getNumber(annualIncomeInput);

  const workingWeeks =
    getNumber(workingWeeksInput);

  const hoursPerWeek =
    getNumber(hoursPerWeekInput);

  const billablePercentage =
    getNumber(billablePercentageInput);

  const annualExpenses =
    getNumber(annualExpensesInput);

  const taxRate =
    getNumber(taxRateInput);


  const values = {
    annualIncome,
    workingWeeks,
    hoursPerWeek,
    billablePercentage,
    annualExpenses,
    taxRate
  };


  /* ---------- Validate ---------- */

  const error =
    validateInputs(values);


  if (error) {

    showError(error);

    resetResults();

    return null;
  }


  hideError();


  /* =======================================================
     ANNUAL REVENUE

     Take-home income + expenses must remain after tax.

     Revenue × (1 - tax rate)
       =
     Take-home income + expenses

     Therefore:

     Revenue =
     (take-home income + expenses)
     /
     (1 - tax rate)
     ======================================================= */

  const taxDecimal =
    taxRate / 100;


  const requiredAnnualRevenue =
    (
      annualIncome +
      annualExpenses
    ) /
    (
      1 - taxDecimal
    );


  /* ---------- Monthly revenue ---------- */

  const requiredMonthlyRevenue =
    requiredAnnualRevenue /
    MONTHS_PER_YEAR;


  /* ---------- Weekly revenue ---------- */

  const requiredWeeklyRevenue =
    requiredAnnualRevenue /
    workingWeeks;


  /* ---------- Billable hours ---------- */

  const billableHoursPerWeek =
    hoursPerWeek *
    (billablePercentage / 100);


  const billableHoursPerYear =
    workingWeeks *
    billableHoursPerWeek;


  /* ---------- Hourly rate ---------- */

  const requiredHourlyRate =
    requiredAnnualRevenue /
    billableHoursPerYear;


  /* ---------- Daily rate ---------- */

  const requiredDailyRate =
    requiredHourlyRate *
    HOURS_PER_DAY;


  /* =======================================================
     UPDATE UI
     ======================================================= */

  annualRevenueOutput.textContent =
    formatCurrency(requiredAnnualRevenue);


  monthlyRevenueOutput.textContent =
    formatCurrency(requiredMonthlyRevenue);


  weeklyRevenueOutput.textContent =
    formatCurrency(requiredWeeklyRevenue);


  hourlyRateOutput.textContent =
    formatCurrency(requiredHourlyRate, 2);


  dailyRateOutput.textContent =
    formatCurrency(requiredDailyRate, 2);


  /* Return values for copy functionality */

  return {
    annualRevenue: requiredAnnualRevenue,
    monthlyRevenue: requiredMonthlyRevenue,
    weeklyRevenue: requiredWeeklyRevenue,
    hourlyRate: requiredHourlyRate,
    dailyRate: requiredDailyRate
  };
}


/* =========================================================
   9. RESET RESULTS
   ========================================================= */

function resetResults() {

  annualRevenueOutput.textContent = "$0";

  monthlyRevenueOutput.textContent = "$0";

  weeklyRevenueOutput.textContent = "$0";

  hourlyRateOutput.textContent = "$0";

  dailyRateOutput.textContent = "$0";
}


/* =========================================================
   10. GET RESULTS FOR COPY BUTTON
   ========================================================= */

function getResultsText(results) {

  return [
    "Freelance Rate Calculator",
    "",
    `Required annual revenue: ${formatCurrency(results.annualRevenue)}`,
    `Required monthly revenue: ${formatCurrency(results.monthlyRevenue)}`,
    `Required weekly revenue: ${formatCurrency(results.weeklyRevenue)}`,
    `Required hourly billable rate: ${formatCurrency(results.hourlyRate, 2)}`,
    `Required daily rate: ${formatCurrency(results.dailyRate, 2)}`,
    "",
    "Calculated with Freelance Rate Calculator."
  ].join("\n");
}


/* =========================================================
   11. COPY RESULTS
   ========================================================= */

async function copyResults() {

  const results =
    calculateResults();


  if (!results) {
    return;
  }


  const text =
    getResultsText(results);


  try {

    await navigator.clipboard.writeText(text);

    copyStatus.textContent =
      "Results copied to your clipboard.";

    copyResultsButton.textContent =
      "Copied!";


    setTimeout(() => {

      copyStatus.textContent = "";

      copyResultsButton.textContent =
        "Copy results";

    }, 2000);

  } catch (error) {

    /*
      Clipboard API may not be available in some
      older browsers or local environments.
    */

    fallbackCopy(text);

  }
}


/* =========================================================
   12. FALLBACK COPY
   ========================================================= */

function fallbackCopy(text) {

  const temporaryTextarea =
    document.createElement("textarea");


  temporaryTextarea.value =
    text;


  temporaryTextarea.style.position =
    "fixed";

  temporaryTextarea.style.left =
    "-9999px";

  temporaryTextarea.style.top =
    "0";


  document.body.appendChild(
    temporaryTextarea
  );


  temporaryTextarea.focus();

  temporaryTextarea.select();


  try {

    document.execCommand("copy");

    copyStatus.textContent =
      "Results copied to your clipboard.";

    copyResultsButton.textContent =
      "Copied!";


    setTimeout(() => {

      copyStatus.textContent = "";

      copyResultsButton.textContent =
        "Copy results";

    }, 2000);

  } catch (error) {

    copyStatus.textContent =
      "Unable to copy automatically. Please copy the results manually.";

  }


  document.body.removeChild(
    temporaryTextarea
  );
}


/* =========================================================
   13. INSTANT CALCULATIONS
   ========================================================= */

const inputs = [
  annualIncomeInput,
  workingWeeksInput,
  hoursPerWeekInput,
  billablePercentageInput,
  annualExpensesInput,
  taxRateInput
];


inputs.forEach((input) => {

  input.addEventListener(
    "input",
    calculateResults
  );

});


/* =========================================================
   14. COPY BUTTON
   ========================================================= */

copyResultsButton.addEventListener(
  "click",
  copyResults
);


/* =========================================================
   15. RESET BUTTON
   ========================================================= */

form.addEventListener(
  "reset",
  () => {

    /*
      The browser resets form values first.
      A small timeout lets the new values be
      available before recalculating.
    */

    setTimeout(() => {

      hideError();

      calculateResults();

      copyStatus.textContent = "";

      copyResultsButton.textContent =
        "Copy results";

    }, 0);

  }
);


/* =========================================================
   16. CURRENT YEAR
   ========================================================= */

if (currentYear) {

  currentYear.textContent =
    new Date().getFullYear();

}


/* =========================================================
   17. INITIAL CALCULATION
   ========================================================= */

calculateResults();