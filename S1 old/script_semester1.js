// semester1.js - Specific code for Semester 1

// Initialize state for Semester 1
const state = initializeState({
    algoControl: '', algoTd: '', algoTp: '',
    analysisControl: '', analysisTd: '',
    algebraControl: '', algebraTd: '',
    compControl: '', compTd: '',
    criControl: '', criTd: '',
    terminology: '',
    english: '',
    bureautique: ''
});

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

// Module name mapping
const moduleNames = {
    'Algorithms': 'Algorithms',
    'Analysis': 'Analysis',
    'Algebra': 'Algebra',
    'Comp': 'Comp',
    'CRI': 'CRI',
    'Terminology': 'Terminology',
    'Bureautique': 'Bureautique',
    'English': 'English'
};

// Update calculations for Semester 1
function updateCalculations() {
    const numbers = Object.fromEntries(
        Object.entries(state.grades).map(([key, value]) => [key, parseFloat(value) || 0])
    );

    // Module grades
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
    }, handleInputFn, handleBlurFn));

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
    }, handleInputFn, handleBlurFn));

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
    }, handleInputFn, handleBlurFn));

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
    }, handleInputFn, handleBlurFn));

    // Setup save/load system
    setupSaveLoadSystem(state, 'savedGradesSemester1', updateCalculations);;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);