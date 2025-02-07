// Made using AI (I don't know js lol)


const state = {
    isDarkMode: false, // Initialize dark mode state
    grades: {
        algoControl: '', algoTd: '', algoTp: '',
        analysisControl: '', analysisTd: '',
        algebraControl: '', algebraTd: '',
        compControl: '', compTd: '',
        criControl: '', criTd: '',
        terminology: '',
        english: '',
        bureautique: ''
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
const formulas = {
    Algorithms: values => 0.68 * values.algoControl + 0.16 * values.algoTd + 0.16 * values.algoTp,
    Analysis: values => 0.67 * values.analysisControl + 0.33 * values.analysisTd,
    Algebra: values => 0.60 * values.algebraControl + 0.40 * values.algebraTd,
    Comp: values => 0.60 * values.compControl + 0.40 * values.compTd,
    CRI: values => 0.67 * values.criControl + 0.33 * values.criTd,
    Terminology: values => 1.00 * values.terminology,
    Bureautique: values => 1.00 * values.bureautique,
    English: values => 1.00 * values.english
};

// Automatic Calculation
function updateCalculations() {
    const numbers = Object.fromEntries(
        Object.entries(state.grades).map(([key, value]) => [key, parseFloat(value) || 0])
    );

    // Calculate module grades
    state.results.modules = {
        Algorithms: formulas.Algorithms(numbers),
        Analysis: formulas.Analysis(numbers),
        Algebra: formulas.Algebra(numbers),
        Comp: formulas.Comp(numbers),
        CRI: formulas.CRI(numbers),
        Terminology: formulas.Terminology(numbers),
        Bureautique: formulas.Bureautique(numbers),
        English: formulas.English(numbers)
    };

    // Calculate unit grades
    state.results.unit1 = (state.results.modules.Algorithms * 2 +
        state.results.modules.Analysis * 2 +
        state.results.modules.Algebra) / 5;

    state.results.unit2 = (state.results.modules.Terminology +
        state.results.modules.Bureautique) / 2;

    state.results.unit3 = (state.results.modules.Comp +
        state.results.modules.CRI) / 2;

    state.results.unit4 = state.results.modules.English;

    // Calculate final result
    state.results.finalResult = (
        state.results.modules.Algorithms * 4 +
        state.results.modules.Analysis * 4 +
        state.results.modules.Algebra * 2 +
        state.results.modules.CRI * 2 +
        state.results.modules.Comp * 2 +
        state.results.modules.Terminology +
        state.results.modules.English +
        state.results.modules.Bureautique
    ) / 17;

    updateDisplay();
}

// Update Display
function updateDisplay() {
    // Update module grades
    document.querySelectorAll('.module-grade').forEach(el => {
        const moduleName = el.dataset.module;
        el.textContent = `Grade: ${state.results.modules[moduleName].toFixed(2)}`;
    });

    // Update unit grades
    document.querySelectorAll('.unit-grade').forEach((el, index) => {
        const unitKey = `unit${index + 1}`;
        el.textContent = state.results[unitKey].toFixed(2);
    });

    // Update final result
    document.getElementById('finalResult').textContent =
        `Final Result: ${state.results.finalResult.toFixed(2)}`;
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
        input.placeholder = field.placeholder; // Updated to include percentages
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
                title: 'Algorithms',
                coefficient: 4,
                fields: [
                    { name: 'algoTd', placeholder: 'TD (16%)' },
                    { name: 'algoTp', placeholder: 'TP (16%)' },
                    { name: 'algoControl', placeholder: 'Control (68%)' }
                ]
            },
            {
                title: 'Analysis',
                coefficient: 4,
                fields: [
                    { name: 'analysisTd', placeholder: 'TD (33%)' },
                    { name: 'analysisControl', placeholder: 'Control (67%)' }
                ]
            },
            {
                title: 'Algebra',
                coefficient: 2,
                fields: [
                    { name: 'algebraTd', placeholder: 'TD (40%)' },
                    { name: 'algebraControl', placeholder: 'Control (60%)' }
                ]
            }
        ]
    }));

    // Unit 2: Methodological
    unitSections.appendChild(createUnit({
        title: 'Unit 2: Methodological',
        gridClass: 'md:grid-cols-2',
        modules: [
            {
                title: 'Terminology',
                coefficient: 1,
                fields: [
                    { name: 'terminology', placeholder: 'Grade (100%)' }
                ]
            },
            {
                title: 'Bureautique',
                coefficient: 1,
                fields: [
                    { name: 'bureautique', placeholder: 'Grade (100%)' }
                ]
            }
        ]
    }));

    // Unit 3: Discovery
    unitSections.appendChild(createUnit({
        title: 'Unit 3: Discovery',
        gridClass: 'md:grid-cols-2',
        modules: [
            {
                title: 'Comp',
                coefficient: 2,
                fields: [
                    { name: 'compTd', placeholder: 'TD (40%)' },
                    { name: 'compControl', placeholder: 'Control (60%)' }
                ]
            },
            {
                title: 'CRI',
                coefficient: 2,
                fields: [
                    { name: 'criTd', placeholder: 'TD (33%)' },
                    { name: 'criControl', placeholder: 'Control (67%)' }
                ]
            }
        ]
    }));

    // Unit 4: Transversal
    unitSections.appendChild(createUnit({
        title: 'Unit 4: Transversal',
        gridClass: 'grid-cols-1',
        modules: [
            {
                title: 'English',
                coefficient: 1,
                fields: [
                    { name: 'english', placeholder: 'Grade (100%)' }
                ]
            }
        ]
    }));
}

init();

// Save/Load System
let savedGrades = JSON.parse(localStorage.getItem('savedGradesSemester1')) || [];

function saveCurrentGrades() {
    const saveName = prompt("Enter a name for this save:");
    if (!saveName) return;

    const saveData = {
        name: saveName,
        grades: state.grades,
        timestamp: new Date().toLocaleString()
    };

    savedGrades.push(saveData);
    localStorage.setItem('savedGradesSemester1', JSON.stringify(savedGrades));
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
    localStorage.setItem('savedGradesSemester1', JSON.stringify(savedGrades));
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