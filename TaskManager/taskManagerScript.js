window.addEventListener('DOMContentLoaded', () => {
    loadData();
    // Initialize Gantt chart or other components here if needed

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
    // Convert "30/07/2025" to "2025-07-30"
    const parts = dateString.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateString; // Return original if format is unexpected
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
    const gantt = new Gantt(ganttContainer, ganttTasks, {
        view_mode: 'Week',
        date_format: 'DD/MM/YYYY',
    readonly: true,});
}
