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

		let pdfBuffer: ArrayBuffer | null = null;

		// Option 1: Use latexonline.cc service
		try {
			const response = await fetch("https://latexonline.cc/compile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code: latex,
					format: "pdf",
					force: true,
				}),
			});

			if (response.ok) {
				pdfBuffer = await response.arrayBuffer();
			} else {
				console.warn(`latexonline.cc service failed: ${response.statusText}`);
			}
		} catch (error) {
			console.warn("Error with latexonline.cc service:", error);
		}

		// Option 2: Fallback to latex.ytotech.com service
		if (!pdfBuffer) {
			try {
				console.log("Trying fallback LaTeX service: latex.ytotech.com");
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
					}),
				});

				if (response.ok) {
					pdfBuffer = await response.arrayBuffer();
				} else {
					const errorBody = await response.text();
					console.error(
						`latex.ytotech.com service failed: ${response.statusText}`,
						errorBody
					);
				}
			} catch (error) {
				console.error("Error with latex.ytotech.com service:", error);
			}
		}

		if (pdfBuffer) {
			// Return the PDF with appropriate headers
			return new NextResponse(pdfBuffer, {
				headers: {
					"Content-Type": "application/pdf",
					"Content-Disposition": `attachment; filename="${
						filename || "cv.pdf"
					}"`,
				},
			});
		}

		// If all services fail, return error
		return NextResponse.json(
			{
				error: "Failed to compile LaTeX document using all available services",
			},
			{ status: 500 }
		);
	} catch (error) {
		console.error("LaTeX compilation error:", error);

		return NextResponse.json(
			{ error: "Failed to compile LaTeX document" },
			{ status: 500 }
		);
	}
} 