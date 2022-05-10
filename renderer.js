// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const getDataButton = document.getElementById('get-data-button')
const counter = document.getElementById('counter');
const collectHeapButton = document.getElementById('collect-snapshot-button')

window.electronAPI.callsResponse((response) => {

    const oldValue = Number(counter.innerText)
    counter.innerText = oldValue + 1;
});

getDataButton.addEventListener('click', () => {
    window.electronAPI.getData();
});

collectHeapButton.addEventListener('click', () => {
    window.electronAPI.collectHeapSnapshot();
})