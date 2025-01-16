document.addEventListener("DOMContentLoaded", () => {
    const personalPVInput = document.getElementById("personalPV");
    const frontlinesContainer = document.getElementById("frontlines");
    const incomeDisplay = document.getElementById("income");
    const addFrontlineButton = document.getElementById("addFrontline");

    let frontlines = [];

    // Performance Bonus Levels
    const bonusLevels = [
        { pv: 7500, bonus: 25 },
        { pv: 6000, bonus: 23 },
        { pv: 4000, bonus: 21 },
        { pv: 2500, bonus: 18 },
        { pv: 1500, bonus: 15 },
        { pv: 1000, bonus: 12 },
        { pv: 600, bonus: 9 },
        { pv: 300, bonus: 6 },
        { pv: 100, bonus: 3 },
    ];

    // Function to calculate the Performance Bonus Level
    function getBonusLevel(pv) {
        for (let level of bonusLevels) {
            if (pv >= level.pv) return level.bonus;
        }
        return 0; // No bonus if PV is below 100
    }

    // Function to calculate income
    function calculateIncome() {
        const personalPV = parseInt(personalPVInput.value) || 0;
        const personalBV = personalPV * 3.43; // Convert PV to BV
        const customerBV = personalBV * 0.6; // 60% of BV is customer BV
        const retailEarnings = customerBV * 0.3; // 30% retail profit from customer BV

        // Group PV (Personal PV + Frontlines)
        const groupPV = personalPV + frontlines.reduce((sum, frontline) => sum + (parseInt(frontline.value) || 0), 0);

        // Determine Performance Bonus Level
        const performanceBonusLevel = getBonusLevel(groupPV);

        // Personal Bonus
        const personalBonus = (personalBV * performanceBonusLevel) / 100;

        // Frontline Bonuses
        let totalFrontlineBonus = 0;
        frontlines.forEach((frontline) => {
            const frontlinePV = parseInt(frontline.value) || 0;
            const frontlineBV = frontlinePV * 3.43;

            const frontlineBonusLevel = getBonusLevel(frontlinePV);
            const differential = performanceBonusLevel - frontlineBonusLevel;

            if (differential > 0) {
                totalFrontlineBonus += (frontlineBV * differential) / 100;
            }
        });

        // Total Income
        const totalIncome = personalBonus + totalFrontlineBonus + retailEarnings;
        incomeDisplay.textContent = `$${totalIncome.toFixed(2)}`;
    }

    // Add a new frontline
    function addFrontline() {
        const frontlineDiv = document.createElement("div");
        frontlineDiv.className = "frontline";

        const frontlineInput = document.createElement("input");
        frontlineInput.type = "number";
        frontlineInput.placeholder = "Group PV";
        frontlineInput.addEventListener("input", calculateIncome);

        frontlines.push(frontlineInput);
        frontlineDiv.appendChild(frontlineInput);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.style.marginLeft = "10px";
        removeButton.addEventListener("click", () => {
            frontlines = frontlines.filter((f) => f !== frontlineInput);
            frontlineDiv.remove();
            calculateIncome();
        });

        frontlineDiv.appendChild(removeButton);
        frontlinesContainer.appendChild(frontlineDiv);
    }

    // Event Listeners
    personalPVInput.addEventListener("input", calculateIncome);
    addFrontlineButton.addEventListener("click", addFrontline);

    // Initial Calculation
    calculateIncome();
});
