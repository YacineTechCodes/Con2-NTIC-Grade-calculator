// semester3.js - Specific code for Semester 3

// Track TD/TP mode for Algorithms & Data Structures
let algoDSMergedMode = true; // true = merged (TD+TP), false = separate (TD, TP)

// Initialize state for Semester 3 (include all possible fields)
const state = initializeState({
    // Unit 1
    algoDSControl: '',
    algoDSTdTp: '',      // Merged mode field
    algoDSTd: '',        // Separate mode - TD
    algoDSTp: '',        // Separate mode - TP
    compArchControl: '', compArchTp: '',
    mathLogicControl: '', mathLogicTd: '',

    // Unit 2
    oopControl: '', oopTp: '',
    infoSysControl: '', infoSysTd: '',
    langTheoryControl: '', langTheoryTd: '',

    // Unit 3
    english2Control: ''
});

// Calculation Formulas
const formulas = {
    // Dynamic formula based on mode
    AlgorithmsDataStructures: values => {
        if (algoDSMergedMode) {
            return 0.60 * values.algoDSControl + 0.40 * values.algoDSTdTp;
        } else {
            return 0.60 * values.algoDSControl + 0.20 * values.algoDSTd + 0.20 * values.algoDSTp;
        }
    },
    ComputerArchitecture: values => 0.66 * values.compArchControl + 0.34 * values.compArchTp,
    MathematicalLogic: values => 0.67 * values.mathLogicControl + 0.33 * values.mathLogicTd,
    ObjectOrientedProgramming: values => 0.67 * values.oopControl + 0.33 * values.oopTp,
    InformationSystems: values => 0.60 * values.infoSysControl + 0.40 * values.infoSysTd,
    LanguageTheory: values => 0.60 * values.langTheoryControl + 0.40 * values.langTheoryTd,
    English2: values => 1.00 * values.english2Control
};

// Module name mapping
const moduleNames = {
    'Algorithms & Data Structures': 'AlgorithmsDataStructures',
    'Computer Architecture': 'ComputerArchitecture',
    'Mathematical Logic': 'MathematicalLogic',
    'Object-Oriented Programming': 'ObjectOrientedProgramming',
    'Information Systems': 'InformationSystems',
    'Language Theory': 'LanguageTheory',
    'English 2': 'English2'
};

// Update calculations for Semester 3
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

    updateDisplay(state, moduleNames);
}

// Toggle TD/TP mode for Algorithms & Data Structures
function toggleAlgoDSMode() {
    // Check if current mode has values
    let hasValues = false;
    if (algoDSMergedMode) {
        hasValues = state.grades.algoDSTdTp !== '' && state.grades.algoDSTdTp !== 0;
    } else {
        hasValues = (state.grades.algoDSTd !== '' && state.grades.algoDSTd !== 0) ||
            (state.grades.algoDSTp !== '' && state.grades.algoDSTp !== 0);
    }

    // Ask for confirmation if there are values
    if (hasValues) {
        if (!confirm('Switching modes will clear the TD/TP values. Continue?')) {
            return;
        }
    }

    // Clear the values for current mode
    if (algoDSMergedMode) {
        state.grades.algoDSTdTp = '';
    } else {
        state.grades.algoDSTd = '';
        state.grades.algoDSTp = '';
    }

    // Toggle mode
    algoDSMergedMode = !algoDSMergedMode;

    // Rebuild the Algorithms & Data Structures module
    rebuildAlgoDSModule();
    updateCalculations();
}

// Rebuild the Algorithms & Data Structures module with current mode
function rebuildAlgoDSModule() {
    const handleInputFn = (e) => handleInput(e, state, updateCalculations);
    const handleBlurFn = (e) => handleBlur(e, state, updateCalculations);

    const algoDSModule = document.querySelector('[data-module-id="algods"]');
    if (!algoDSModule) return;

    // Clear existing input groups (keep header and grade display)
    const inputGroups = algoDSModule.querySelectorAll('.input-group');
    inputGroups.forEach(group => group.remove());

    // Get reference points
    const gradeDisplay = algoDSModule.querySelector('.module-grade');

    // Create new fields based on mode
    const fields = algoDSMergedMode
        ? [
            { name: 'algoDSControl', placeholder: 'Control (60%)' },
            { name: 'algoDSTdTp', placeholder: 'TD + TP + Interro (40%)' }
        ]
        : [
            { name: 'algoDSControl', placeholder: 'Control (60%)' },
            { name: 'algoDSTd', placeholder: 'TD (20%)' },
            { name: 'algoDSTp', placeholder: 'TP (20%)' }
        ];

    // Create and insert input groups
    fields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.max = 20;
        input.step = 0.01;
        input.name = field.name;
        input.placeholder = field.placeholder;
        input.value = state.grades[field.name] !== '' ? state.grades[field.name] : '';
        input.onwheel = () => input.blur();
        input.addEventListener('input', handleInputFn);
        input.addEventListener('blur', handleBlurFn);

        const max = document.createElement('span');
        max.textContent = '/20';

        group.appendChild(input);
        group.appendChild(max);

        // Insert before grade display
        algoDSModule.insertBefore(group, gradeDisplay);
    });

    // Update toggle button text
    const toggleBtn = algoDSModule.querySelector('.toggle-mode-btn');
    if (toggleBtn) {
        toggleBtn.textContent = algoDSMergedMode ? '⇄ Split' : '⇄ Merge';
        toggleBtn.title = algoDSMergedMode
            ? 'Switch to separate TD and TP inputs'
            : 'Switch to merged TD+TP input';
    }
}

// Create custom Algorithms & Data Structures module with toggle button
function createAlgoDSModule(handleInputFn, handleBlurFn) {
    const moduleDiv = document.createElement('div');
    moduleDiv.className = 'module';
    moduleDiv.dataset.moduleId = 'algods';

    // Create header
    const header = document.createElement('div');
    header.className = 'module-header';

    const title = document.createElement('h3');
    title.textContent = 'Algorithms & Data Structures';

    const headerRight = document.createElement('div');
    headerRight.style.display = 'flex';
    headerRight.style.alignItems = 'center';
    headerRight.style.gap = '8px';

    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-mode-btn';
    toggleBtn.textContent = algoDSMergedMode ? '⇄ Split' : '⇄ Merge';
    toggleBtn.title = algoDSMergedMode
        ? 'Switch to separate TD and TP inputs'
        : 'Switch to merged TD+TP input';
    toggleBtn.style.cssText = `
        padding: 4px 8px;
        font-size: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--input-bg);
        color: var(--text-color);
        cursor: pointer;
        min-height: 28px;
        min-width: auto;
    `;
    toggleBtn.addEventListener('click', toggleAlgoDSMode);

    // Coefficient
    const coef = document.createElement('span');
    coef.className = 'coefficient';
    coef.textContent = 'Coef: 3';

    headerRight.appendChild(toggleBtn);
    headerRight.appendChild(coef);
    header.appendChild(title);
    header.appendChild(headerRight);
    moduleDiv.appendChild(header);

    // Create initial input fields based on mode
    const fields = algoDSMergedMode
        ? [
            { name: 'algoDSControl', placeholder: 'Control (60%)' },
            { name: 'algoDSTdTp', placeholder: 'TD + TP + Interro (40%)' }
        ]
        : [
            { name: 'algoDSControl', placeholder: 'Control (60%)' },
            { name: 'algoDSTd', placeholder: 'TD (20%)' },
            { name: 'algoDSTp', placeholder: 'TP (20%)' }
        ];

    fields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.max = 20;
        input.step = 0.01;
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

    // Create grade display
    const gradeDisplay = document.createElement('div');
    gradeDisplay.className = 'module-grade';
    gradeDisplay.dataset.module = 'Algorithms & Data Structures';
    gradeDisplay.textContent = 'Grade: 0.00';
    moduleDiv.appendChild(gradeDisplay);

    return moduleDiv;
}

// Detect mode from saved data
function detectModeFromSave(savedGrades) {
    // If separate mode fields have values, use separate mode
    const hasSeparate = (savedGrades.algoDSTd !== undefined && savedGrades.algoDSTd !== '') ||
        (savedGrades.algoDSTp !== undefined && savedGrades.algoDSTp !== '');
    const hasMerged = savedGrades.algoDSTdTp !== undefined && savedGrades.algoDSTdTp !== '';

    if (hasSeparate && !hasMerged) {
        return false; // separate mode
    }
    return true; // merged mode (default)
}

// Custom load handler that detects and applies the correct mode
function customLoadGrades(save) {
    const newMode = detectModeFromSave(save.grades);

    // If mode needs to change, switch it first (without confirmation since we're loading)
    if (newMode !== algoDSMergedMode) {
        // Clear current values silently
        if (algoDSMergedMode) {
            state.grades.algoDSTdTp = '';
        } else {
            state.grades.algoDSTd = '';
            state.grades.algoDSTp = '';
        }
        algoDSMergedMode = newMode;
        rebuildAlgoDSModule();
    }

    // Now load the saved values
    Object.keys(state.grades).forEach(key => {
        state.grades[key] = '';
        const input = document.querySelector(`input[name="${key}"]`);
        if (input) input.value = '';
    });

    Object.keys(save.grades).forEach(key => {
        if (key in state.grades) {
            const savedValue = save.grades[key];
            state.grades[key] = savedValue;
            const input = document.querySelector(`input[name="${key}"]`);
            if (input) {
                input.value = savedValue !== '' ? savedValue : '';
            }
        }
    });

    updateCalculations();
    requestAnimationFrame(() => updateCalculations());
}

// Initialize the page
function init() {
    // Create input handlers with specific state
    const handleInputFn = (e) => handleInput(e, state, updateCalculations);
    const handleBlurFn = (e) => handleBlur(e, state, updateCalculations);

    const unitSections = document.getElementById('unitSections');

    // Unit 1: Fundamental (with custom AlgoDS module)
    const unit1Div = document.createElement('div');
    unit1Div.className = 'unit-section';

    const unit1Header = document.createElement('div');
    unit1Header.className = 'unit-header';
    const unit1Title = document.createElement('h2');
    unit1Title.textContent = 'Unit 1: Fundamental';
    const unit1Grade = document.createElement('span');
    unit1Grade.className = 'unit-grade';
    unit1Grade.textContent = '0.00';
    unit1Header.appendChild(unit1Title);
    unit1Header.appendChild(unit1Grade);
    unit1Div.appendChild(unit1Header);

    const unit1Grid = document.createElement('div');
    unit1Grid.className = 'grid md:grid-cols-3';

    // Add custom AlgoDS module
    unit1Grid.appendChild(createAlgoDSModule(handleInputFn, handleBlurFn));

    // Add other modules
    unit1Grid.appendChild(createModule({
        title: 'Computer Architecture',
        coefficient: 2,
        fields: [
            { name: 'compArchControl', placeholder: 'Control (66%)' },
            { name: 'compArchTp', placeholder: 'TP (34%)' }
        ]
    }, handleInputFn, handleBlurFn));

    unit1Grid.appendChild(createModule({
        title: 'Mathematical Logic',
        coefficient: 2,
        fields: [
            { name: 'mathLogicControl', placeholder: 'Control (67%)' },
            { name: 'mathLogicTd', placeholder: 'TD (33%)' }
        ]
    }, handleInputFn, handleBlurFn));

    unit1Div.appendChild(unit1Grid);
    unitSections.appendChild(unit1Div);

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
                    { name: 'oopTp', placeholder: 'TP (33%)' }
                ]
            },
            {
                title: 'Information Systems',
                coefficient: 3,
                fields: [
                    { name: 'infoSysControl', placeholder: 'Control (60%)' },
                    { name: 'infoSysTd', placeholder: 'TD (40%)' }
                ]
            },
            {
                title: 'Language Theory',
                coefficient: 2,
                fields: [
                    { name: 'langTheoryControl', placeholder: 'Control (60%)' },
                    { name: 'langTheoryTd', placeholder: 'TD (40%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

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
    }, handleInputFn, handleBlurFn));

    // Setup save/load system with custom load handler
    let savedGrades = JSON.parse(localStorage.getItem('savedGradesSemester3')) || [];
    const savesList = document.getElementById('savesList');

    // Custom saves list renderer with mode detection
    function updateSavesListCustom() {
        if (!savesList) return;
        savesList.innerHTML = '<h4>Saved Grades:</h4>';

        if (savedGrades.length === 0) {
            savesList.innerHTML += '<p>No saves found.</p>';
            return;
        }

        savedGrades.forEach((save, index) => {
            const saveItem = document.createElement('div');
            saveItem.className = 'save-item';

            const loadButton = document.createElement('button');
            loadButton.textContent = `${save.name} (${save.timestamp})`;
            loadButton.className = 'load-save-button';
            loadButton.addEventListener('click', () => {
                customLoadGrades(save);
                const loadBtn = document.getElementById('loadButton');
                if (loadBtn) {
                    const originalText = loadBtn.textContent;
                    loadBtn.textContent = 'Loaded!';
                    setTimeout(() => loadBtn.textContent = originalText, 2000);
                }
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.className = 'delete-button';
            deleteButton.title = 'Delete this save';
            deleteButton.addEventListener('click', () => {
                if (confirm(`Delete save "${save.name}"?`)) {
                    savedGrades.splice(index, 1);
                    localStorage.setItem('savedGradesSemester3', JSON.stringify(savedGrades));
                    updateSavesListCustom();
                }
            });

            saveItem.appendChild(loadButton);
            saveItem.appendChild(deleteButton);
            savesList.appendChild(saveItem);
        });
    }

    updateSavesListCustom();

    // Setup save button
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const saveName = prompt("Enter a name for this save:");
            if (!saveName || saveName.trim() === '') return;

            const saveData = {
                name: saveName.trim(),
                grades: { ...state.grades },
                timestamp: new Date().toLocaleString()
            };

            savedGrades.push(saveData);
            localStorage.setItem('savedGradesSemester3', JSON.stringify(savedGrades));
            updateSavesListCustom();
            alert('Grades saved successfully!');
        });
    }

    // Setup load button to show saves list
    const loadButton = document.getElementById('loadButton');
    if (loadButton) {
        loadButton.addEventListener('click', () => {
            if (savedGrades.length === 0) {
                alert("No saved grades found!");
                return;
            }
            updateSavesListCustom();
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);
