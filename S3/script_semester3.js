// Made using AI (I don't know js lol)

const state = {
    isDarkMode: false,
    grades: {
        // Unit 1
        algoDSControl: '', algoDSTd: '', algoDSTp: '',
        compArchControl: '', compArchTp: '',
        mathLogicControl: '', mathLogicTd: '',

        // Unit 2
        oopControl: '', oopTd: '', oopTp: '',
        infoSysControl: '', infoSysTd: '',
        langTheoryControl: '', langTheoryTd: '',

        // Unit 3
        english2Control: ''
    },
    results: {
        finalResult: 0.00,
        unit1: 0.00,
        unit2: 0.00,
        unit3: 0.00,
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
const formulas = {
    AlgorithmsDataStructures: values => 0.60 * values.algoDSControl + 0.20 * values.algoDSTd + 0.20 * values.algoDSTp,
    ComputerArchitecture: values => 0.67 * values.compArchControl + 0.33 * values.compArchTp,
    MathematicalLogic: values => 0.67 * values.mathLogicControl + 0.33 * values.mathLogicTd,
    ObjectOrientedProgramming: values => 0.67 * values.oopControl + 0.165 * values.oopTd + 0.165 * values.oopTp,
    InformationSystems: values => 0.67 * values.infoSysControl + 0.33 * values.infoSysTd,
    LanguageTheory: values => 0.50 * values.langTheoryControl + 0.50 * values.langTheoryTd,
    English2: values => 1.00 * values.english2Control
};


// Update calculations for Semester 2
function updateCalculations() {
    const numbers = Object.fromEntries(
        Object.entries(state.grades).map(([key, value]) => [key, parseFloat(value) || 0])
    );

    // Module grades
    state.results.modules = {
        AlgorithmsDataStructures: formulas.AlgorithmsDataStructures(numbers),
        ComputerArchitecture: formulas.ComputerArchitecture(numbers),
        MathematicalLogic: formulas.MathematicalLogic(numbers),
        ObjectOrientedProgramming: formulas.ObjectOrientedProgramming(numbers),
        InformationSystems: formulas.InformationSystems(numbers),
        LanguageTheory: formulas.LanguageTheory(numbers),
        English2: formulas.English2(numbers)
    };

    // Unit averages
    state.results.unit1 = (
        state.results.modules.AlgorithmsDataStructures * 3 +
        state.results.modules.ComputerArchitecture * 2 +
        state.results.modules.MathematicalLogic * 2
    ) / 7;

    state.results.unit2 = (
        state.results.modules.ObjectOrientedProgramming * 3 +
        state.results.modules.InformationSystems * 3 +
        state.results.modules.LanguageTheory * 2
    ) / 8;

    state.results.unit3 = state.results.modules.English2;

    // Final result (total weighted average)
    state.results.finalResult = (
        state.results.modules.AlgorithmsDataStructures * 3 +
        state.results.modules.ComputerArchitecture * 2 +
        state.results.modules.MathematicalLogic * 2 +
        state.results.modules.ObjectOrientedProgramming * 3 +
        state.results.modules.InformationSystems * 3 +
        state.results.modules.LanguageTheory * 2 +
        state.results.modules.English2 * 1
    ) / 16; // Total coefficients = 16

    updateDisplay();
}

// Add mapping between display names and internal names
const moduleNames = {
    'Algorithms & Data Structures': 'AlgorithmsDataStructures',
    'Computer Architecture': 'ComputerArchitecture',
    'Mathematical Logic': 'MathematicalLogic',
    'Object-Oriented Programming': 'ObjectOrientedProgramming',
    'Information Systems': 'InformationSystems',
    'Language Theory': 'LanguageTheory',
    'English 2': 'English2'
};

// Update Display function with proper name mapping
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
// Initialize units and modules for Semester 3
function init() {
    const unitSections = document.getElementById('unitSections');

    // Unit 1: Fundamental
    unitSections.appendChild(createUnit({
        title: 'Unit 1: Fundamental',
        gridClass: 'md:grid-cols-3',
        modules: [
            {
                title: 'Algorithms & Data Structures',
                coefficient: 3,
                fields: [
                    { name: 'algoDSControl', placeholder: 'Control (60%)' },
                    { name: 'algoDSTd', placeholder: 'TD (20%)' },
                    { name: 'algoDSTp', placeholder: 'TP (20%)' }
                ]
            },
            {
                title: 'Computer Architecture',
                coefficient: 2,
                fields: [
                    { name: 'compArchControl', placeholder: 'Control (67%)' },
                    { name: 'compArchTp', placeholder: 'TP (33%)' }
                ]
            },
            {
                title: 'Mathematical Logic',
                coefficient: 2,
                fields: [
                    { name: 'mathLogicControl', placeholder: 'Control (67%)' },
                    { name: 'mathLogicTd', placeholder: 'TD (33%)' }
                ]
            }
        ]
    }));

    // Unit 2: Fundamental
    unitSections.appendChild(createUnit({
        title: 'Unit 2: Fundamental',
        gridClass: 'md:grid-cols-3',
        modules: [
            {
                title: 'Object-Oriented Programming',
                coefficient: 3,
                fields: [
                    { name: 'oopControl', placeholder: 'Control (67%)' },
                    { name: 'oopTd', placeholder: 'TD (16.5%)' },
                    { name: 'oopTp', placeholder: 'TP (16.5%)' }
                ]
            },
            {
                title: 'Information Systems',
                coefficient: 3,
                fields: [
                    { name: 'infoSysControl', placeholder: 'Control (67%)' },
                    { name: 'infoSysTd', placeholder: 'TD (33%)' }
                ]
            },
            {
                title: 'Language Theory',
                coefficient: 2,
                fields: [
                    { name: 'langTheoryControl', placeholder: 'Control (50%)' },
                    { name: 'langTheoryTd', placeholder: 'TD (50%)' }
                ]
            }
        ]
    }));

    // Unit 3: Methodological
    unitSections.appendChild(createUnit({
        title: 'Unit 3: Methodological',
        gridClass: 'grid-cols-1',
        modules: [
            {
                title: 'English 2',
                coefficient: 1,
                fields: [
                    { name: 'english2Control', placeholder: 'Control (100%)' }
                ]
            }
        ]
    }));
}

init();
// Save/Load System
let savedGrades = JSON.parse(localStorage.getItem('savedGradesSemester3')) || [];

function saveCurrentGrades() {
    const saveName = prompt("Enter a name for this save:");
    if (!saveName) return;

    const saveData = {
        name: saveName,
        grades: state.grades,
        timestamp: new Date().toLocaleString()
    };

    savedGrades.push(saveData);
    localStorage.setItem('savedGradesSemester3', JSON.stringify(savedGrades));
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
    localStorage.setItem('savedGradesSemester3', JSON.stringify(savedGrades));
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