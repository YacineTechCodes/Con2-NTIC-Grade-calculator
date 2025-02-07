// Made using AI (I don't know js lol)

const state = {
    isDarkMode: false,
};

// Load Dark Mode Preference on Page Load
function loadDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
        state.isDarkMode = savedDarkMode === 'dark'; // Set state based on saved preference
        document.documentElement.setAttribute('data-theme', savedDarkMode); // Apply the theme
        document.getElementById('sunIcon').style.display = state.isDarkMode ? 'block' : 'none'; // Toggle icons
        document.getElementById('moonIcon').style.display = state.isDarkMode ? 'none' : 'block';
    } else {
        // If no preference is saved, default to light mode
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('sunIcon').style.display = 'none';
        document.getElementById('moonIcon').style.display = 'block';
    }
}

// Call the function to load the dark mode preference when the page loads
loadDarkModePreference();

// Dark Mode Toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
    state.isDarkMode = !state.isDarkMode; // Toggle the state
    const theme = state.isDarkMode ? 'dark' : 'light'; // Determine the new theme
    document.documentElement.setAttribute('data-theme', theme); // Apply the theme
    document.getElementById('sunIcon').style.display = state.isDarkMode ? 'block' : 'none'; // Toggle icons
    document.getElementById('moonIcon').style.display = state.isDarkMode ? 'none' : 'block';

    // Save the dark mode preference to localStorage
    localStorage.setItem('darkMode', theme);
});

// Calculation Formulas
const formulas = {
    Analysis: values => 0.66 * values.analysisControl + 0.34 * values.analysisTd,
    Algebra: values => 0.67 * values.algebraControl + 0.33 * values.algebraTd,
    ProbabilityStatistics: values => 0.66 * values.probStatsControl + 0.34 * values.probStatsTd,
    ProgrammingDataStructures: values => 0.68 * values.pdsControl + 0.16 * values.pdsTd + 0.16 * values.pdsTp,
    MachineStructure: values => 0.66 * values.machineControl + 0.34 * values.machineTd,
    ICT: values => 1.00 * values.ictControl,
    IntroOOP: values => 0.60 * values.oopControl + 0.40 * values.oopTp,
    GeneralElectricity: values => 0.70 * values.geControl + 0.30 * values.geTd,
    HistoryScience: values => 1.00 * values.historyControl
};
