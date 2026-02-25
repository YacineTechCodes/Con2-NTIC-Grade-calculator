// semester4.js - Specific code for Semester 4

// Initialize state for Semester 4
const state = initializeState({
    // Unit 1
    dbControl: '', dbTdTp: '',
    osControl: '', osTdTp: '',
    swEngControl: '', swEngTd: '',

    // Unit 2
    graphTheoryControl: '', graphTheoryTd: '',
    networkControl: '', networkTd: '', networkTp: '',
    webDevControl: '', webDevTp: '',

    // Unit 3
    legalControl: '',
    english3Control: ''
});

// Calculation Formulas
const formulas = {
    Database: values => 0.7 * values.dbControl + 0.3 * values.dbTdTp,
    OperatingSystems: values => 0.67 * values.osControl + 0.33 * values.osTdTp,
    SoftwareEngineering: values => 0.67 * values.swEngControl + 0.33 * values.swEngTd,
    GraphTheory: values => 0.70 * values.graphTheoryControl + 0.30 * values.graphTheoryTd,
    NetworkCommunication: values => 0.50 * values.networkControl + 0.25 * values.networkTd + 0.25 * values.networkTp,
    WebDevelopment: values => 0.60 * values.webDevControl + 0.40 * values.webDevTp,
    LegalAspects: values => 1.00 * values.legalControl,
    English3: values => 1.00 * values.english3Control
};

// Module name mapping
const moduleNames = {
    'Database': 'Database',
    'Operating Systems': 'OperatingSystems',
    'Software Engineering': 'SoftwareEngineering',
    'Graph Theory': 'GraphTheory',
    'Network Communication': 'NetworkCommunication',
    'Web Development': 'WebDevelopment',
    'Legal & Economic Aspects': 'LegalAspects',
    'English 3': 'English3'
};

// Update calculations for Semester 4
function updateCalculations() {
    const numbers = parseGrades(state.grades);

    // Module grades
    state.results.modules = {
        Database: formulas.Database(numbers),
        OperatingSystems: formulas.OperatingSystems(numbers),
        SoftwareEngineering: formulas.SoftwareEngineering(numbers),
        GraphTheory: formulas.GraphTheory(numbers),
        NetworkCommunication: formulas.NetworkCommunication(numbers),
        WebDevelopment: formulas.WebDevelopment(numbers),
        LegalAspects: formulas.LegalAspects(numbers),
        English3: formulas.English3(numbers)
    };

    // Unit averages
    state.results.unit1 = (
        state.results.modules.Database * 2 +
        state.results.modules.OperatingSystems * 3 +
        state.results.modules.SoftwareEngineering * 2
    ) / 7;

    state.results.unit2 = (
        state.results.modules.GraphTheory * 2 +
        state.results.modules.NetworkCommunication * 3 +
        state.results.modules.WebDevelopment * 2
    ) / 7;

    state.results.unit3 = (
        state.results.modules.LegalAspects * 1 +
        state.results.modules.English3 * 1
    ) / 2;

    // Final result (total weighted average)
    state.results.finalResult = (
        state.results.modules.Database * 2 +
        state.results.modules.OperatingSystems * 3 +
        state.results.modules.SoftwareEngineering * 2 +
        state.results.modules.GraphTheory * 2 +
        state.results.modules.NetworkCommunication * 3 +
        state.results.modules.WebDevelopment * 2 +
        state.results.modules.LegalAspects * 1 +
        state.results.modules.English3 * 1
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
                title: 'Database',
                coefficient: 2,
                fields: [
                    { name: 'dbControl', placeholder: 'Control (70%)' },
                    { name: 'dbTdTp', placeholder: 'TD + TP (30%)' }
                ]
            },
            {
                title: 'Operating Systems',
                coefficient: 3,
                fields: [
                    { name: 'osControl', placeholder: 'Control (67%)' },
                    { name: 'osTdTp', placeholder: 'TD + TP (33%)' }
                ]
            },
            {
                title: 'Software Engineering',
                coefficient: 2,
                fields: [
                    { name: 'swEngControl', placeholder: 'Control (67%)' },
                    { name: 'swEngTd', placeholder: 'TD (33%)' }
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
                title: 'Graph Theory',
                coefficient: 2,
                fields: [
                    { name: 'graphTheoryControl', placeholder: 'Control (70%)' },
                    { name: 'graphTheoryTd', placeholder: 'TD (30%)' }
                ]
            },
            {
                title: 'Network Communication',
                coefficient: 3,
                fields: [
                    { name: 'networkControl', placeholder: 'Control (50%)' },
                    { name: 'networkTd', placeholder: 'TD (25%)' },
                    { name: 'networkTp', placeholder: 'TP (25%)' }
                ]
            },
            {
                title: 'Web Development',
                coefficient: 2,
                fields: [
                    { name: 'webDevControl', placeholder: 'Control (60%)' },
                    { name: 'webDevTp', placeholder: 'TP (40%)' }
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
                title: 'Legal & Economic Aspects',
                coefficient: 1,
                fields: [
                    { name: 'legalControl', placeholder: 'Control (100%)' }
                ]
            },
            {
                title: 'English 3',
                coefficient: 1,
                fields: [
                    { name: 'english3Control', placeholder: 'Control (100%)' }
                ]
            }
        ]
    }, handleInputFn, handleBlurFn));

    // Setup save/load system
    setupSaveLoadSystem(state, 'savedGradesSemester4', updateCalculations);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);