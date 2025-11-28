import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Fetch quotation details
    const [quotationRows] = await db.query("SELECT * FROM quotations WHERE id = ?", [id]);
    
    if (quotationRows.length === 0) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    const quotation = quotationRows[0];

    // Fetch quotation items
    const [itemRows] = await db.query("SELECT * FROM quotation_items WHERE quotation_id = ?", [id]);

    return NextResponse.json({ ...quotation, items: itemRows });
  } catch (error) {
    console.error("Error fetching quotation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await db.query("DELETE FROM quotations WHERE id = ?", [id]);
    
    return NextResponse.json({ success: true, message: "Quotation deleted successfully" });
  } catch (error) {
    console.error("Error deleting quotation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
