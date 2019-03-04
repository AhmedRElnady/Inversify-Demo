import * as fs from "fs";
import * as _ from "lodash";
import * as path from "path";
const sourceFile = require('../api/middlewares/swagger/swagger');


export function prepareDocs(version: string): object {
    const docsFolder = `/docs/${version}/`,
        docsFiles = [];

    fs.readdirSync(path.dirname(__dirname) + docsFolder).forEach(file => {
        const docFile = require(path.dirname(__dirname) + `${docsFolder}${file}`);
        docsFiles.push(docFile);
    })

    return _.merge(sourceFile, ...docsFiles);
}