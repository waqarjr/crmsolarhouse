import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { quotationItems, productionDetails, totals, orderDetails } = body;

    // Validate required data
    if (!quotationItems || quotationItems.length === 0) {
      return NextResponse.json({ success: false, error: "Quotation items are required" }, { status: 400 });
    }

    if (!orderDetails || !productionDetails || !totals) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 });
    }

    // Insert into quotations table
    const [quotationResult] = await db.query(
      `INSERT INTO quotations 
      (
        user_name, email, phone, dateCreated, timeCreated, status,
        monthlyProduction, annualProduction, annualSaving, backupPeriod,
        totalWithoutNetMetering, totalWithNetMetering
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderDetails.name,
        orderDetails.email,
        orderDetails.phone,
        orderDetails.dateCreated,
        orderDetails.time,
        orderDetails.status,
        productionDetails.monthlyProduction,
        productionDetails.annualProduction,
        productionDetails.annualSaving,
        productionDetails.backupPeriod,
        totals.withoutNetMetering,
        totals.withNetMetering,
      ]
    );

    const quotationId = quotationResult.insertId;

    // Insert billing information
    await db.query(
      `INSERT INTO quotation_billing 
      (quotation_id, firstName, lastName, address, city, state, postcode, phone, email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quotationId,
        orderDetails.billing.firstName,
        orderDetails.billing.lastName,
        orderDetails.billing.address,
        orderDetails.billing.city,
        orderDetails.billing.state,
        orderDetails.billing.postcode,
        orderDetails.billing.phone,
        orderDetails.billing.email
      ]
    );

    // Insert shipping information
    await db.query(
      `INSERT INTO quotation_shipping 
      (quotation_id, firstName, lastName, address, city, state, postcode, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quotationId,
        orderDetails.shipping.firstName,
        orderDetails.shipping.lastName,
        orderDetails.shipping.address,
        orderDetails.shipping.city,
        orderDetails.shipping.state,
        orderDetails.shipping.postcode,
        orderDetails.shipping.phone || orderDetails.billing.phone
      ]
    );

    // Insert all quotation items
    for (const item of quotationItems) {
      await db.query(
        `INSERT INTO quotation_items 
         (quotation_id, productId, description, brand, model, qty, rate, amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          quotationId,
          item.productId,
          item.description,
          item.brand,
          item.model,
          item.qty,
          item.rate,
          item.amount
        ]
      );
    }

    return NextResponse.json({ success: true, message: "Quotation saved successfully", quotationId }, { status: 201 });

  } catch (err) {
    console.error("Error saving quotation:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}