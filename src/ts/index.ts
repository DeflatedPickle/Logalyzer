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
    const regExFormatter = /(\[|\/|])/g;

    // TODO: Add a widget to define columns and their regex match
    // TODO: Maybe match the whole line, with a big regex then loop the groups to put them in columns
    const regExGroups = {
        "time": /(\[([0-9]+:?)+])/g,
        "thread": /(\[[a-zA-Z]+\/)/g,
        "level": /(\/[A-Z]+])/g,
        "class": /(\[[A-Z][a-zA-Z]+])/g,
        "info": /(: .*)/g
    };

    const fileList = e.dataTransfer.files;

    for (let file of fileList) {
        const reader = new FileReader();

        reader.addEventListener("loadend", () => {
            if (typeof reader.result === "string") {
                let data = [];

                for (let [index, line] of reader.result.split("\r\n").slice(0, 8).entries()) {
                    document.getElementById("text").append(line);

                    let dataEntry = {id: index};

                    for (let [key, value] of Object.entries(regExGroups)) {
                        if (line.match(value) != null) {
                            // TODO: Drop matched sections off the main string
                            for (let match of line.match(value)) {
                                // @ts-ignore
                                dataEntry[key] = match.replace(regExFormatter, "");
                            }
                        }
                    }

                    data.push(dataEntry);
                }

                table.replaceData(data);
            }
        });

        reader.readAsText(file);
    }
});