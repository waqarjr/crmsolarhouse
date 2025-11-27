import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// POST - Create or update head office conditions
export async function POST(request) {
    try {
        const body = await request.json();
        const { sectionType, data } = body;

        if (sectionType === 'headOffice') {
            try {
                // Check if a headOffice record already exists
                const [existing] = await db.query("SELECT id, headOffice FROM conditions WHERE headOffice IS NOT NULL LIMIT 1");
                
                if (existing.length > 0) {
                    // Update existing record by appending new items
                    const currentData = typeof existing[0].headOffice === 'string' 
                        ? JSON.parse(existing[0].headOffice) 
                        : existing[0].headOffice;
                    
                    const updatedData = [...currentData, ...data];
                    
                    await db.query("UPDATE conditions SET headOffice = ? WHERE id = ?", 
                        [JSON.stringify(updatedData), existing[0].id]);
                    
                    return NextResponse.json({ 
                        success: true, 
                        message: "Head office data updated successfully", 
                        id: existing[0].id 
                    }, { status: 200 });
                } else {
                    // Create new record
                    const [result] = await db.query("INSERT INTO conditions (headOffice) VALUES (?)", 
                        [JSON.stringify(data)]);
                    
                    return NextResponse.json({ 
                        success: true, 
                        message: "Head office data saved successfully", 
                        id: result.insertId 
                    }, { status: 201 });
                }
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

// PUT - Update entire head office array (for deleting individual items)
export async function PUT(request) {
    try {
        const body = await request.json();
        const { sectionType, data } = body;

        if (sectionType === 'headOffice') {
            try {
                // Get the existing record
                const [existing] = await db.query("SELECT id FROM conditions WHERE headOffice IS NOT NULL LIMIT 1");
                
                if (existing.length > 0) {
                    // Update the entire array
                    await db.query("UPDATE conditions SET headOffice = ? WHERE id = ?", 
                        [JSON.stringify(data), existing[0].id]);
                    
                    return NextResponse.json({ 
                        success: true, 
                        message: "Head office data updated successfully" 
                    }, { status: 200 });
                } else {
                    return NextResponse.json({ 
                        success: false, 
                        error: "No record found to update" 
                    }, { status: 404 });
                }
            } catch (err) {
                console.error("Database error:", err);
                return NextResponse.json({ success: false, error: err.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: false, error: "Invalid section type" }, { status: 400 });

    } catch (err) {
        console.error("Error updating conditions:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// GET - Fetch head office conditions
export async function GET(request) {
    try {
        const sectionType = request.nextUrl.searchParams.get('sectionType');
        
        if (sectionType === 'headOffice') {
            try {
                const [rows] = await db.query("SELECT id, headOffice FROM conditions WHERE headOffice IS NOT NULL ORDER BY id DESC LIMIT 1");

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

// DELETE - Remove entire head office record (optional - kept for backwards compatibility)
export async function DELETE(request) {
    try {
        const body = await request.json();
        const { id, sectionType } = body;

        if (sectionType === 'headOffice') {
            try {
                const [result] = await db.query("DELETE FROM conditions WHERE id = ? AND headOffice IS NOT NULL", [id]);

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