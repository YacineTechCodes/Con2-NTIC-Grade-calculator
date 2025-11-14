// semester2.js - Specific code for Semester 2

// Initialize state for Semester 2
const state = initializeState({
    ana2Control: '', ana2Td: '',
    alg2Control: '', alg2Td: '',
    asd2Control: '', asd2Td: '', asd2Tp: '',
    sm2Control: '', sm2Td: '',
    lmControl: '', lmTd: '',
    aiControl: '', aiTp: '',
    electControl: '', electTd: ''
});

// Calculation Formulas
const formulas = {
    'Analysis 2': values => 0.60 * values.ana2Control + 0.40 * values.ana2Td,
    'Algebra 2': values => 0.60 * values.alg2Control + 0.40 * values.alg2Td,
    'Algorithms and Data Structure 2': values => 0.60 * values.asd2Control + 0.40 * values.asd2Tp,
    'Machine Structure 2': values => 0.60 * values.sm2Control + 0.40 * values.sm2Td,
    'Mathematical Logic': values => 0.60 * values.lmControl + 0.40 * values.lmTd,
    'Introduction to AI': values => 0.60 * values.aiControl + 0.40 * values.aiTp,
    'Electronics': values => 0.60 * values.electControl + 0.40 * values.electTd
};

// Module name mapping
const moduleNames = {
    'Analysis 2': 'Analysis 2',
    'Algebra 2': 'Algebra 2',
    'Algorithms and Data Structure 2': 'Algorithms and Data Structure 2',
    'Machine Structure 2': 'Machine Structure 2',
    'Mathematical Logic': 'Mathematical Logic',
    'Introduction to AI': 'Introduction to AI',
    'Electronics': 'Electronics'
};

// Update calculations for Semester 2
function updateCalculations() {
    const numbers = Object.fromEntries(
        Object.entries(state.grades).map(([key, value]) => [key, parseFloat(value) || 0])
    );

    // Module grades
    state.results.modules = {
        'Analysis 2': formulas['Analysis 2'](numbers),
        'Algebra 2': formulas['Algebra 2'](numbers),
        'Algorithms and Data Structure 2': formulas['Algorithms and Data Structure 2'](numbers),
        'Machine Structure 2': formulas['Machine Structure 2'](numbers),
        'Mathematical Logic': formulas['Mathematical Logic'](numbers),
        'Introduction to AI': formulas['Introduction to AI'](numbers),
        'Electronics': formulas['Electronics'](numbers)
    };

    // Calculate unit grades separately
    // Unit 1 Fundamental (Mathematics): Analysis 2(coef 4) + Algebra 2(coef 2)
    state.results.unit1 = (
        state.results.modules['Analysis 2'] * 4 +
        state.results.modules['Algebra 2'] * 2
    ) / 6;

    // Unit 2 Fundamental (Computer Science): Algorithms and Data Structure 2(coef 5) + Machine Structure 2(coef 3)
    state.results.unit2 = (
        state.results.modules['Algorithms and Data Structure 2'] * 5 +
        state.results.modules['Machine Structure 2'] * 3
    ) / 8;

    // Unit 3 Methodological: Mathematical Logic(coef 1)
    state.results.unit3 = state.results.modules['Mathematical Logic'];

    // Unit 4 Transversal: Introduction to AI(coef 1)
    state.results.unit4 = state.results.modules['Introduction to AI'];

    // Unit 5 Discovery: Electronics(coef 2)
    state.results.unit5 = state.results.modules['Electronics'];

    // Calculate final result with credits: Analysis 2(6) + Algebra 2(5) + Algorithms and Data Structure 2(7) + Machine Structure 2(5) + Mathematical Logic(2) + Introduction to AI(2) + Electronics(4)
    state.results.finalResult = (
        state.results.modules['Analysis 2'] * 6 +
        state.results.modules['Algebra 2'] * 5 +
        state.results.modules['Algorithms and Data Structure 2'] * 7 +
        state.results.modules['Machine Structure 2'] * 5 +
        state.results.modules['Mathematical Logic'] * 2 +
        state.results.modules['Introduction to AI'] * 2 +
        state.results.modules['Electronics'] * 4
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
                title: 'Analysis 2',
                coefficient: 4,
                fields: [
                    { name: 'ana2Td', placeholder: 'TD (40%)' },
                    { name: 'ana2Control', placeholder: 'Control (60%)' }
                ]
            },
            {
                title: 'Algebra 2',
                coefficient: 2,
                fields: [
                    { name: 'alg2Td', placeholder: 'TD (40%)' },
                    { name: 'alg2Control', placeholder: 'Control (60%)' }
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
                title: 'Algorithms and Data Structure 2',
                coefficient: 5,
                fields: [
                    { name: 'asd2Tp', placeholder: 'TP (40%)' },
                    { name: 'asd2Control', placeholder: 'Control (60%)' }
                ]
            },
            {
                title: 'Machine Structure 2',
                coefficient: 3,
                fields: [
                    { name: 'sm2Td', placeholder: 'TD (40%)' },
                    { name: 'sm2Control', placeholder: 'Control (60%)' }
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
                title: 'Mathematical Logic',
                coefficient: 1,
                fields: [
                    { name: 'lmTd', placeholder: 'TD (40%)' },
                    { name: 'lmControl', placeholder: 'Control (60%)' }
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
                title: 'Introduction to AI',
                coefficient: 1,
                fields: [
                    { name: 'aiTp', placeholder: 'TP (40%)' },
                    { name: 'aiControl', placeholder: 'Control (60%)' }
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
                title: 'Electronics',
                coefficient: 2,
                fields: [
                    { name: 'electTd', placeholder: 'TD (40%)' },
                    { name: 'electControl', placeholder: 'Control (60%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Setup save/load system
    setupSaveLoadSystem(state, 'savedGradesSemester2new', updateCalculations);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);