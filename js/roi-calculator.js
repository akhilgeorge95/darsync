function calculateROI() {
    var units = parseInt(document.getElementById('calc-units').value) || 0;
    var hoursPerWeek = parseInt(document.getElementById('calc-hours').value) || 0;
    var hourlyRate = parseInt(document.getElementById('calc-rate').value) || 0;
    var staffCount = parseInt(document.getElementById('calc-staff').value) || 1;

    var currentMonthlyCost = hoursPerWeek * hourlyRate * 4.33 * staffCount;
    var timeSavedPercent = 0.60;
    var monthlySavings = currentMonthlyCost * timeSavedPercent;

    var usersNeeded = staffCount;
    var pricePerUser = 100;
    var productCost = usersNeeded * pricePerUser;

    var netSavings = monthlySavings - productCost;
    var annualSavings = netSavings * 12;
    var roi = productCost > 0 ? ((monthlySavings / productCost) * 100).toFixed(0) : 0;

    document.getElementById('result-current-cost').textContent = '$' + currentMonthlyCost.toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('result-savings').textContent = '$' + monthlySavings.toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('result-product-cost').textContent = '$' + productCost.toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('result-net').textContent = '$' + netSavings.toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('result-annual').textContent = '$' + annualSavings.toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('result-roi').textContent = roi + '%';
    document.getElementById('calculator-results').hidden = false;
    document.getElementById('calculator-results').scrollIntoView({ behavior: 'smooth' });
}
