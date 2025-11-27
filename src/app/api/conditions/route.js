import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { headOffice, warrantyDetails, termsConditions, customerScope, notes, behalfOf } = body;


        // Insert into conditions table
        const [conditionsResult] = await db.query(
            `INSERT INTO conditions 
            (
                headOffice, warrantyDetails, termsConditions, customerScope, notes, behalfOf
            ) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                headOffice,
                warrantyDetails,
                termsConditions,
                customerScope,
                notes,
                behalfOf
            ]
        );

        return NextResponse.json({ success: true, message: "Conditions saved successfully", conditionsId: conditionsResult.insertId }, { status: 201 });

    } catch (err) {
        console.error("Error saving conditions:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

