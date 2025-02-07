// Made using AI (I don't know js lol)


const state = {
    isDarkMode: false,
    grades: {
        // Unit 1
        analysisControl: '', analysisTd: '',
        algebraControl: '', algebraTd: '',
        probStatsControl: '', probStatsTd: '',

        // Unit 2
        pdsControl: '', pdsTd: '', pdsTp: '',
        machineControl: '', machineTd: '',

        // Unit 3
        ictControl: '',
        oopControl: '', oopTp: '',

        // Unit 4
        geControl: '', geTd: '',
        historyControl: ''
    },
    results: {
        finalResult: 0.00,
        unit1: 0.00,
        unit2: 0.00,
        unit3: 0.00,
        unit4: 0.00,
        modules: {}
    }
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

// Input Handling
function handleInput(e) {
    const { name, value } = e.target;

    if (value === '') {
        state.grades[name] = '';
        updateCalculations();
        return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        e.target.value = state.grades[name] || '';
        return;
    }

    if (numValue < 0 || numValue > 20) {
        e.target.value = state.grades[name] || '';
        return;
    }

    state.grades[name] = numValue;
    updateCalculations();
}

function handleBlur(e) {
    const { name, value } = e.target;
    if (value === '') return;

    const numValue = parseFloat(value);
    const rounded = Math.round(numValue * 100) / 100;
    state.grades[name] = rounded;
    e.target.value = rounded.toFixed(2);
    updateCalculations();
}

// Calculation Formulas
const moduleNames = {
    'Analysis': 'Analysis',
    'Algebra': 'Algebra',
    'Probability & Statistics': 'ProbabilityStatistics',
    'Programming & Data Structures': 'ProgrammingDataStructures',
    'Machine Structure': 'MachineStructure',
    'ICT': 'ICT',
    'Intro to OOP': 'IntroOOP',
    'General Electricity': 'GeneralElectricity',
    'History of Sciences': 'HistoryScience'
};

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

// Automatic Calculation
function updateCalculations() {
    const numbers = Object.fromEntries(
        Object.entries(state.grades).map(([key, value]) => [key, parseFloat(value) || 0])
    );

    // Module grades
    state.results.modules = {
        Analysis: formulas.Analysis(numbers),
        Algebra: formulas.Algebra(numbers),
        ProbabilityStatistics: formulas.ProbabilityStatistics(numbers),
        ProgrammingDataStructures: formulas.ProgrammingDataStructures(numbers),
        MachineStructure: formulas.MachineStructure(numbers),
        ICT: formulas.ICT(numbers),
        IntroOOP: formulas.IntroOOP(numbers),
        GeneralElectricity: formulas.GeneralElectricity(numbers),
        HistoryScience: formulas.HistoryScience(numbers)
    };

    // Unit averages
    state.results.unit1 = (
        state.results.modules.Analysis * 2 +
        state.results.modules.Algebra * 2 +
        state.results.modules.ProbabilityStatistics * 1
    ) / 5;

    state.results.unit2 = (
        state.results.modules.ProgrammingDataStructures * 3 +
        state.results.modules.MachineStructure * 2
    ) / 5;

    state.results.unit3 = (
        state.results.modules.ICT * 2 +
        state.results.modules.IntroOOP * 1
    ) / 3;

    state.results.unit4 = (
        state.results.modules.GeneralElectricity * 2 +
        state.results.modules.HistoryScience * 1
    ) / 3;

    // Final result (total weighted average)
    state.results.finalResult = (
        state.results.modules.Analysis * 2 +
        state.results.modules.Algebra * 2 +
        state.results.modules.ProbabilityStatistics * 1 +
        state.results.modules.ProgrammingDataStructures * 3 +
        state.results.modules.MachineStructure * 2 +
        state.results.modules.ICT * 2 +
        state.results.modules.IntroOOP * 1 +
        state.results.modules.GeneralElectricity * 2 +
        state.results.modules.HistoryScience * 1
    ) / 16; // Total coefficients = 16

    updateDisplay();
}

// Update Display
function updateDisplay() {
    // Update module grades
    document.querySelectorAll('.module-grade').forEach(el => {
        const moduleName = el.dataset.module;
        const internalName = moduleNames[moduleName];
        if (internalName && state.results.modules[internalName] !== undefined) {
            el.textContent = `Grade: ${state.results.modules[internalName].toFixed(2)}`;
        }
    });

    // Update unit grades
    document.querySelectorAll('.unit-grade').forEach((el, index) => {
        const unitKey = `unit${index + 1}`;
        if (state.results[unitKey] !== undefined) {
            el.textContent = state.results[unitKey].toFixed(2);
        }
    });

    // Update final result
    const finalResultElement = document.getElementById('finalResult');
    if (finalResultElement) {
        finalResultElement.textContent = `Final Result: ${state.results.finalResult.toFixed(2)}`;
    }
}

// Module Creator
function createModule(moduleConfig) {
    const moduleDiv = document.createElement('div');
    moduleDiv.className = 'module';

    const header = document.createElement('div');
    header.className = 'module-header';

    const title = document.createElement('h3');
    title.textContent = moduleConfig.title;

    if (moduleConfig.coefficient) {
        const coef = document.createElement('span');
        coef.className = 'coefficient';
        coef.textContent = `Coef: ${moduleConfig.coefficient}`;
        header.appendChild(coef);
    }

    header.prepend(title);
    moduleDiv.appendChild(header);

    moduleConfig.fields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.max = 20;
        input.name = field.name;
        input.placeholder = field.placeholder;
        input.onwheel = () => input.blur();
        input.addEventListener('input', handleInput);
        input.addEventListener('blur', handleBlur);

        const max = document.createElement('span');
        max.textContent = '/20';

        group.appendChild(input);
        group.appendChild(max);
        moduleDiv.appendChild(group);
    });

    const gradeDisplay = document.createElement('div');
    gradeDisplay.className = 'module-grade';
    gradeDisplay.dataset.module = moduleConfig.title;
    gradeDisplay.textContent = 'Grade: 0.00';
    moduleDiv.appendChild(gradeDisplay);

    return moduleDiv;
}


// Unit Creator
function createUnit(unitConfig) {
    const unitDiv = document.createElement('div');
    unitDiv.className = 'unit-section';

    const header = document.createElement('div');
    header.className = 'unit-header';

    const title = document.createElement('h2');
    title.textContent = unitConfig.title;

    const grade = document.createElement('span');
    grade.className = 'unit-grade';
    grade.textContent = '0.00';

    header.appendChild(title);
    header.appendChild(grade);
    unitDiv.appendChild(header);

    const grid = document.createElement('div');
    grid.className = `grid ${unitConfig.gridClass}`;

    unitConfig.modules.forEach(module => {
        grid.appendChild(createModule(module));
    });

    unitDiv.appendChild(grid);
    return unitDiv;
}

// Initialize Calculator
function init() {
    const unitSections = document.getElementById('unitSections');

    // Unit 1: Fundamental
    unitSections.appendChild(createUnit({
        title: 'Unit 1: Fundamental',
        gridClass: 'md:grid-cols-3',
        modules: [
            {
                title: 'Analysis',
                coefficient: 2,
                fields: [
                    { name: 'analysisControl', placeholder: 'Control (66%)' },
                    { name: 'analysisTd', placeholder: 'TD (34%)' }
                ]
            },
            {
                title: 'Algebra',
                coefficient: 2,
                fields: [
                    { name: 'algebraControl', placeholder: 'Control (67%)' },
                    { name: 'algebraTd', placeholder: 'TD (33%)' }
                ]
            },
            {
                title: 'Probability & Statistics',
                coefficient: 1,
                fields: [
                    { name: 'probStatsControl', placeholder: 'Control (66%)' },
                    { name: 'probStatsTd', placeholder: 'TD (34%)' }
                ]
            }
        ]
    }));

    // Unit 2: Fundamental
    unitSections.appendChild(createUnit({
        title: 'Unit 2: Fundamental',
        gridClass: 'md:grid-cols-2',
        modules: [
            {
                title: 'Programming & Data Structures',
                coefficient: 3,
                fields: [
                    { name: 'pdsControl', placeholder: 'Control (68%)' },
                    { name: 'pdsTd', placeholder: 'TD (16%)' },
                    { name: 'pdsTp', placeholder: 'TP (16%)' }
                ]
            },
            {
                title: 'Machine Structure',
                coefficient: 2,
                fields: [
                    { name: 'machineControl', placeholder: 'Control (66%)' },
                    { name: 'machineTd', placeholder: 'TD (34%)' }
                ]
            }
        ]
    }));

    // Unit 3: Methodological
    unitSections.appendChild(createUnit({
        title: 'Unit 3: Methodological',
        gridClass: 'md:grid-cols-2',
        modules: [
            {
                title: 'ICT',
                coefficient: 2,
                fields: [
                    { name: 'ictControl', placeholder: 'Control (100%)' }
                ]
            },
            {
                title: 'Intro to OOP',
                coefficient: 1,
                fields: [
                    { name: 'oopControl', placeholder: 'Control (60%)' },
                    { name: 'oopTp', placeholder: 'TP (40%)' }
                ]
            }
        ]
    }));

    // Unit 4: Transversal
    unitSections.appendChild(createUnit({
        title: 'Unit 4: Transversal',
        gridClass: 'md:grid-cols-2',
        modules: [
            {
                title: 'General Electricity',
                coefficient: 2,
                fields: [
                    { name: 'geControl', placeholder: 'Control (70%)' },
                    { name: 'geTd', placeholder: 'TD (30%)' }
                ]
            },
            {
                title: 'History of Sciences',
                coefficient: 1,
                fields: [
                    { name: 'historyControl', placeholder: 'Control (100%)' }
                ]
            }
        ]
    }));
}


init();

// Save/Load System
let savedGrades = JSON.parse(localStorage.getItem('savedGradesSemester2')) || [];

function saveCurrentGrades() {
    const saveName = prompt("Enter a name for this save:");
    if (!saveName) return;

    const saveData = {
        name: saveName,
        grades: state.grades,
        timestamp: new Date().toLocaleString()
    };

    savedGrades.push(saveData);
    localStorage.setItem('savedGradesSemester2', JSON.stringify(savedGrades));
    updateSavesList();
}

function loadGrades(saveIndex) {
    const save = savedGrades[saveIndex];
    if (!save) return;

    // Update state with saved grades
    Object.keys(save.grades).forEach(key => {
        state.grades[key] = save.grades[key];
        const input = document.querySelector(`input[name="${key}"]`);
        if (input) {
            input.value = save.grades[key];
        }
    });

    updateCalculations();
    alert(`Loaded save: ${save.name}`);
}

function updateSavesList() {
    const savesList = document.getElementById('savesList');
    savesList.innerHTML = '<h4>Saved Grades:</h4>';

    if (savedGrades.length === 0) {
        savesList.innerHTML += '<p>No saves found.</p>';
        return;
    }

    savedGrades.forEach((save, index) => {
        const button = document.createElement('button');
        button.textContent = `${save.name} (${save.timestamp})`;
        button.addEventListener('click', () => loadGrades(index));
        savesList.appendChild(button);
    });
}

function deleteSave(saveIndex) {
    savedGrades.splice(saveIndex, 1);
    localStorage.setItem('savedGradesSemester2', JSON.stringify(savedGrades));
    updateSavesList();
}

// Event Listeners for Save/Load
document.getElementById('saveButton').addEventListener('click', saveCurrentGrades);
document.getElementById('loadButton').addEventListener('click', () => {
    if (savedGrades.length === 0) {
        alert("No saved grades found!");
        return;
    }
    updateSavesList();
});

// Initialize Saves List
updateSavesList();