// common.js - Shared functions for all semester calculators

// Initialize the global state object with semester-specific properties
function initializeState(gradeFields) {
    return {
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

// Simple initialization for home page
if (document.body.classList.contains('home-page')) {
    // Initialize state for Home page (no grades needed)
    const state = initializeState({});
}

// Theme switcher functionality
const themes = {
    // Light variants
    'light': {
        '--bg-color': '#ffffff',
        '--text-color': '#1a1a1a',
        '--primary': '#4f46e5',
        '--border-color': '#e0e7ff',
        '--input-bg': '#f8fafc',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #eef2ff, #ffffff)'
    },
    'forest-light': {
        '--bg-color': '#f8faf8',
        '--text-color': '#1e3a29',
        '--primary': '#2d6a4f',
        '--border-color': '#d8f3dc',
        '--input-bg': '#f1f8f2',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #e9f5ec, #ffffff)'
    },
    'ocean-light': {
        '--bg-color': '#f0f4f8',
        '--text-color': '#0d3b66',
        '--primary': '#1e6091',
        '--border-color': '#caf0f8',
        '--input-bg': '#ecf5fc',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #e0f7fa, #ffffff)'
    },
    'sunset-light': {
        '--bg-color': '#fff8f3',
        '--text-color': '#6a3d2b',
        '--primary': '#e76f51',
        '--border-color': '#ffefeb',
        '--input-bg': '#fff8f5',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #ffeeeb, #ffffff)'
    },

    // Dark variants
    'dark': {
        '--bg-color': '#1a1a1a',
        '--text-color': '#f8fafc',
        '--primary': '#818cf8',
        '--border-color': '#374151',
        '--input-bg': '#2a2a2a',
        '--module-bg': '#222222',
        '--unit-bg': 'linear-gradient(to bottom right, #1f2937, #111827)'
    },
    'forest-dark': {
        '--bg-color': '#1a2c1a',
        '--text-color': '#e0f2e0',
        '--primary': '#4ade80',
        '--border-color': '#2d5a3d',
        '--input-bg': '#243024',
        '--module-bg': '#1e2a1e',
        '--unit-bg': 'linear-gradient(to bottom right, #1e3a29, #162016)'
    },
    'ocean-dark': {
        '--bg-color': '#0f172a',
        '--text-color': '#e0f2fe',
        '--primary': '#38bdf8',
        '--border-color': '#1e3a5f',
        '--input-bg': '#1e293b',
        '--module-bg': '#162032',
        '--unit-bg': 'linear-gradient(to bottom right, #0c4a6e, #0f172a)'
    },
    'sunset-dark': {
        '--bg-color': '#27161a',
        '--text-color': '#ffece8',
        '--primary': '#fb923c',
        '--border-color': '#4c2c2a',
        '--input-bg': '#331f27',
        '--module-bg': '#2b1820',
        '--unit-bg': 'linear-gradient(to bottom right, #431e1d, #27161a)'
    }
};

// Apply theme
function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;

    // Apply CSS variables
    Object.entries(theme).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
    });

    // Save theme preference
    localStorage.setItem('preferredTheme', themeName);
}

// Initialize theme
function initTheme() {
    // Only create theme switcher on home page
    if (document.body.classList.contains('home-page')) {
        createThemeSwitcher();
    }

    // Load saved theme or default to light (on all pages)
    const savedTheme = localStorage.getItem('preferredTheme') || 'light';
    applyTheme(savedTheme);

    // Set the active class on the button (only on home page)
    if (document.body.classList.contains('home-page')) {
        const activeButton = document.querySelector(`[data-theme="${savedTheme}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
}

// Create theme switcher UI (only called on home page)
function createThemeSwitcher() {
    const container = document.querySelector('.container');
    if (!container) return;

    // Create theme section
    const themeSection = document.createElement('div');
    themeSection.className = 'theme-section';

    // Create theme heading
    const themeHeading = document.createElement('h3');
    themeHeading.textContent = 'Choose Theme';
    themeSection.appendChild(themeHeading);

    // Create theme buttons container
    const themeButtons = document.createElement('div');
    themeButtons.className = 'theme-buttons';

    // Define theme groups
    const themeGroups = {
        'Default': ['light', 'dark'],
        'Forest': ['forest-light', 'forest-dark'],
        'Ocean': ['ocean-light', 'ocean-dark'],
        'Sunset': ['sunset-light', 'sunset-dark']
    };

    // Add theme buttons by group
    Object.entries(themeGroups).forEach(([groupName, themeNames]) => {
        // Create group label
        const groupLabel = document.createElement('div');
        groupLabel.className = 'theme-group-label';
        groupLabel.textContent = groupName;
        themeButtons.appendChild(groupLabel);

        // Create theme variant container
        const variantContainer = document.createElement('div');
        variantContainer.className = 'theme-variant-container';

        // Add theme variant buttons
        themeNames.forEach(themeName => {
            const button = document.createElement('button');
            button.className = 'theme-button';
            button.dataset.theme = themeName;

            // Set display name (Light/Dark variant)
            const isLight = themeName.includes('light');
            button.textContent = isLight ? 'Light' : 'Dark';

            button.addEventListener('click', () => {
                // Remove active class from all buttons
                document.querySelectorAll('.theme-button').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add active class to clicked button
                button.classList.add('active');

                // Apply theme
                applyTheme(themeName);
            });

            variantContainer.appendChild(button);
        });

        themeButtons.appendChild(variantContainer);
    });

    themeSection.appendChild(themeButtons);

    // Insert after semester nav on home page
    const card = document.querySelector('.card');
    if (card) {
        container.insertBefore(themeSection, card);
    } else {
        container.prepend(themeSection);
    }
}

// Apply theme immediately before DOM is fully loaded to prevent flash
(function () {
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme && themes[savedTheme]) {
        applyTheme(savedTheme);
    }
})();

// Initialize theme UI on page load
document.addEventListener('DOMContentLoaded', initTheme);

