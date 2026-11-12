import * as docx from 'docx';

const {
    Paragraph, TextRun, Table, TableRow, TableCell,
    HeadingLevel, AlignmentType, WidthType, BorderStyle, PageBreak,
    ShadingType
} = docx;

export const COLOR_PRIMARY = "0B132B";     // Deep Navy
export const COLOR_SECONDARY = "1C2541";   // Slate Blue
export const COLOR_ACCENT = "0284C7";      // Electric Cyan / Blue
export const COLOR_TEXT = "1E293B";        // Dark Slate Body
export const COLOR_MUTED = "64748B";       // Muted Gray
export const COLOR_BORDER = "CBD5E1";      // Light Border
export const COLOR_BG_LIGHT = "F8FAFC";    // Off-white / light slate
export const COLOR_CODE_BG = "F1F5F9";     // Light Code Background
export const COLOR_CODE_TEXT = "0F172A";   // Deep Code Text

export function p(text, opts = {}) {
    return new Paragraph({
        alignment: opts.align || AlignmentType.JUSTIFY,
        spacing: { before: opts.before || 60, after: opts.after || 100, line: 276 },
        children: [
            new TextRun({
                text,
                size: opts.size || 22,
                font: opts.font || "Calibri",
                color: opts.color || COLOR_TEXT,
                bold: opts.bold || false,
                italic: opts.italic || false
            })
        ]
    });
}

export function h1(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 180 },
        children: [new TextRun({ text, size: 28, bold: true, color: COLOR_PRIMARY, font: "Arial" })]
    });
}

export function h2(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 260, after: 120 },
        children: [new TextRun({ text, size: 24, bold: true, color: COLOR_SECONDARY, font: "Arial" })]
    });
}

export function h3(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text, size: 21, bold: true, color: COLOR_ACCENT, font: "Arial" })]
    });
}

export function bullet(title, desc) {
    return new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 40, after: 60, line: 276 },
        children: [
            new TextRun({ text: title + ": ", bold: true, color: COLOR_PRIMARY, size: 22, font: "Calibri" }),
            new TextRun({ text: desc, color: COLOR_TEXT, size: 22, font: "Calibri" })
        ]
    });
}

export function subBullet(title, desc) {
    return new Paragraph({
        bullet: { level: 1 },
        spacing: { before: 30, after: 40, line: 260 },
        children: [
            new TextRun({ text: title + ": ", bold: true, color: COLOR_SECONDARY, size: 21, font: "Calibri" }),
            new TextRun({ text: desc, color: COLOR_TEXT, size: 21, font: "Calibri" })
        ]
    });
}

export function code(codeText, caption = "") {
    const paras = [];
    if (caption) {
        paras.push(new Paragraph({
            spacing: { before: 140, after: 40 },
            children: [new TextRun({ text: "Listing: " + caption, italic: true, bold: true, size: 19, color: COLOR_MUTED, font: "Consolas" })]
        }));
    }
    const lines = codeText.split('\n');
    lines.forEach(line => {
        paras.push(new Paragraph({
            spacing: { before: 10, after: 10, line: 220 },
            shading: { type: ShadingType.CLEAR, fill: COLOR_CODE_BG },
            children: [new TextRun({ text: line || " ", size: 18, font: "Consolas", color: COLOR_CODE_TEXT })]
        }));
    });
    return paras;
}

export function callout(title, text) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        shading: { type: ShadingType.CLEAR, fill: "F0F9FF" },
                        margins: { top: 140, bottom: 140, left: 180, right: 180 },
                        borders: {
                            left: { style: BorderStyle.SINGLE, size: 18, color: COLOR_ACCENT },
                            top: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE }
                        },
                        children: [
                            new Paragraph({
                                spacing: { before: 0, after: 40 },
                                children: [new TextRun({ text: title, bold: true, size: 21, color: COLOR_ACCENT, font: "Arial" })]
                            }),
                            new Paragraph({
                                spacing: { before: 0, after: 0, line: 260 },
                                children: [new TextRun({ text: text, size: 20, font: "Calibri", color: COLOR_TEXT })]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

export function table(headers, rows, widths = []) {
    const tableRows = [];
    const headerCells = headers.map((h, i) => new TableCell({
        width: widths[i] ? { size: widths[i], type: WidthType.PERCENTAGE } : undefined,
        shading: { type: ShadingType.CLEAR, fill: COLOR_SECONDARY },
        margins: { top: 120, bottom: 120, left: 140, right: 140 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })]
    }));
    tableRows.push(new TableRow({ children: headerCells }));

    rows.forEach((row, rIdx) => {
        const rowCells = row.map((cellText, cIdx) => new TableCell({
            width: widths[cIdx] ? { size: widths[cIdx], type: WidthType.PERCENTAGE } : undefined,
            shading: { type: ShadingType.CLEAR, fill: rIdx % 2 === 1 ? COLOR_BG_LIGHT : "FFFFFF" },
            margins: { top: 100, bottom: 100, left: 120, right: 120 },
            borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
                left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
                right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER }
            },
            children: [new Paragraph({
                alignment: cIdx === 0 ? AlignmentType.LEFT : (cIdx === 1 ? AlignmentType.LEFT : AlignmentType.CENTER),
                children: [new TextRun({ text: String(cellText), size: 19, font: "Calibri", color: COLOR_TEXT })]
            })]
        }));
        tableRows.push(new TableRow({ children: rowCells }));
    });

    return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows });
}

export function pageBreak() {
    return new Paragraph({ children: [new PageBreak()] });
}
