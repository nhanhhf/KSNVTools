let gantt;

window.addEventListener('DOMContentLoaded', () => {
    loadData();
    // Initialize Gantt chart or other components here if needed
    generateTeamColors(12   );
});



async function loadData() {

    // Convert Google Sheets URL to CSV export URL
    let csvUrl = `https://docs.google.com/spreadsheets/d/1rOqn34_gac-1sd5kHMC24eiZBrL-0RagpH22KdFdbDo/export?format=csv`;
    
    //showStatus('Loading data from Google Sheets...', 'loading');

    try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data. Make sure your Google Sheet is published to the web.');
        }

        const csvData = await response.text();
        console.log('CSV Data:', csvData);
        const tasks = parseGoogleSheetData(csvData);

        if (tasks.length === 0) {
            throw new Error('No valid tasks found in the sheet');
        }

        renderGantt(tasks);
        //showStatus(`Successfully loaded ${tasks.length} tasks`, 'success');

    } catch (error) {
        //showStatus(`Error: ${error.message}`, 'error');
        //console.error('Error loading data:', error);
    }
}

function parseGoogleSheetData(csvData) {
    const rows = csvData.split('\r\n').map(row => row.split(','));
    const tasks = [];

    // First row is data already in the correct format
    for (let i = 0; i  < rows.length; i++) {
        const row = rows[i].map(cell => cell.trim());

        const task = {
            id: `task${i}`,
            assignee: row[0], 
            name: row[1],
            start: convertDate(row[2]),
            end: convertDate(row[3]),
        }
        tasks.push(task);
    }
    console.log('Parsed Tasks:', tasks);
    return tasks;
}

function convertDate(dateString) {
    // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
    const parts = dateString.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateString;
}

function renderGantt(tasks) {
    const ganttContainer = document.getElementById('gantt');
    ganttContainer.innerHTML = ''; // Clear previous content

    const ganttTasks = tasks.map(task => ({
        id: task.id,
        name: task.name,
        start: task.start,
        end: task.end,
        progress: 0,
        dependencies: [],
    }));

    // Initialize Gantt chart
    gantt = new Gantt(ganttContainer, ganttTasks, {
        view_mode: 'Week',
        date_format: 'DD/MM/YYYY',
    readonly: true,});
}

function changeTimeView(view) {
    if (gantt) {
        gantt.change_view_mode(view);
    }
}

function generateTeamColors(count){
    const colors = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
        '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f',
        '#8e44ad', '#16a085', '#2c3e50', '#d35400', '#27ae60',
        '#c0392b', '#8b5cf6', '#06b6d4', '#84cc16', '#f59e0b'
    ];
    return colors.slice(0, count);
}