// Libraries
const tabulator = require('tabulator-tables');
const pascalcase = require('pascalcase');

// JSON
const regex = require("../json/regex.json");
// Stylesheets
const style = require("../scss/index.scss");

// TODO: Allow columns to be defined on the page
const table = new tabulator("#table", {
    height: 200,
    data: [],
    layout: "fitColumns",
    columns: []
});
emptyTable(table, true);

document.getElementById('re-select').addEventListener('change', (e) => {
    // @ts-ignore
    const dict = regex[e.target.value];

    (<HTMLInputElement>document.getElementById('re-pattern')).value = dict["pattern"];
    (<HTMLInputElement>document.getElementById('re-formatter')).value = dict["formatter"];
    (<HTMLInputElement>document.getElementById('tb-columns')).value = dict["columns"];

    emptyTable(table, true);
});

function emptyTable(table: Tabulator, newColumn: boolean = false) {
    for (const column of table.getColumns()) {
        // @ts-ignore
        column.delete();
    }

    if (newColumn) {
        table.addColumn({title: "Please, Tabulate Me", field: ""});
    }
}

document.getElementById('tabulate').addEventListener('click', () => {
    const text = (<HTMLInputElement>document.getElementById('tb-columns')).value;

    if (text != null) {
        emptyTable(table);

        for (let col of text.split(",")) {
            table.addColumn({title: pascalcase(col), field: col})
        }
    }
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

    const fileList = e.dataTransfer.files;

    for (let file of fileList) {
        const reader = new FileReader();

        reader.addEventListener("loadend", () => {
            if (typeof reader.result === "string") {
                let data = [];

                for (let [index, line] of reader.result.split("\r\n").slice(0, 8).entries()) {
                    console.log(line);
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