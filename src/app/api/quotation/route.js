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

    // Prepare billing and shipping JSON objects
    const billingJSON = JSON.stringify({
      firstName: orderDetails.billing.firstName,
      lastName: orderDetails.billing.lastName,
      address: orderDetails.billing.address,
      city: orderDetails.billing.city,
      state: orderDetails.billing.state,
      postcode: orderDetails.billing.postcode,
      phone: orderDetails.billing.phone,
      email: orderDetails.billing.email
    });

    const shippingJSON = JSON.stringify({
      firstName: orderDetails.shipping.firstName,
      lastName: orderDetails.shipping.lastName,
      address: orderDetails.shipping.address,
      city: orderDetails.shipping.city,
      state: orderDetails.shipping.state,
      postcode: orderDetails.shipping.postcode,
      phone: orderDetails.shipping.phone || orderDetails.billing.phone
    });

    // Insert into quotations table 
    const [orderResult] = await db.query(
      `INSERT INTO quotations 
      (
        email, phone, date_created, time_created, status,
        monthly_production, annual_production, annual_saving, backup_period,
        total_without_net_metering, total_with_net_metering,
        billing, shipping
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderDetails.email,
        orderDetails.phone,
        orderDetails.dateCreated,
        orderDetails.time,
        orderDetails.status || 'pending',
        productionDetails.monthlyProduction,
        productionDetails.annualProduction,
        productionDetails.annualSaving,
        productionDetails.backupPeriod,
        totals.withoutNetMetering,
        totals.withNetMetering,
        billingJSON,
        shippingJSON
      ]
    );

    const orderId = orderResult.insertId;

    // Insert all quotation items
    for (const item of quotationItems) {
      await db.query(
        `INSERT INTO quotation_items 
         (quotation_id, product_name, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.description || item.productName || item.product_name,
          item.qty || item.quantity,
          item.rate || item.price
        ]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order saved successfully", 
      orderId 
    }, { status: 201 });

  } catch (err) {
    console.error("Error saving order:", err);
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}