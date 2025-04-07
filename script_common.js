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

// Simple initialization for themes page
if (document.body.classList.contains('themes')) {
    // Initialize state for themes page (no grades needed)
    const state = initializeState({});
}

// Theme switcher functionality
const themes = {
    // Light white theme
    'white': {
        '--bg-color': '#ffffff',
        '--text-color': '#000000',
        '--primary': '#333333',
        '--border-color': '#cccccc',
        '--input-bg': '#f9f9f9',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #ffffff, #f5f5f5)'
    },

    // Dark black theme
    'black': {
        '--bg-color': '#000000',
        '--text-color': '#ffffff',
        '--primary': '#cccccc',
        '--border-color': '#333333',
        '--input-bg': '#121212',
        '--module-bg': '#000000',
        '--unit-bg': 'linear-gradient(to bottom right, #000000, #121212)'
    },

    // Light variants
    'add7': {
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
    'add8': {
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
        '--primary': '#248146',
        '--border-color': '#2d5a3d',
        '--input-bg': '#243024',
        '--module-bg': '#1e2a1e',
        '--unit-bg': 'linear-gradient(to bottom right, #1e3a29, #162016)'
    },
    'ocean-dark': {
        '--bg-color': '#0f172a',
        '--text-color': '#e0f2fe',
        '--primary': '#2e90bb',
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
    },

    'dracula': {
        '--bg-color': '#282a36',
        '--text-color': '#f8f8f2',
        '--primary': '#bd93f9',
        '--border-color': '#6272a4',
        '--input-bg': '#44475a',
        '--module-bg': '#383a59',
        '--unit-bg': 'linear-gradient(to bottom right, #21222c, #282a36)'
    },

    // Lavender Theme
    'lavender-light': {
        '--bg-color': '#f5f0ff',
        '--text-color': '#4a4a6a',
        '--primary': '#8a4fff',
        '--border-color': '#d8bfd8',
        '--input-bg': '#f8f4ff',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #f0e6ff, #ffffff)'
    },
    'lavender-dark': {
        '--bg-color': '#2a2a4a',
        '--text-color': '#e6e6fa',
        '--primary': '#bc84fc',
        '--border-color': '#4a4a6a',
        '--input-bg': '#3a3a5a',
        '--module-bg': '#2f2f4f',
        '--unit-bg': 'linear-gradient(to bottom right, #1a1a3a, #2a2a4a)'
    },

    // Sepia Theme
    'sepia': {
        '--bg-color': '#3e2723',
        '--text-color': '#efebe9',
        '--primary': '#a1887f',
        '--border-color': '#4e342e',
        '--input-bg': '#2d2221',
        '--module-bg': '#352f2f',
        '--unit-bg': 'linear-gradient(to bottom right, #2a1f1b, #3e2723)'
    },

    // additional themes
    // Matrix Theme
    'matrix-dark': {
        '--bg-color': '#000000',
        '--text-color': '#00ff00',
        '--primary': '#00a300',
        '--border-color': '#003300',
        '--input-bg': '#002200',
        '--module-bg': '#001a00',
        '--unit-bg': 'linear-gradient(to bottom right, #001500, #000f00)'
    },

    // Cyberpunk Theme
    'cyberpunk-dark': {
        '--bg-color': '#0a0a2a',
        '--text-color': '#00ffff',
        '--primary': '#ff00ff',
        '--border-color': '#1a1a4a',
        '--input-bg': '#1a1a3a',
        '--module-bg': '#0f0f3a',
        '--unit-bg': 'linear-gradient(to bottom right, #0a0a2a, #1a1a4a)'
    },

    'add1': {
        '--bg-color': '#e6f3e6',
        '--text-color': '#0f360f',
        '--primary': '#00a86b',
        '--border-color': '#90ee90',
        '--input-bg': '#f0fff0',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #e0f8e0, #ffffff)'
    },

    'add2': {
        '--bg-color': '#f0f4f8',
        '--text-color': '#1a202c',
        '--primary': '#ff00ff',
        '--border-color': '#7928ca',
        '--input-bg': '#f7f0ff',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #e6e6fa, #ffffff)'
    },

    'add3': {
        '--bg-color': '#f8f8f2',
        '--text-color': '#282a36',
        '--primary': '#6272a4',
        '--border-color': '#bd93f9',
        '--input-bg': '#f1f1f1',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #f0f0f5, #ffffff)'
    },
    'add4': {
        '--bg-color': '#1a2b3c',
        '--text-color': '#ecf0f1',
        '--primary': '#7f8c8d',
        '--border-color': '#2c3e50',
        '--input-bg': '#2c3e50',
        '--module-bg': '#233140',
        '--unit-bg': 'linear-gradient(to bottom right, #1a2b3c, #2c3e50)'
    },
    'add5': {
        '--bg-color': '#f5f5f5',
        '--text-color': '#2c3e50',
        '--primary': '#34495e',
        '--border-color': '#bdc3c7',
        '--input-bg': '#ffffff',
        '--module-bg': '#f8f8f8',
        '--unit-bg': 'linear-gradient(to bottom right, #f0f0f0, #ffffff)'
    },

    'add6': {
        '--bg-color': '#1a1a1a',
        '--text-color': '#ffffff',
        '--primary': '#0f3b5f',
        '--border-color': '#d40920',
        '--input-bg': '#2a2a2a',
        '--module-bg': '#222222',
        '--unit-bg': 'linear-gradient(to bottom right, #1a1a1a, #2a2a2a)'
    },
    'art-deco': {
        '--bg-color': '#121212',
        '--text-color': '#e0e0e0',
        '--primary': '#b8860b',
        '--border-color': '#333333',
        '--input-bg': '#1e1e1e',
        '--module-bg': '#2a2a2a',
        '--unit-bg': 'linear-gradient(to bottom right, #121212, #1e1e1e)'
    },

    // add2
    // Nature-Inspired Themes
    'desert-light': {
        '--bg-color': '#faf0e6',
        '--text-color': '#6d4c41',
        '--primary': '#d2691e',
        '--border-color': '#d7ccc8',
        '--input-bg': '#fff3e0',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #f4e1d2, #ffffff)'
    },
    'desert-dark': {
        '--bg-color': '#3e2723',
        '--text-color': '#efebe9',
        '--primary': '#ff7f50',
        '--border-color': '#4e342e',
        '--input-bg': '#2d2221',
        '--module-bg': '#352f2f',
        '--unit-bg': 'linear-gradient(to bottom right, #2a1f1b, #3e2723)'
    },

    'arctic-light': {
        '--bg-color': '#f0f8ff',
        '--text-color': '#1a5f7a',
        '--primary': '#87ceeb',
        '--border-color': '#b0e0e6',
        '--input-bg': '#f4ffff',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #e0f8ff, #ffffff)'
    },
    'arctic-dark': {
        '--bg-color': '#0f2027',
        '--text-color': '#e0f2f1',
        '--primary': '#4dd0e1',
        '--border-color': '#00363a',
        '--input-bg': '#1a2f33',
        '--module-bg': '#0a1f23',
        '--unit-bg': 'linear-gradient(to bottom right, #0a1f23, #1a2f33)'
    },

    'tropical-light': {
        '--bg-color': '#f0fff4',
        '--text-color': '#2c7a2c',
        '--primary': '#2ecc71',
        '--border-color': '#90ee90',
        '--input-bg': '#f4fff4',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #e0ffe0, #ffffff)'
    },
    'tropical-dark': {
        '--bg-color': '#0a2f11',
        '--text-color': '#e6ffe6',
        '--primary': '#27ae60',
        '--border-color': '#1e3a29',
        '--input-bg': '#0f3a16',
        '--module-bg': '#0a2f11',
        '--unit-bg': 'linear-gradient(to bottom right, #052209, #0a2f11)'
    },
    // Technology-Inspired Themes
    'retro-computer': {
        '--bg-color': '#001100',
        '--text-color': '#00ff00',
        '--primary': '#00ff00',
        '--border-color': '#003300',
        '--input-bg': '#002200',
        '--module-bg': '#001a00',
        '--unit-bg': 'linear-gradient(to bottom right, #001500, #000f00)'
    },
    'synthwave': {
        '--bg-color': '#1a0b2a',
        '--text-color': '#ff6bff',
        '--primary': '#ff1493',
        '--border-color': '#4a0f4a',
        '--input-bg': '#2a1a3a',
        '--module-bg': '#1f0f2f',
        '--unit-bg': 'linear-gradient(to bottom right, #1a0b2a, #2a1a3a)'
    },

    'minimalist-tech-light': {
        '--bg-color': '#ffffff',
        '--text-color': '#333333',
        '--primary': '#007bff',
        '--border-color': '#e0e0e0',
        '--input-bg': '#f8f9fa',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #f8f9fa, #ffffff)'
    },
    'minimalist-tech-dark': {
        '--bg-color': '#121212',
        '--text-color': '#ffffff',
        '--primary': '#3f51b5',
        '--border-color': '#333333',
        '--input-bg': '#1e1e1e',
        '--module-bg': '#1a1a1a',
        '--unit-bg': 'linear-gradient(to bottom right, #121212, #1e1e1e)'
    },
    // Unique Concept Themes
    'coffee-light': {
        '--bg-color': '#f4e4d4',
        '--text-color': '#5d4037',
        '--primary': '#795548',
        '--border-color': '#d7ccc8',
        '--input-bg': '#efebe9',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #f5e6d3, #ffffff)'
    },
    'coffee-dark': {
        '--bg-color': '#2a1c13',
        '--text-color': '#d7ccc8',
        '--primary': '#a1887f',
        '--border-color': '#4e342e',
        '--input-bg': '#261a10',
        '--module-bg': '#352f2f',
        '--unit-bg': 'linear-gradient(to bottom right, #1a1c13, #2a1c13)'
    },

    'underwater-light': {
        '--bg-color': '#e6f2ff',
        '--text-color': '#00506a',
        '--primary': '#0077be',
        '--border-color': '#a9d6e5',
        '--input-bg': '#f0f8ff',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #d6eaf8, #ffffff)'
    },
    'underwater-dark': {
        '--bg-color': '#00334e',
        '--text-color': '#a9d6e5',
        '--primary': '#4da6ff',
        '--border-color': '#005582',
        '--input-bg': '#003366',
        '--module-bg': '#00263d',
        '--unit-bg': 'linear-gradient(to bottom right, #00263d, #00334e)'
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
    // Only create theme switcher on themes page
    if (document.body.classList.contains('themes')) {
        createThemeSwitcher();
    }

    // Load saved theme or default to light (on all pages)
    const savedTheme = localStorage.getItem('preferredTheme') || 'light';
    applyTheme(savedTheme);

    // Set the active class on the button (only on themes page)
    if (document.body.classList.contains('themes')) {
        const activeButton = document.querySelector(`[data-theme="${savedTheme}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
}

// Create theme switcher UI (only called on themes page)
function createThemeSwitcher() {
    const themeCategories = [
        {
            themes: [
                { id: 'white', name: 'White' },
                { id: 'black', name: 'Black' },
                { id: 'forest-light', name: 'Forest Light' },
                { id: 'forest-dark', name: 'Forest Dark' },
                { id: 'tropical-light', name: 'Tropical Light' },
                { id: 'tropical-dark', name: 'Tropical Dark' },
                { id: 'arctic-light', name: 'Arctic Light' },
                { id: 'arctic-dark', name: 'Arctic Dark' },
                { id: 'sunset-light', name: 'Sunset Light' },
                { id: 'sunset-dark', name: 'Sunset Dark' },
                { id: 'lavender-light', name: 'Lavender Light' },
                { id: 'lavender-dark', name: 'Lavender Dark' },
                { id: 'coffee-light', name: 'Coffee Light' },
                { id: 'coffee-dark', name: 'Coffee Dark' },
                { id: 'minimalist-tech-light', name: 'Minimalist Tech Light' },
                { id: 'minimalist-tech-dark', name: 'Minimalist Tech Dark' },
                { id: 'cyberpunk-dark', name: 'Cyberpunk' },
                { id: 'dracula', name: 'Dracula' },
                { id: 'matrix-dark', name: 'Matrix' },
                { id: 'retro-computer', name: 'Retro Computer' },
                { id: 'synthwave', name: 'Synthwave' },
                { id: 'art-deco', name: 'Art Deco' },
                { id: 'sepia', name: 'Sepia' },
                { id: 'underwater-dark', name: 'Underwater' },
                { id: 'ocean-dark', name: 'Ocean' },
                { id: 'add1', name: 'Additional 1' },
                { id: 'add2', name: 'Additional 2' },
                { id: 'add3', name: 'Additional 3' },
                { id: 'add4', name: 'Additional 4' },
                { id: 'add5', name: 'Additional 5' },
                { id: 'add6', name: 'Additional 6' },
                { id: 'add7', name: 'Additional 7' },
                { id: 'add8', name: 'Additional 8' },
                { id: 'underwater-light', name: 'Additional 9' },
                { id: 'ocean-light', name: 'Additional 10' },
            ]
        },
    ];

    // Create main theme section
    const themeSection = document.createElement('div');
    themeSection.className = 'theme-selector';

    // Create heading
    const heading = document.createElement('h3');
    heading.textContent = 'Theme Selector';
    themeSection.appendChild(heading);

    // Create container for theme categories
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'theme-categories';

    // Render theme categories
    themeCategories.forEach(category => {
        // Category wrapper
        const categoryWrapper = document.createElement('div');
        categoryWrapper.className = 'theme-category';

        // Category name
        const categoryName = document.createElement('div');
        categoryName.className = 'category-name';
        categoryName.textContent = category.name;
        categoryWrapper.appendChild(categoryName);

        // Themes grid
        const themesGrid = document.createElement('div');
        themesGrid.className = 'themes-grid';

        // Create theme buttons
        category.themes.forEach(theme => {
            const themeButton = document.createElement('button');
            themeButton.className = 'theme-button';
            themeButton.dataset.theme = theme.id;

            // Theme preview
            const preview = document.createElement('div');
            preview.className = 'theme-preview';

            const themeColors = themes[theme.id];
            preview.style.setProperty('--bg-color', themeColors['--bg-color']);
            preview.style.setProperty('--primary-color', themeColors['--primary']);
            preview.style.setProperty('--text-color', themeColors['--text-color']);

            // Theme name
            const themeName = document.createElement('span');
            themeName.textContent = theme.name;

            themeButton.appendChild(preview);
            themeButton.appendChild(themeName);

            // Click event
            themeButton.addEventListener('click', () => {
                // Remove active state from all buttons
                document.querySelectorAll('.theme-button').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add active state to current button
                themeButton.classList.add('active');

                // Apply theme
                applyTheme(theme.id);
            });

            themesGrid.appendChild(themeButton);
        });

        categoryWrapper.appendChild(themesGrid);
        categoriesContainer.appendChild(categoryWrapper);
    });

    themeSection.appendChild(categoriesContainer);

    // Inject styles
    const styles = `
    <style>
    .theme-selector {
        background-color: var(--module-bg);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
    }

    .theme-selector h3 {
        color: var(--primary);
        margin-bottom: 20px;
        text-align: center;
    }

    .theme-categories {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .theme-category {
        background-color: var(--input-bg);
        border-radius: 10px;
        padding: 15px;
    }

    .category-name {
        font-weight: bold;
        color: var(--primary);
        margin-bottom: 15px;
    }

    .themes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 15px;
    }

    .theme-button {
        background: none;
        border: 2px solid transparent;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .theme-button:hover {
        border-color: var(--primary);
    }

    .theme-button.active {
        border-color: var(--primary);
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    .theme-preview {
        width: 80px;
        height: 60px;
        border-radius: 6px;
        overflow: hidden;
        position: relative;
        margin-bottom: 8px;
    }

    .theme-preview::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            45deg, 
            var(--bg-color) 0%, 
            var(--bg-color) 50%, 
            var(--primary-color) 50%, 
            var(--primary-color) 100%
        );
    }

    .theme-preview::after {
        content: 'Aa';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--text-color);
        font-size: 20px;
        font-weight: bold;
    }

    .theme-button span {
        font-size: 0.8rem;
        margin-top: 5px;
        color: var(--text-color);
    }
    </style>`;

    document.head.insertAdjacentHTML('beforeend', styles);

    // Insert theme section
    const container = document.querySelector('.container');
    const footer = document.querySelector('.footer');

    if (container) {
        if (footer) {
            container.insertBefore(themeSection, footer);
        } else {
            container.appendChild(themeSection);
        }
    }
}

// Modify initTheme to handle theme switcher creation
function initTheme() {
    // Only create theme switcher on themes page
    if (document.body.classList.contains('themes')) {
        createThemeSwitcher();
    }

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('preferredTheme') || 'light';
    applyTheme(savedTheme);

    // Set active button on themes page
    if (document.body.classList.contains('themes')) {
        const activeButton = document.querySelector(`[data-theme="${savedTheme}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
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

// Debounce input to reduce calculation frequency
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// Modify handleInput to use debounce
const debouncedHandleInput = debounce(handleInput, 150);

function enhanceTouchInteraction() {
    // Prevent default wheel scroll on number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    });

    // Add tap highlight for better touch feedback
    document.body.style.webkitTapHighlightColor = 'rgba(0,0,0,0.2)';
}