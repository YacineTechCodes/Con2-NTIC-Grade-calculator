// semester2.js - Specific code for Semester 2

// Initialize state for Semester 2
const state = initializeState({
    // Unit 1
    analysisControl: '', analysisTd: '',
    algebraControl: '', algebraTd: '',
    probStatsControl: '', probStatsTd: '',

    // Unit 2
    pdsControl: '', pdsTd: '', pdsTp: '',
    machineControl: '', machineTd: '',

    // Unit 3
    ictControl: '',
    oopControl: '', oopTp: '',

    // Unit 4
    geControl: '', geTd: '',
    historyControl: ''
});

// Module name mapping
const moduleNames = {
    'Analysis': 'Analysis',
    'Algebra': 'Algebra',
    'Probability & Statistics': 'ProbabilityStatistics',
    'Programming & Data Structures': 'ProgrammingDataStructures',
    'Machine Structure': 'MachineStructure',
    'ICT': 'ICT',
    'Intro to OOP': 'IntroOOP',
    'General Electricity': 'GeneralElectricity',
    'History of Sciences': 'HistoryScience'
};

// Calculation Formulas
const formulas = {
    Analysis: values => 0.66 * values.analysisControl + 0.34 * values.analysisTd,
    Algebra: values => 0.67 * values.algebraControl + 0.33 * values.algebraTd,
    ProbabilityStatistics: values => 0.67 * values.probStatsControl + 0.33 * values.probStatsTd,
    ProgrammingDataStructures: values => 0.68 * values.pdsControl + 0.16 * values.pdsTd + 0.16 * values.pdsTp,
    MachineStructure: values => 0.66 * values.machineControl + 0.34 * values.machineTd,
    ICT: values => 1.00 * values.ictControl,
    IntroOOP: values => 0.60 * values.oopControl + 0.40 * values.oopTp,
    GeneralElectricity: values => 0.70 * values.geControl + 0.30 * values.geTd,
    HistoryScience: values => 1.00 * values.historyControl
};

// Automatic Calculation
function updateCalculations() {
    const numbers = Object.fromEntries(
        Object.entries(state.grades).map(([key, value]) => [key, parseFloat(value) || 0])
    );

    // Module grades
    state.results.modules = {
        Analysis: formulas.Analysis(numbers),
        Algebra: formulas.Algebra(numbers),
        ProbabilityStatistics: formulas.ProbabilityStatistics(numbers),
        ProgrammingDataStructures: formulas.ProgrammingDataStructures(numbers),
        MachineStructure: formulas.MachineStructure(numbers),
        ICT: formulas.ICT(numbers),
        IntroOOP: formulas.IntroOOP(numbers),
        GeneralElectricity: formulas.GeneralElectricity(numbers),
        HistoryScience: formulas.HistoryScience(numbers)
    };

    // Unit averages
    state.results.unit1 = (
        state.results.modules.Analysis * 2 +
        state.results.modules.Algebra * 2 +
        state.results.modules.ProbabilityStatistics * 1
    ) / 5;

    state.results.unit2 = (
        state.results.modules.ProgrammingDataStructures * 3 +
        state.results.modules.MachineStructure * 2
    ) / 5;

    state.results.unit3 = (
        state.results.modules.ICT * 2 +
        state.results.modules.IntroOOP * 1
    ) / 3;

    state.results.unit4 = (
        state.results.modules.GeneralElectricity * 2 +
        state.results.modules.HistoryScience * 1
    ) / 3;

    // Final result (total weighted average)
    state.results.finalResult = (
        state.results.modules.Analysis * 2 +
        state.results.modules.Algebra * 2 +
        state.results.modules.ProbabilityStatistics * 1 +
        state.results.modules.ProgrammingDataStructures * 3 +
        state.results.modules.MachineStructure * 2 +
        state.results.modules.ICT * 2 +
        state.results.modules.IntroOOP * 1 +
        state.results.modules.GeneralElectricity * 2 +
        state.results.modules.HistoryScience * 1
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
                title: 'Analysis',
                coefficient: 2,
                fields: [
                    { name: 'analysisControl', placeholder: 'Control (66%)' },
                    { name: 'analysisTd', placeholder: 'TD (34%)' }
                ]
            },
            {
                title: 'Algebra',
                coefficient: 2,
                fields: [
                    { name: 'algebraControl', placeholder: 'Control (67%)' },
                    { name: 'algebraTd', placeholder: 'TD (33%)' }
                ]
            },
            {
                title: 'Probability & Statistics',
                coefficient: 1,
                fields: [
                    { name: 'probStatsControl', placeholder: 'Control (67%)' },
                    { name: 'probStatsTd', placeholder: 'TD (33%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Unit 2: Fundamental
    unitSections.appendChild(createUnit({
        title: 'Unit 2: Fundamental',
        gridClass: 'md:grid-cols-2',
        modules: [
            {
                title: 'Programming & Data Structures',
                coefficient: 3,
                fields: [
                    { name: 'pdsControl', placeholder: 'Control (68%)' },
                    { name: 'pdsTd', placeholder: 'TD (16%)' },
                    { name: 'pdsTp', placeholder: 'TP (16%)' }
                ]
            },
            {
                title: 'Machine Structure',
                coefficient: 2,
                fields: [
                    { name: 'machineControl', placeholder: 'Control (66%)' },
                    { name: 'machineTd', placeholder: 'TD (34%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Unit 3: Methodological
    unitSections.appendChild(createUnit({
        title: 'Unit 3: Methodological',
        gridClass: 'md:grid-cols-2',
        modules: [
            {
                title: 'ICT',
                coefficient: 2,
                fields: [
                    { name: 'ictControl', placeholder: 'Control (100%)' }
                ]
            },
            {
                title: 'Intro to OOP',
                coefficient: 1,
                fields: [
                    { name: 'oopControl', placeholder: 'Control (60%)' },
                    { name: 'oopTp', placeholder: 'TP (40%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Unit 4: Transversal
    unitSections.appendChild(createUnit({
        title: 'Unit 4: Transversal',
        gridClass: 'md:grid-cols-2',
        modules: [
            {
                title: 'General Electricity',
                coefficient: 2,
                fields: [
                    { name: 'geControl', placeholder: 'Control (70%)' },
                    { name: 'geTd', placeholder: 'TD (30%)' }
                ]
            },
            {
                title: 'History of Sciences',
                coefficient: 1,
                fields: [
                    { name: 'historyControl', placeholder: 'Control (100%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Setup save/load system
    setupSaveLoadSystem(state, 'savedGradesSemester2');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);