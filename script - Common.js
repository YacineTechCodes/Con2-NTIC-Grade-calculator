// common.js - Shared functions for all semester calculators

// Initialize the global state object with semester-specific properties
function initializeState(gradeFields) {
    return {
        isDarkMode: false,
        grades: gradeFields,
        results: {
            finalResult: 0.00,
            unit1: 0.00,
            unit2: 0.00,
            unit3: 0.00,
            modules: {}
        }
    };
}

// Load Dark Mode Preference
function loadDarkModePreference(state) {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
        state.isDarkMode = savedDarkMode === 'dark';
        document.documentElement.setAttribute('data-theme', savedDarkMode);
        document.getElementById('sunIcon').style.display = state.isDarkMode ? 'block' : 'none';
        document.getElementById('moonIcon').style.display = state.isDarkMode ? 'none' : 'block';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('sunIcon').style.display = 'none';
        document.getElementById('moonIcon').style.display = 'block';
    }
}

// Setup Dark Mode Toggle
function setupDarkModeToggle(state) {
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        state.isDarkMode = !state.isDarkMode;
        const theme = state.isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        document.getElementById('sunIcon').style.display = state.isDarkMode ? 'block' : 'none';
        document.getElementById('moonIcon').style.display = state.isDarkMode ? 'none' : 'block';
        localStorage.setItem('darkMode', theme);
    });
}

// Input Handling
function handleInput(e, state, updateCalculations) {
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

function handleBlur(e, state, updateCalculations) {
    const { name, value } = e.target;
    if (value === '') return;

    const numValue = parseFloat(value);
    const rounded = Math.round(numValue * 100) / 100;
    state.grades[name] = rounded;
    e.target.value = rounded.toFixed(2);
    updateCalculations();
}

// Generic Display Update
function updateDisplay(state, moduleNames) {
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
function createModule(moduleConfig, handleInputFn, handleBlurFn) {
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
        input.addEventListener('input', handleInputFn);
        input.addEventListener('blur', handleBlurFn);

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
function createUnit(unitConfig, handleInputFn, handleBlurFn) {
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
        grid.appendChild(createModule(module, handleInputFn, handleBlurFn));
    });

    unitDiv.appendChild(grid);
    return unitDiv;
}

// Save/Load System
function setupSaveLoadSystem(state, semesterKey) {
    let savedGrades = JSON.parse(localStorage.getItem(semesterKey)) || [];

    function saveCurrentGrades() {
        const saveName = prompt("Enter a name for this save:");
        if (!saveName) return;

        const saveData = {
            name: saveName,
            grades: state.grades,
            timestamp: new Date().toLocaleString()
        };

        savedGrades.push(saveData);
        localStorage.setItem(semesterKey, JSON.stringify(savedGrades));
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

        updateCalculations(); // This needs to be passed in
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
        localStorage.setItem(semesterKey, JSON.stringify(savedGrades));
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

    // Return functions that might be needed elsewhere
    return {
        saveCurrentGrades,
        loadGrades,
        updateSavesList,
        deleteSave
    };
}

// Detect if we are on the Home page
if (document.body.classList.contains('home-page')) {
    // Initialize state for Home page (no grades needed)
    const state = initializeState({});

    // Load dark mode preference and setup toggle
    loadDarkModePreference(state);
    setupDarkModeToggle(state);
}
