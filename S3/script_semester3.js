// semester3.js - Specific code for Semester 3

// Toggle module configuration for Algorithms & Data Structures
const algoDSToggleConfig = {
    moduleId: 'algods',
    title: 'Algorithms & Data Structures',
    coefficient: 3,
    mergedMode: {
        fields: [
            { name: 'algoDSControl', placeholder: 'Control (60%)' },
            { name: 'algoDSTdTp', placeholder: 'TD + TP + Interro (40%)' }
        ]
    },
    separateMode: {
        fields: [
            { name: 'algoDSControl', placeholder: 'Control (60%)' },
            { name: 'algoDSTd', placeholder: 'TD (20%)' },
            { name: 'algoDSTp', placeholder: 'TP (20%)' }
        ]
    }
};

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

// Reference to toggle module controller
let algoDSToggle = null;

// Calculation Formulas
const formulas = {
    // Dynamic formula based on mode
    AlgorithmsDataStructures: values => {
        if (algoDSToggle && algoDSToggle.isMerged()) {
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
    const numbers = parseGrades(state.grades);

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

// Initialize the page
function init() {
    // Create input handlers with specific state
    const handleInputFn = (e) => handleInput(e, state, updateCalculations);
    const handleBlurFn = (e) => handleBlur(e, state, updateCalculations);

    const unitSections = document.getElementById('unitSections');

    // Unit 1: Fundamental (with toggleable AlgoDS module)
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

    // Create toggleable AlgoDS module using global function
    algoDSToggle = createToggleableModule(
        algoDSToggleConfig,
        state,
        updateCalculations,
        handleInputFn,
        handleBlurFn
    );
    unit1Grid.appendChild(algoDSToggle.element);

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

    // Custom load handler with mode detection
    function customLoadGrades(save) {
        // Detect and apply correct mode
        const shouldBeMerged = detectToggleModeFromSave(save.grades, algoDSToggleConfig);
        algoDSToggle.setMode(shouldBeMerged);

        // Clear all values
        Object.keys(state.grades).forEach(key => {
            state.grades[key] = '';
            const input = document.querySelector(`input[name="${key}"]`);
            if (input) input.value = '';
        });

        // Load saved values
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

    // Custom saves list renderer
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

    // Setup load button
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
