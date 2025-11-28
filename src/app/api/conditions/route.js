import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const VALID_SECTION_TYPES = [
  'headOffice', 
  'warrantyDetails', 
  'termsConditions', 
  'customerScope', 
  'notes', 
  'behalfOf',
  'heading'
];

// POST - Create or update section data
export async function POST(request) {
    try {
        const body = await request.json();
        const { sectionType, data } = body;

        if (!VALID_SECTION_TYPES.includes(sectionType)) {
            return NextResponse.json({ success: false, error: "Invalid section type" }, { status: 400 });
        }

        try {
            // Check if a record already exists for this section
            const [existing] = await db.query(
                `SELECT id, ${sectionType} FROM conditions WHERE ${sectionType} IS NOT NULL LIMIT 1`
            );
            
            if (existing.length > 0) {
                // For heading, just update the value directly
                if (sectionType === 'heading') {
                    await db.query(
                        `UPDATE conditions SET ${sectionType} = ? WHERE id = ?`, 
                        [data, existing[0].id]
                    );
                } else {
                    // For array sections, append new items
                    const currentData = typeof existing[0][sectionType] === 'string' 
                        ? JSON.parse(existing[0][sectionType]) 
                        : existing[0][sectionType];
                    
                    const updatedData = [...currentData, ...data];
                    
                    await db.query(
                        `UPDATE conditions SET ${sectionType} = ? WHERE id = ?`, 
                        [JSON.stringify(updatedData), existing[0].id]
                    );
                }
                
                return NextResponse.json({ 
                    success: true, 
                    message: `${sectionType} data updated successfully`, 
                    id: existing[0].id 
                }, { status: 200 });
            } else {
                // Create new record
                const value = sectionType === 'heading' ? data : JSON.stringify(data);
                const [result] = await db.query(
                    `INSERT INTO conditions (${sectionType}) VALUES (?)`, 
                    [value]
                );
                
                return NextResponse.json({ 
                    success: true, 
                    message: `${sectionType} data saved successfully`, 
                    id: result.insertId 
                }, { status: 201 });
            }
        } catch (err) {
            console.error("Database error:", err);
            return NextResponse.json({ success: false, error: err.message }, { status: 500 });
        }

    } catch (err) {
        console.error("Error saving conditions:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// PUT - Update entire section data (for deleting individual items or updating heading)
export async function PUT(request) {
    try {
        const body = await request.json();
        const { sectionType, data } = body;

        if (!VALID_SECTION_TYPES.includes(sectionType)) {
            return NextResponse.json({ success: false, error: "Invalid section type" }, { status: 400 });
        }

        try {
            // Get the existing record
            const [existing] = await db.query(`SELECT id FROM conditions WHERE ${sectionType} IS NOT NULL LIMIT 1`);
            
            if (existing.length > 0) {
                // Update the entire data
                const value = sectionType === 'heading' ? data : JSON.stringify(data);
                await db.query(`UPDATE conditions SET ${sectionType} = ? WHERE id = ?`, [value, existing[0].id]);
                
                return NextResponse.json({ success: true, message: `${sectionType} data updated successfully` }, { status: 200 });
            } else {
                return NextResponse.json({ success: false, error: "No record found to update" }, { status: 404 });
            }
        } catch (err) {
            console.error("Database error:", err);
            return NextResponse.json({ success: false, error: err.message }, { status: 500 });
        }

    } catch (err) {
        console.error("Error updating conditions:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// GET - Fetch section data
export async function GET(request) {
    try {
        
            // const authHeader = request.headers.get("authorization");

    // if (!authHeader || !authHeader.startsWith("Basic ")) {
    //   return new Response("Unauthorized", { status: 401 });
    // }

    // // Decode Base64 credentials
    // const base64Credentials = authHeader.split(" ")[1];
    // const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    // const [username, password] = credentials.split(":");

    // // Validate credentials
    // if (
    //   username !== process.env.API_USERNAME ||
    //   password !== process.env.API_PASSWORD
    // ) {
    //   return new Response("Forbidden - Invalid credentials", { status: 403 });
    // }

    // console.log("User verified successfully");

        const sectionType = request.nextUrl.searchParams.get('sectionType');
        
        if (!sectionType) {
            // Fetch all conditions
            const [rows] = await db.query("SELECT * FROM conditions LIMIT 1");
            return NextResponse.json({ success: true, data: rows }, { status: 200 });
        }
        
        if (!VALID_SECTION_TYPES.includes(sectionType)) {
            return NextResponse.json({ success: false, error: "Invalid section type" }, { status: 400 });
        }

        try {
            const [rows] = await db.query(
                `SELECT id, ${sectionType} FROM conditions WHERE ${sectionType} IS NOT NULL ORDER BY id DESC LIMIT 1`
            );

            return NextResponse.json({ success: true, data: rows }, { status: 200 });
        } catch (err) {
            console.error("Database error:", err);
            return NextResponse.json({ success: false, error: err.message }, { status: 500 });
        }

    } catch (err) {
        console.error("Error fetching conditions:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// DELETE - Remove entire section record (optional - kept for backwards compatibility)
export async function DELETE(request) {
    try {
        const body = await request.json();
        const { id, sectionType } = body;

        if (!VALID_SECTION_TYPES.includes(sectionType)) {
            return NextResponse.json({ success: false, error: "Invalid section type" }, { status: 400 });
        }

        try {
            const [result] = await db.query(
                `DELETE FROM conditions WHERE id = ? AND ${sectionType} IS NOT NULL`, 
                [id]
            );

            if (result.affectedRows === 0) {
                return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
            }

            return NextResponse.json({ success: true, message: `${sectionType} data deleted successfully` }, { status: 200 });
        } catch (err) {
            console.error("Database error:", err);
            return NextResponse.json({ success: false, error: err.message }, { status: 500 });
        }

    } catch (err) {
        console.error("Error deleting condition:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}