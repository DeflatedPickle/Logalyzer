// Libraries
const Tabulator = require('tabulator-tables');

// Stylesheets
const style = require("../scss/index.scss");

// TODO: Allow columns to be defined on the page
const table = new Tabulator("#table", {
    height: 200,
    data: [],
    layout: "fitColumns",
    columns: [
        {
            title: "Time",
            field: "time"
        },
        {
            title: "Thread",
            field: "thread"
        },
        {
            title: "Level",
            field: "level"
        },
        {
            title: "Class",
            field: "class"
        },
        {
            title: "Information",
            field: "info"
        }
    ]
});

document.getElementById('table').addEventListener('dragover', (e) => {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy';
});


document.getElementById('table').addEventListener("drop", (e) => {
    e.stopPropagation();
    e.preventDefault();

    // TODO: Add an input to reformat this
    const regExFormatter = /([\[\/\]:])/g;

    // TODO: Add an input to define the columns
    const regEx = /\[([0-9]+:[0-9]+:[0-9]+)] \[([a-zA-Z]+)\/([A-Z]+)[\]]?( \[[A-Za-z]+]: |: ):?(.*)/g;

    const columns = ['time', 'thread', 'level', 'class', 'info'];

    const fileList = e.dataTransfer.files;

    for (let file of fileList) {
        const reader = new FileReader();

        reader.addEventListener("loadend", () => {
            if (typeof reader.result === "string") {
                let data = [];

                for (let [index, line] of reader.result.split("\r\n").slice(0, 8).entries()) {
                    document.getElementById("text").append(line, document.createElement("br"));

                    let dataEntry = {id: index};
                    
                    let match;
                    do {
                        match = regEx.exec(line);
                        if (match) {
                            for (let [key, value] of match.slice(1).entries()) {
                                // @ts-ignore
                                dataEntry[columns[key]] = value.replace(regExFormatter, " ");
                            }
                        }
                    } while (match);

                    data.push(dataEntry);
                }

                table.replaceData(data);
            }
        });

        reader.readAsText(file);
    }
});