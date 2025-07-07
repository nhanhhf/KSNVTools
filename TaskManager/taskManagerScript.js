let gantt;

window.addEventListener('DOMContentLoaded', () => {
    loadData();
    // Initialize Gantt chart or other components here if needed
    generateTeamColors(12);
});



async function loadData() {

    // Convert Google Sheets URL to CSV export URL
    let csvUrl = `https://docs.google.com/spreadsheets/d/1rOqn34_gac-1sd5kHMC24eiZBrL-0RagpH22KdFdbDo/export?format=csv`;
    // Ensure the Google Sheet is published to the web
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
    } catch (error) {
        //console.error('Error loading data:', error);
    }
}

function parseGoogleSheetData(csvData) {
    // csvData is only one cell, so we need to split it into rows
    if (!csvData || csvData.trim() === '') {
        console.error('No data found in the Google Sheet');
        return [];
    }
    const rows = csvData.split('&&&').map(row => row.split('|'));
    const tasks = [];

    let prevAssignee = '';
    let assigneeCount = 0;

    // First row is data already in the correct format
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i].map(cell => cell.trim());
        // first cell was added "\"" for some reason, so we need to remove it
        if (i == 0) {
            row[0] = 'NTS';
        }
        // last cell as well, remove last 2 characters
        if (i == rows.length - 1) {
            row[row.length - 1] = row[row.length - 1].slice(0, -1);
        }
        const task = {
            assignee: row[0],
            taskId: row[1],
            id: row[0] + row[1],
            name: row[2],
            description: row[3],
            start: convertDate(row[4]),
            end: convertDate(row[5]),
            status: row[6],
            dependent: row[7],
            customClass: ''
        }

        // Check if the assignee has changed and assign a color
        if (task.assignee !== prevAssignee) {
            prevAssignee = task.assignee;
            assigneeCount++;
        }
        task.customClass = `assignee-color-${assigneeCount % 5}`;

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
        name: task.assignee + ": " + task.name,
        start: task.start,
        end: task.end,
        progress: 0,
        custom_class: task.customClass,
        dependencies: task.dependent,
    }));

    // Initialize Gantt chart
    gantt = new Gantt(ganttContainer, ganttTasks, {
        arrow_curve: 1,
        view_mode: 'Day',
        date_format: 'DD/MM/YYYY',
        readonly: true,
    });
}

function changeTimeView(view) {
    if (gantt) {
        gantt.change_view_mode(view);
    }
}