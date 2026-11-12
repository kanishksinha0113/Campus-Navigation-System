import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as docx from 'docx';

import { getFrontMatter } from './sections/00_front_matter.js';
import { getChapter1 } from './sections/01_introduction.js';
import { getChapter2 } from './sections/02_problem_objectives.js';
import { getChapter3 } from './sections/03_system_requirements.js';
import { getChapter4 } from './sections/04_architecture_design.js';
import { getChapter5 } from './sections/05_tech_data_structures.js';
import { getChapter6 } from './sections/06_algorithms_methodology.js';
import { getChapter7 } from './sections/07_system_implementation.js';
import { getChapter8 } from './sections/08_testing_results.js';
import { getChapter9 } from './sections/09_limitations_future_scope.js';
import { getChapter10AndReferences } from './sections/10_conclusion_references.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const {
    Document, Packer, Paragraph, TextRun, AlignmentType,
    Header, Footer, PageNumber
} = docx;

console.log("=== Campus Navigation System Report Generator ===");
console.log("Assembling all 10 chapters and preliminary sections...");

const allDocChildren = [];
let fullMarkdown = "";

const sections = [
    { name: "Front Matter", fn: () => getFrontMatter() },
    { name: "Chapter 1: Introduction", fn: () => getChapter1() },
    { name: "Chapter 2: Problem Statement & Objectives", fn: () => getChapter2() },
    { name: "Chapter 3: System Requirements Specification", fn: () => getChapter3() },
    { name: "Chapter 4: System Architecture & Design", fn: () => getChapter4() },
    { name: "Chapter 5: Technologies & Data Structures", fn: () => getChapter5() },
    { name: "Chapter 6: Algorithms and Methodology", fn: () => getChapter6() },
    { name: "Chapter 7: System Implementation", fn: () => getChapter7() },
    { name: "Chapter 8: Testing and Results", fn: () => getChapter8(projectRoot) },
    { name: "Chapter 9: Limitations and Future Scope", fn: () => getChapter9() },
    { name: "Chapter 10: Conclusion & References", fn: () => getChapter10AndReferences() }
];

sections.forEach(({ name, fn }) => {
    console.log(`- Compiling ${name}...`);
    const { doc, md } = fn();
    allDocChildren.push(...doc);
    fullMarkdown += md + "\n\n";
});

// Construct Document with Professional Academic Layout
const doc = new Document({
    sections: [{
        properties: {
            page: {
                margin: {
                    top: 1440,    // 1 inch
                    bottom: 1440, // 1 inch
                    left: 1440,   // 1 inch
                    right: 1440   // 1 inch
                }
            }
        },
        headers: {
            default: new Header({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 0, after: 120 },
                        children: [
                            new TextRun({
                                text: "CAMPUS NAVIGATION SYSTEM — CAPSTONE PROJECT REPORT",
                                size: 16,
                                color: "64748B",
                                font: "Calibri"
                            })
                        ]
                    })
                ]
            })
        },
        footers: {
            default: new Footer({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 120, after: 0 },
                        children: [
                            new TextRun({
                                text: "Kanishk Sinha (AP25110080048) — CSE BDA 'A'  |  Page ",
                                size: 18,
                                color: "64748B",
                                font: "Calibri"
                            }),
                            new TextRun({
                                children: [PageNumber.CURRENT],
                                size: 18,
                                bold: true,
                                color: "1E3A8A",
                                font: "Calibri"
                            })
                        ]
                    })
                ]
            })
        },
        children: allDocChildren
    }]
});

const docxOutputPath = path.join(projectRoot, 'Campus_Navigation_System_Project_Report.docx');
const mdOutputPath = path.join(projectRoot, 'Campus_Navigation_System_Project_Report.md');

console.log("Generating DOCX binary buffer...");
Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(docxOutputPath, buffer);
    console.log(`✓ Successfully written DOCX report: ${docxOutputPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);

    fs.writeFileSync(mdOutputPath, fullMarkdown, 'utf8');
    const wordCount = fullMarkdown.split(/\s+/).filter(Boolean).length;
    console.log(`✓ Successfully written Markdown report: ${mdOutputPath} (${wordCount} words, ${(fullMarkdown.length / 1024).toFixed(1)} KB)`);
    console.log("=== Report Compilation Complete! ===");
}).catch(err => {
    console.error("Error generating report:", err);
    process.exit(1);
});
