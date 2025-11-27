import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// POST - Create new head office conditions
export async function POST(request) {
    try {
        const body = await request.json();
        const { sectionType, data } = body;

        if (sectionType === 'headOffice') {
            try {
                // Insert the data as JSON string
                const [result] = await db.query("INSERT INTO conditions (headoffice) VALUES (?)", [JSON.stringify(data)]);
                
                return NextResponse.json({ success: true, message: "Head office data saved successfully", id: result.insertId }, { status: 201 });
            } catch (err) {
                console.error("Database error:", err);
                return NextResponse.json({ success: false, error: err.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: false, error: "Invalid section type" }, { status: 400 });

    } catch (err) {
        console.error("Error saving conditions:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// GET - Fetch head office conditions
export async function GET(request) {
    try {
        const sectionType = request.nextUrl.searchParams.get('sectionType');
        
        if (sectionType === 'headOffice') {
            try {
                const [rows] = await db.query("SELECT * FROM conditions WHERE headoffice IS NOT NULL ORDER BY id DESC");
                
                return NextResponse.json({ success: true, data: rows }, { status: 200 });
            } catch (err) {
                console.error("Database error:", err);
                return NextResponse.json({ success: false, error: err.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: false, error: "Invalid section type" }, { status: 400 });

    } catch (err) {
        console.error("Error fetching conditions:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// DELETE - Remove head office condition by ID
export async function DELETE(request) {
    try {
        const body = await request.json();
        const { id, sectionType } = body;

        if (sectionType === 'headOffice') {
            try {
                const [result] = await db.query("DELETE FROM conditions WHERE id = ? AND headoffice IS NOT NULL", [id]);

                if (result.affectedRows === 0) {
                    return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
                }

                return NextResponse.json({ success: true, message: "Head office data deleted successfully" }, { status: 200 });
            } catch (err) {
                console.error("Database error:", err);
                return NextResponse.json({ success: false, error: err.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: false, error: "Invalid section type" }, { status: 400 });

    } catch (err) {
        console.error("Error deleting condition:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}