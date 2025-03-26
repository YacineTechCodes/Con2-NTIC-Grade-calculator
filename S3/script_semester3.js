// semester3.js - Specific code for Semester 3

// Initialize state for Semester 3
const state = initializeState({
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
});

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

// Initialize the page
function init() {

    // Create input handlers with specific state
    const handleInputFn = (e) => handleInput(e, state, updateCalculations);
    const handleBlurFn = (e) => handleBlur(e, state, updateCalculations);

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
    }, handleInputFn, handleBlurFn));

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

    // Setup save/load system
    setupSaveLoadSystem(state, 'savedGradesSemester3');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);