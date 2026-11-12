import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as docx from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    HeadingLevel, AlignmentType, WidthType, BorderStyle, PageBreak,
    Header, Footer, PageNumber, NumberFormat, ImageRun, ShadingType
} = docx;

console.log('Script initialized. Starting comprehensive report generation...');
