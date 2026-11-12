// Test minimal docx - check what's broken
import * as docx from 'docx';
import fs from 'fs';

const { Document, Packer, Paragraph, TextRun, ImageRun, ShadingType, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } = docx;

async function run() {
    // Test 1: Pure minimal
    try {
        const doc1 = new Document({ sections: [{ children: [new Paragraph({ children: [new TextRun({ text: "Hello World", bold: true, size: 28 })] })] }] });
        const buf1 = await Packer.toBuffer(doc1);
        fs.writeFileSync('C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/test_step1_minimal.docx', buf1);
        console.log('Step 1 (minimal): OK', buf1.length);
    } catch(e) { console.error('Step 1 FAIL:', e.message); }

    // Test 2: With shading
    try {
        const doc2 = new Document({ sections: [{ children: [
            new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
                new TableRow({ children: [
                    new TableCell({
                        shading: { type: ShadingType.CLEAR, fill: "F0F9FF" },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.SINGLE, size: 18, color: "0284C7" }, right: { style: BorderStyle.NONE } },
                        children: [new Paragraph({ children: [new TextRun({ text: "Shading test", size: 22 })] })]
                    })
                ]})
            ]})
        ]}] });
        const buf2 = await Packer.toBuffer(doc2);
        fs.writeFileSync('C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/test_step2_shading.docx', buf2);
        console.log('Step 2 (shading): OK', buf2.length);
    } catch(e) { console.error('Step 2 FAIL:', e.message); }

    // Test 3: With ImageRun
    try {
        const imgBuf = fs.readFileSync('C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/screenshot_3d_nav.png');
        const doc3 = new Document({ sections: [{ children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new ImageRun({ data: imgBuf, transformation: { width: 400, height: 250 } })]
            })
        ]}] });
        const buf3 = await Packer.toBuffer(doc3);
        fs.writeFileSync('C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/test_step3_image.docx', buf3);
        console.log('Step 3 (image): OK', buf3.length);
    } catch(e) { console.error('Step 3 FAIL:', e.message); }

    // Test 4: With ImageRun using type
    try {
        const imgBuf = fs.readFileSync('C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/screenshot_3d_nav.png');
        const doc4 = new Document({ sections: [{ children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new ImageRun({ type: "png", data: imgBuf, transformation: { width: 400, height: 250 } })]
            })
        ]}] });
        const buf4 = await Packer.toBuffer(doc4);
        fs.writeFileSync('C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/test_step4_image_typed.docx', buf4);
        console.log('Step 4 (image typed): OK', buf4.length);
    } catch(e) { console.error('Step 4 FAIL:', e.message); }

    console.log('All tests done.');
}
run();
