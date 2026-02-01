// specific theme definitions to be used across all pages
const themes = {
    // Basic themes
    'white': {
        '--bg-color': '#ffffff',
        '--text-color': '#000000',
        '--primary': '#333333',
        '--border-color': '#cccccc',
        '--input-bg': '#f9f9f9',
        '--module-bg': '#ffffff',
        '--unit-bg': 'linear-gradient(to bottom right, #ffffff, #f5f5f5)'
    },
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

    // Special themes
    'dracula': {
        '--bg-color': '#282a36',
        '--text-color': '#f8f8f2',
        '--primary': '#bd93f9',
        '--border-color': '#6272a4',
        '--input-bg': '#44475a',
        '--module-bg': '#383a59',
        '--unit-bg': 'linear-gradient(to bottom right, #21222c, #282a36)'
    },
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
    'sepia': {
        '--bg-color': '#3e2723',
        '--text-color': '#efebe9',
        '--primary': '#a1887f',
        '--border-color': '#4e342e',
        '--input-bg': '#2d2221',
        '--module-bg': '#352f2f',
        '--unit-bg': 'linear-gradient(to bottom right, #2a1f1b, #3e2723)'
    },
    'matrix-dark': {
        '--bg-color': '#000000',
        '--text-color': '#00ff00',
        '--primary': '#00a300',
        '--border-color': '#003300',
        '--input-bg': '#002200',
        '--module-bg': '#001a00',
        '--unit-bg': 'linear-gradient(to bottom right, #001500, #000f00)'
    },
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

// Make it available globally if needed (though it defaults to global scope)
window.themes = themes;
