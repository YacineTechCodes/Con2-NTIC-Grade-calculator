// common.js - Shared functions for all semester calculators

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * Initialize the global state object with semester-specific properties
 * @param {Object} gradeFields - Object containing grade field names
 * @returns {Object} Initial state object
 */
function initializeState(gradeFields) {
    return {
        grades: gradeFields,
        results: {
            finalResult: 0.00,
            unit1: 0.00,
            unit2: 0.00,
            unit3: 0.00,
            unit4: 0.00,
            modules: {}
        }
    };
}

// ============================================================================
// INPUT HANDLING
// ============================================================================

/**
 * Handle input changes with validation
 * @param {Event} e - Input event
 * @param {Object} state - Application state
 * @param {Function} updateCalculations - Callback to update calculations
 */
function handleInput(e, state, updateCalculations) {
    const { name, value } = e.target;

    // Allow empty input
    if (value === '') {
        state.grades[name] = '';
        updateCalculations();
        return;
    }

    // Validate numeric input
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        e.target.value = state.grades[name] || '';
        return;
    }

    // Validate range (0-20)
    if (numValue < 0 || numValue > 20) {
        e.target.value = state.grades[name] || '';
        return;
    }

    state.grades[name] = numValue;
    updateCalculations();
}

/**
 * Handle input blur with rounding
 * @param {Event} e - Blur event
 * @param {Object} state - Application state
 * @param {Function} updateCalculations - Callback to update calculations
 */
function handleBlur(e, state, updateCalculations) {
    const { name, value } = e.target;
    if (value === '') return;

    const numValue = parseFloat(value);
    const rounded = Math.round(numValue * 100) / 100;
    state.grades[name] = rounded;
    e.target.value = rounded.toFixed(2);
    updateCalculations();
}

/**
 * Debounce function to limit calculation frequency
 * @param {Function} func - Function to debounce
 * @param {number} timeout - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// ============================================================================
// DISPLAY UPDATES
// ============================================================================

/**
 * Update all display elements with current grades
 * @param {Object} state - Application state
 * @param {Object} moduleNames - Mapping of module display names to internal names
 */
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

// ============================================================================
// UI COMPONENT CREATORS
// ============================================================================

/**
 * Create a module element with inputs
 * @param {Object} moduleConfig - Module configuration
 * @param {Function} handleInputFn - Input handler function
 * @param {Function} handleBlurFn - Blur handler function
 * @returns {HTMLElement} Module element
 */
function createModule(moduleConfig, handleInputFn, handleBlurFn) {
    const moduleDiv = document.createElement('div');
    moduleDiv.className = 'module';

    // Create header
    const header = document.createElement('div');
    header.className = 'module-header';

    const title = document.createElement('h3');
    title.textContent = moduleConfig.title;

    // Add coefficient if exists
    if (moduleConfig.coefficient) {
        const coef = document.createElement('span');
        coef.className = 'coefficient';
        coef.textContent = `Coef: ${moduleConfig.coefficient}`;
        header.appendChild(coef);
    }

    header.prepend(title);
    moduleDiv.appendChild(header);

    // Create input fields
    moduleConfig.fields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'input-group';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.max = 20;
        input.step = 0.01;
        input.name = field.name;
        input.placeholder = field.placeholder;
        input.onwheel = () => input.blur(); // Prevent scroll change
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
    gradeDisplay.dataset.module = moduleConfig.title;
    gradeDisplay.textContent = 'Grade: 0.00';
    moduleDiv.appendChild(gradeDisplay);

    return moduleDiv;
}

/**
 * Create a unit section with modules
 * @param {Object} unitConfig - Unit configuration
 * @param {Function} handleInputFn - Input handler function
 * @param {Function} handleBlurFn - Blur handler function
 * @returns {HTMLElement} Unit element
 */
function createUnit(unitConfig, handleInputFn, handleBlurFn) {
    const unitDiv = document.createElement('div');
    unitDiv.className = 'unit-section';

    // Create header
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

    // Create modules grid
    const grid = document.createElement('div');
    grid.className = `grid ${unitConfig.gridClass}`;

    unitConfig.modules.forEach(module => {
        grid.appendChild(createModule(module, handleInputFn, handleBlurFn));
    });

    unitDiv.appendChild(grid);
    return unitDiv;
}

// ============================================================================
// SAVE/LOAD SYSTEM
// ============================================================================

/**
 * Setup save/load functionality with localStorage
 * @param {Object} state - Application state
 * @param {string} semesterKey - LocalStorage key for this semester
 * @param {Function} updateCalculations - Callback to update calculations
 * @returns {Object} Save/load utility functions
 */
function setupSaveLoadSystem(state, semesterKey, updateCalculations) {
    let savedGrades = JSON.parse(localStorage.getItem(semesterKey)) || [];

    /**
     * Save current grades to localStorage
     */
    function saveCurrentGrades() {
        const saveName = prompt("Enter a name for this save:");
        if (!saveName || saveName.trim() === '') return;

        const saveData = {
            name: saveName.trim(),
            grades: { ...state.grades }, // Create a copy
            timestamp: new Date().toLocaleString()
        };

        savedGrades.push(saveData);
        localStorage.setItem(semesterKey, JSON.stringify(savedGrades));
        updateSavesList();
        alert('Grades saved successfully!');
    }

    /**
     * Load saved grades by index
     * @param {number} saveIndex - Index of save to load
     */
    function loadGrades(saveIndex) {
        const save = savedGrades[saveIndex];
        if (!save) return;

        // Step 1: Clear all existing grades in state and inputs
        Object.keys(state.grades).forEach(key => {
            state.grades[key] = '';
            const input = document.querySelector(`input[name="${key}"]`);
            if (input) {
                input.value = '';
            }
        });

        // Step 2: Load saved values directly into state and inputs
        Object.keys(save.grades).forEach(key => {
            if (key in state.grades) {
                const savedValue = save.grades[key];
                // Update state
                state.grades[key] = savedValue;
                // Update input
                const input = document.querySelector(`input[name="${key}"]`);
                if (input) {
                    input.value = savedValue !== '' ? savedValue : '';
                }
            }
        });

        // Step 3: Force immediate calculation update
        updateCalculations();

        // Step 4: Use requestAnimationFrame to ensure DOM renders, then update again
        requestAnimationFrame(() => {
            updateCalculations();
        });

        // Provide feedback without blocking alert
        const loadButton = document.getElementById('loadButton');
        if (loadButton) {
            const originalText = loadButton.textContent;
            loadButton.textContent = 'Loaded!';
            setTimeout(() => {
                loadButton.textContent = originalText;
            }, 2000);
        }
    }

    /**
     * Delete a saved grade set
     * @param {number} saveIndex - Index of save to delete
     */
    function deleteSave(saveIndex) {
        savedGrades.splice(saveIndex, 1);
        localStorage.setItem(semesterKey, JSON.stringify(savedGrades));
        updateSavesList();
    }

    /**
     * Update the saves list display
     */
    function updateSavesList() {
        const savesList = document.getElementById('savesList');
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
            loadButton.addEventListener('click', () => loadGrades(index));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.className = 'delete-button';
            deleteButton.title = 'Delete this save';
            deleteButton.addEventListener('click', () => {
                if (confirm(`Delete save "${save.name}"?`)) {
                    deleteSave(index);
                }
            });

            saveItem.appendChild(loadButton);
            saveItem.appendChild(deleteButton);
            savesList.appendChild(saveItem);
        });
    }

    /**
     * Clear all inputs
     */
    function clearAllInputs() {
        if (!confirm('Are you sure you want to clear all grades?')) return;

        Object.keys(state.grades).forEach(key => {
            state.grades[key] = '';
            const input = document.querySelector(`input[name="${key}"]`);
            if (input) {
                input.value = '';
            }
        });

        updateCalculations();
    }

    // Event Listeners
    const saveButton = document.getElementById('saveButton');
    const loadButton = document.getElementById('loadButton');
    const clearButton = document.getElementById('clearButton');

    if (saveButton) {
        saveButton.addEventListener('click', saveCurrentGrades);
    }

    if (loadButton) {
        loadButton.addEventListener('click', () => {
            if (savedGrades.length === 0) {
                alert("No saved grades found!");
                return;
            }
            updateSavesList();
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', clearAllInputs);
    }

    // Initialize saves list
    updateSavesList();

    // Return utility functions
    return {
        saveCurrentGrades,
        loadGrades,
        updateSavesList,
        deleteSave,
        clearAllInputs
    };
}

// ============================================================================
// THEME SYSTEM
// ============================================================================

// Theme definitions


/**
 * Apply a theme by name
 * @param {string} themeName - Name of theme to apply
 */
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

/**
 * Initialize theme system
 */
function initTheme() {
    // Only create theme switcher on themes page
    if (document.body.classList.contains('themes')) {
        createThemeSwitcher();
    }

    // Load saved theme or default
    const savedTheme = localStorage.getItem('preferredTheme') || 'add7';
    applyTheme(savedTheme);

    // Set active button on themes page
    if (document.body.classList.contains('themes')) {
        const activeButton = document.querySelector(`[data-theme="${savedTheme}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
}

/**
 * Create theme switcher UI (only on themes page)
 */
function createThemeSwitcher() {
    const themeList = [
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
        { id: 'underwater-dark', name: 'Underwater Dark' },
        { id: 'underwater-light', name: 'Underwater Light' },
        { id: 'ocean-dark', name: 'Ocean Dark' },
        { id: 'ocean-light', name: 'Ocean Light' },
        { id: 'desert-light', name: 'Desert Light' },
        { id: 'desert-dark', name: 'Desert Dark' },
        { id: 'add1', name: 'Additional 1' },
        { id: 'add2', name: 'Additional 2' },
        { id: 'add3', name: 'Additional 3' },
        { id: 'add4', name: 'Additional 4' },
        { id: 'add5', name: 'Additional 5' },
        { id: 'add6', name: 'Additional 6' },
        { id: 'add7', name: 'Additional 7' },
        { id: 'add8', name: 'Additional 8' }
    ];

    // Create main theme section
    const themeSection = document.createElement('div');
    themeSection.className = 'theme-selector';

    // Create heading
    const heading = document.createElement('h3');
    heading.textContent = 'Theme Selector';
    themeSection.appendChild(heading);

    // Create themes grid
    const themesGrid = document.createElement('div');
    themesGrid.className = 'themes-grid';

    // Create theme buttons
    themeList.forEach(theme => {
        const themeButton = document.createElement('button');
        themeButton.className = 'theme-button';
        themeButton.dataset.theme = theme.id;

        // Theme preview
        const preview = document.createElement('div');
        preview.className = 'theme-preview';

        const themeColors = themes[theme.id];
        if (themeColors) {
            preview.style.setProperty('--bg-color', themeColors['--bg-color']);
            preview.style.setProperty('--primary-color', themeColors['--primary']);
            preview.style.setProperty('--text-color', themeColors['--text-color']);
        }

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

    themeSection.appendChild(themesGrid);

    // Inject styles
    const styles = document.createElement('style');
    styles.textContent = `
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

        .themes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 15px;
        }

        .theme-button {
            background: var(--input-bg);
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
            transform: translateY(-2px);
        }

        .theme-button.active {
            border-color: var(--primary);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
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
            text-shadow: 0 0 2px rgba(0,0,0,0.5);
        }

        .theme-button span {
            font-size: 0.8rem;
            margin-top: 5px;
            color: var(--text-color);
            text-align: center;
        }

        .save-item {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: center;
        }

        .save-item .load-save-button {
            flex: 1;
        }

        .save-item .delete-button {
            flex: 0 0 auto;
            min-width: 40px;
            padding: 8px;
            background-color: #dc2626;
        }

        .save-item .delete-button:hover {
            background-color: #b91c1c;
        }
    `;
    document.head.appendChild(styles);

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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Enhance touch interaction for mobile devices
 */
function enhanceTouchInteraction() {
    // Prevent default wheel scroll on number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    });

    // Add tap highlight for better touch feedback
    if (document.body.style.webkitTapHighlightColor !== undefined) {
        document.body.style.webkitTapHighlightColor = 'rgba(0,0,0,0.2)';
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Apply theme immediately before DOM is fully loaded to prevent flash
 */
(function () {
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme && themes[savedTheme]) {
        applyTheme(savedTheme);
    }
})();

/**
 * Initialize theme UI on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    enhanceTouchInteraction();
});