import { get_history_by_user } from './db.js';
export const LOCAL_STORAGE_USER_KEY = 'uuid';

async function populateHistory(username) {
    const data = await get_history_by_user(username);
    if (!data) {
        console.log('No data found');
        return;
    }
    // Assuming data is an object or array you want to display
    // Find the container in your HTML where you want to display the data
    const container = document.getElementById('history-container');
    container.innerHTML = ''; // Clear existing contents

    // Object.keys(data).forEach(key => {
    //     const challenge = data[key];
    //     const div = document.createElement('div');
    //     div.innerHTML = `Challenge Name: ${challenge.name}, Timestamp: ${new Date(challenge.timestamp).toLocaleString()}`;
    //     container.appendChild(div);
    // });

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Challenge Name</th>
                <th>Timestamp</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    container.appendChild(table);

    const tbody = table.querySelector('tbody');

    Object.keys(data).forEach(key => {
        const challenge = data[key];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${challenge.name}</td>
            <td>${new Date(challenge.timestamp).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });

    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '20px';
    table.querySelectorAll('th, td').forEach(cell => {
        cell.style.border = '1px solid #ddd';
        cell.style.padding = '8px';
        cell.style.textAlign = 'left';
    });
    table.querySelector('thead').style.backgroundColor = '#f2f2f2';
}

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);

    const usernameDisplay = document.getElementById('username-display');

    if (username) {
        usernameDisplay.textContent = username;
    } else {
        usernameDisplay.textContent = 'User'; // Default text if no username is found
    }
    populateHistory(username); 
});