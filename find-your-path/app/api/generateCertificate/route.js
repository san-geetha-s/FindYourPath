import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { name, career } = await req.json();
console.log("Received from frontend:", name, career);

    
    const certificatePath = path.join(process.cwd(), "public", "Gold Luxury Certificate of Completion.png");

    // Read the image file
    const imageBytes = fs.readFileSync(certificatePath);

    // Create a new PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 landscape size (in points)

    // Embed the background image
    const pngImage = await pdfDoc.embedPng(imageBytes);
    const { width, height } = pngImage.scale(1);
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width,
      height,
    });

    // Embed font
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Text style
    const nameFontSize = 28;
    const careerFontSize = 18;
    const dateFontSize = 14;

    // 🧭 Step 4 — Adjust coordinates manually to match your certificate layout
    // Tip: Open your PNG in Paint or Canva and note where “Name here” and “[Course Title]” are.
    // Example coordinates below (you can adjust)
    const nameX = 300;   // Horizontal position for Name
    const nameY = 330;   // Vertical position for Name
    const careerX = 300; // Horizontal for Career
    const careerY = 290; // Vertical for Career
    const dateX = 650;   // Date location
    const dateY = 140;   // Vertical for Date

    // Draw text
    page.drawText(name || "Student", {
      x: nameX,
      y: nameY,
      size: nameFontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText(career || "Your Career", {
      x: careerX,
      y: careerY,
      size: careerFontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    const date = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    page.drawText(date, {
      x: dateX,
      y: dateY,
      size: dateFontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${name}_Certificate.pdf"`,
      },
    });
  } catch (err) {
    console.error("Error generating certificate:", err);
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
  }
}
