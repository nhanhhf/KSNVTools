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
        //const tasks = parseGoogleSheetData(csvData);

        if (tasks.length === 0) {
            throw new Error('No valid tasks found in the sheet');
        }

        //renderGantt(tasks);
        //showStatus(`Successfully loaded ${tasks.length} tasks`, 'success');

    } catch (error) {
        //showStatus(`Error: ${error.message}`, 'error');
        console.error('Error loading data:', error);
    }
}