// Libraries
const tabulator = require('tabulator-tables');
const pascalcase = require('pascalcase');

// JSON
const regex = require("../json/regex.json");
// Scripts
require("../coffee/index.coffee");
// Stylesheets
require("../scss/index.scss");

const table = new tabulator("#table", {
    height: 400,
    data: [],
    layout: "fitData",
    columns: [],
    placeholder: "Feed Me File.",
});

function emptyTable(table: Tabulator, newColumn: boolean = false) {
    for (const column of table.getColumns()) {
        // @ts-ignore
        column.delete();
    }

    if (newColumn) {
        table.addColumn({title: "", field: ""});
    }
}

emptyTable(table, true);

// Event Listeners
document.getElementById('re-select').addEventListener('change', (e) => {
    // @ts-ignore
    const dict = regex[e.target.value];

    (<HTMLInputElement>document.getElementById('re-pattern')).value = dict["pattern"];
    (<HTMLInputElement>document.getElementById('re-formatter')).value = dict["formatter"];
    (<HTMLInputElement>document.getElementById('tb-columns')).value = dict["columns"];

    emptyTable(table, true);
});

document.getElementById('table').addEventListener('dragover', (e) => {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy';
});


document.getElementById('table').addEventListener("drop", (e) => {
    e.stopPropagation();
    e.preventDefault();

    const regEx = new RegExp((<HTMLInputElement>document.getElementById('re-pattern')).value, 'g');
    const regExFormatter = new RegExp((<HTMLInputElement>document.getElementById('re-formatter')).value, 'g');
    const columns = (<HTMLInputElement>document.getElementById('tb-columns')).value.split(",");

    const text = (<HTMLInputElement>document.getElementById('tb-columns')).value;

    if (text != null) {
        emptyTable(table);

        for (let col of text.split(",")) {
            table.addColumn({title: pascalcase(col), field: col})
        }
    }

    const fileList = e.dataTransfer.files;

    for (let file of fileList) {
        const reader = new FileReader();

        reader.addEventListener("loadend", () => {
            if (typeof reader.result === "string") {
                // @ts-ignore
                document.getElementById("text").value = "";

                let data = [];

                const start = +(<HTMLInputElement>document.getElementById('start-rows')).value;
                const limit = +(<HTMLInputElement>document.getElementById('end-rows')).value;

                for (let [index, line] of reader.result.split("\r\n").slice(start, limit).entries()) {
                    // @ts-ignore
                    document.getElementById("text").value += line;
                    // document.createElement("br");

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