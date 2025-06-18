import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { latex, filename } = await request.json();

		if (!latex) {
			return NextResponse.json(
				{ error: "LaTeX content is required" },
				{ status: 400 }
			);
		}

		// Attempt to use latex.ytotech.com for DOCX conversion
		// This is speculative as the service is not explicitly documented to support DOCX.
		try {
			console.log("Attempting LaTeX to DOCX conversion via latex.ytotech.com");
			const response = await fetch("https://latex.ytotech.com/builds/sync", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					compiler: "pdflatex",
					resources: [
						{
							main: true,
							content: latex,
						},
					],
					// It's unclear if this service supports other formats, but we can try.
					format: "docx",
				}),
			});

			if (response.ok) {
				const docxBuffer = await response.arrayBuffer();
				return new NextResponse(docxBuffer, {
					headers: {
						"Content-Type":
							"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
						"Content-Disposition": `attachment; filename="${
							filename || "cv.docx"
						}"`,
					},
				});
			} else {
				const errorBody = await response.text();
				console.error(
					`latex.ytotech.com service failed for DOCX: ${response.statusText}`,
					errorBody
				);
				// Fallthrough to the main error response
			}
		} catch (error) {
			console.error("Error with latex.ytotech.com service for DOCX:", error);
			// Fallthrough to the main error response
		}

		// If the service fails, return a specific error.
		return NextResponse.json(
			{
				error:
					"Failed to convert LaTeX to DOCX. This feature is not fully supported by the available services.",
			},
			{ status: 501 } // 501 Not Implemented
		);
	} catch (error) {
		console.error("DOCX compilation error:", error);
		return NextResponse.json(
			{ error: "Failed to process DOCX conversion request." },
			{ status: 500 }
		);
	}
} 