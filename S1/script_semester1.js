// semester1.js - Specific code for Semester 1

// Initialize state for Semester 1
const state = initializeState({
    analysis1Control: '', analysis1Td: '',
    algebra1Control: '', algebra1Td: '',
    algorithmsAndDataStructure1Control: '', algorithmsAndDataStructure1Td: '', algorithmsAndDataStructure1Tp: '',
    machineStructure1Control: '', machineStructure1Td: '',
    openSourceControl: '',
    english1Control: '',
    electricityControl: '', electricityTd: ''
});

// Calculation Formulas with updated percentages
const formulas = {
    'Analysis 1': values => 0.60 * values.analysis1Control + 0.40 * values.analysis1Td,
    'Algebra 1': values => 0.60 * values.algebra1Control + 0.40 * values.algebra1Td,
    'Algorithms and Data Structure 1': values => 0.60 * values.algorithmsAndDataStructure1Control + 0.20 * values.algorithmsAndDataStructure1Td + 0.20 * values.algorithmsAndDataStructure1Tp,
    'Machine Structure 1': values => 0.60 * values.machineStructure1Control + 0.40 * values.machineStructure1Td,
    'Open Source': values => 1.00 * values.openSourceControl,
    'English 1': values => 1.00 * values.english1Control,
    'Electricity': values => 0.60 * values.electricityControl + 0.40 * values.electricityTd
};

// Module name mapping
const moduleNames = {
    'Analysis 1': 'Analysis 1',
    'Algebra 1': 'Algebra 1',
    'Algorithms and Data Structure 1': 'Algorithms and Data Structure 1',
    'Machine Structure 1': 'Machine Structure 1',
    'Open Source': 'Open Source',
    'English 1': 'English 1',
    'Electricity': 'Electricity'
};

// Update calculations for Semester 1
function updateCalculations() {
    const numbers = Object.fromEntries(
        Object.entries(state.grades).map(([key, value]) => [key, parseFloat(value) || 0])
    );

    // Module grades
    state.results.modules = {
        'Analysis 1': formulas['Analysis 1'](numbers),
        'Algebra 1': formulas['Algebra 1'](numbers),
        'Algorithms and Data Structure 1': formulas['Algorithms and Data Structure 1'](numbers),
        'Machine Structure 1': formulas['Machine Structure 1'](numbers),
        'Open Source': formulas['Open Source'](numbers),
        'English 1': formulas['English 1'](numbers),
        'Electricity': formulas['Electricity'](numbers)
    };

    // Calculate unit grades separately
    // Unit 1 Fundamental (Mathematics): Analysis 1(coef 4) + Algebra 1(coef 2)
    state.results.unit1 = (
        state.results.modules['Analysis 1'] * 4 +
        state.results.modules['Algebra 1'] * 2
    ) / 6;

    // Unit 2 Fundamental (Computer Science): Algorithms and Data Structure 1(coef 5) + Machine Structure 1(coef 3)
    state.results.unit2 = (
        state.results.modules['Algorithms and Data Structure 1'] * 5 +
        state.results.modules['Machine Structure 1'] * 3
    ) / 8;

    // Unit 3 Methodological: Open Source(coef 1)
    state.results.unit3 = state.results.modules['Open Source'];

    // Unit 4 Transversal: English 1(coef 1)
    state.results.unit4 = state.results.modules['English 1'];

    // Unit 5 Discovery: Electricity(coef 2)
    state.results.unit5 = state.results.modules['Electricity'];

    // Calculate final result with credits: Analysis 1(6) + Algebra 1(5) + Algorithms and Data Structure 1(7) + Machine Structure 1(5) + Open Source(2) + English 1(2) + Electricity(4)
    state.results.finalResult = (
        state.results.modules['Analysis 1'] * 6 +
        state.results.modules['Algebra 1'] * 5 +
        state.results.modules['Algorithms and Data Structure 1'] * 7 +
        state.results.modules['Machine Structure 1'] * 5 +
        state.results.modules['Open Source'] * 2 +
        state.results.modules['English 1'] * 2 +
        state.results.modules['Electricity'] * 4
    ) / 31;

    updateDisplay(state, moduleNames);
}

// Initialize the page
function init() {
    // Create input handlers with specific state
    const handleInputFn = (e) => handleInput(e, state, updateCalculations);
    const handleBlurFn = (e) => handleBlur(e, state, updateCalculations);

    const unitSections = document.getElementById('unitSections');

    // Unit 1: Fundamental (Mathematics)
    unitSections.appendChild(createUnit({
        title: 'Unit: Fundamental (Mathematics)',
        gridClass: 'md:grid-cols-2',
        modules: [
            {
                title: 'Analysis 1',
                coefficient: 4,
                fields: [
                    { name: 'analysis1Td', placeholder: 'TD (40%)' },
                    { name: 'analysis1Control', placeholder: 'Control (60%)' }
                ]
            },
            {
                title: 'Algebra 1',
                coefficient: 2,
                fields: [
                    { name: 'algebra1Td', placeholder: 'TD (40%)' },
                    { name: 'algebra1Control', placeholder: 'Control (60%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Unit 2: Fundamental (Computer Science)
    unitSections.appendChild(createUnit({
        title: 'Unit: Fundamental (Computer Science)',
        gridClass: 'md:grid-cols-2',
        modules: [
            {
                title: 'Algorithms and Data Structure 1',
                coefficient: 5,
                fields: [
                    { name: 'algorithmsAndDataStructure1Tp', placeholder: 'TP (20%)' },
                    { name: 'algorithmsAndDataStructure1Td', placeholder: 'TD (20%)' },
                    { name: 'algorithmsAndDataStructure1Control', placeholder: 'Control (60%)' }
                ]
            },
            {
                title: 'Machine Structure 1',
                coefficient: 3,
                fields: [
                    { name: 'machineStructure1Td', placeholder: 'TD (40%)' },
                    { name: 'machineStructure1Control', placeholder: 'Control (60%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Unit 3: Methodological
    unitSections.appendChild(createUnit({
        title: 'Unit: Methodological',
        gridClass: 'grid-cols-1',
        modules: [
            {
                title: 'Open Source',
                coefficient: 1,
                fields: [
                    { name: 'openSourceControl', placeholder: 'Grade (100%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Unit 4: Transversal
    unitSections.appendChild(createUnit({
        title: 'Unit: Transversal',
        gridClass: 'grid-cols-1',
        modules: [
            {
                title: 'English 1',
                coefficient: 1,
                fields: [
                    { name: 'english1Control', placeholder: 'Grade (100%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Unit 5: Discovery
    unitSections.appendChild(createUnit({
        title: 'Unit: Discovery',
        gridClass: 'grid-cols-1',
        modules: [
            {
                title: 'Electricity',
                coefficient: 2,
                fields: [
                    { name: 'electricityTd', placeholder: 'TD (40%)' },
                    { name: 'electricityControl', placeholder: 'Control (60%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Setup save/load system
    setupSaveLoadSystem(state, 'savedGradesSemester1new', updateCalculations);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);