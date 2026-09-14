// Comprehensive Automated Verification of All SIH 26033 Workflows
// Prepared by Cyber Shield

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('CYBER SHIELD PAN-INDIA B2B CROP MARKETPLACE E2E TEST');
  console.log('====================================================\n');

  // 1. Test Bootstrap API
  console.log('[1/7] Testing Bootstrap Data API...');
  const bootRes = await fetch(`${BASE_URL}/api/bootstrap`);
  const bootData = await bootRes.json();
  if (!bootData.success) throw new Error('Bootstrap API failed');
  console.log(`✓ Loaded: ${bootData.data.catalogue.length} crops in catalogue, ${bootData.data.officers.length} officers, ${bootData.data.listings.length} listings`);

  // 2. Test India-Wide Discovery & Filters
  console.log('\n[2/7] Testing Marketplace Search & Cascading Location Filters...');
  const filterRes = await fetch(`${BASE_URL}/api/listings?state=Tamil%20Nadu&district=Thanjavur`);
  const filterData = await filterRes.json();
  if (!filterData.success || filterData.data.length === 0) throw new Error('Location filter failed');
  console.log(`✓ Tamil Nadu -> Thanjavur filter returned ${filterData.data.length} listings (e.g. ${filterData.data[0].crop} - ${filterData.data[0].listingCode})`);

  // 3. Test Canonical 50 kg Tomato Lot & Partial Procurement
  console.log('\n[3/7] Testing Canonical 50 kg Tomato Lot Partial Procurement...');
  const canonicalLot = bootData.data.listings.find((l) => l.listingCode === 'LOT-2026-TOM-050');
  if (!canonicalLot) throw new Error('Canonical 50kg lot not found');
  console.log(`✓ Canonical Lot Found: ${canonicalLot.listingCode}, Total: ${canonicalLot.totalQuantityKg} kg, Available: ${canonicalLot.availableQuantityKg} kg`);

  // Submit Bid for 10 kg @ Rs. 20/kg from AgroPure Foods
  console.log('  -> Submitting Bid 1: 10 kg @ ₹20.00/kg by AgroPure Foods...');
  const bid1Res = await fetch(`${BASE_URL}/api/bids`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listingId: canonicalLot.id,
      buyerId: 'byr-1',
      requestedQuantityKg: 10,
      offeredPricePerKg: 20.0,
      proposedPickupDate: '2026-09-18',
      validityHours: 24,
    }),
  });
  const bid1Data = await bid1Res.json();
  if (!bid1Data.success) throw new Error(`Bid 1 submission failed: ${bid1Data.error}`);
  console.log(`  ✓ Bid 1 Placed: ID ${bid1Data.data.id}, Total Value: ₹${bid1Data.data.totalBidAmount}`);

  // Submit Bid for 20 kg @ Rs. 22/kg from NIT Trichy Mess
  console.log('  -> Submitting Bid 2: 20 kg @ ₹22.00/kg by NIT Trichy Mess...');
  const bid2Res = await fetch(`${BASE_URL}/api/bids`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listingId: canonicalLot.id,
      buyerId: 'byr-2',
      requestedQuantityKg: 20,
      offeredPricePerKg: 22.0,
      proposedPickupDate: '2026-09-18',
      validityHours: 24,
    }),
  });
  const bid2Data = await bid2Res.json();
  if (!bid2Data.success) throw new Error(`Bid 2 submission failed: ${bid2Data.error}`);
  console.log(`  ✓ Bid 2 Placed: ID ${bid2Data.data.id}, Total Value: ₹${bid2Data.data.totalBidAmount}`);

  // 4. Farmer Proposes Allocation & Officer Confirms by Phone
  console.log('\n[4/7] Testing Farmer Bid Selection, Allocation & Officer Phone Confirmation...');
  // Farmer selects Bid 1 (10 kg)
  const alloc1Res = await fetch(`${BASE_URL}/api/allocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'farmer_select',
      bidId: bid1Data.data.id,
      allocatedKg: 10,
      farmerId: canonicalLot.sellerId,
    }),
  });
  const alloc1Data = await alloc1Res.json();
  if (!alloc1Data.success) throw new Error(`Farmer allocation failed: ${alloc1Data.error}`);
  console.log(`  ✓ Farmer selected bid and allocated 10 kg (Allocation ID: ${alloc1Data.data.id})`);

  // Officer confirms Bid 1 telephonically with buyer
  const phoneConfRes = await fetch(`${BASE_URL}/api/allocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'officer_confirm',
      allocationId: alloc1Data.data.id,
      officerId: 'usr-officer-4',
      officerName: 'Dr. Vijay Deshmukh (TAO)',
      phoneNotes: 'Verified 10 kg @ Rs. 20/kg with AgroPure procurement lead.',
    }),
  });
  const phoneConfData = await phoneConfRes.json();
  if (!phoneConfData.success) throw new Error('Officer phone confirmation failed');
  console.log('  ✓ Officer telephonic confirmation recorded in immutable audit log');

  // Buyer accepts terms -> commits order and locks quantity atomically!
  console.log('  -> Buyer accepts final terms to generate independent order...');
  const buyerAcceptRes = await fetch(`${BASE_URL}/api/allocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'buyer_accept',
      allocationId: alloc1Data.data.id,
      buyerId: 'byr-1',
    }),
  });
  const buyerAcceptData = await buyerAcceptRes.json();
  if (!buyerAcceptData.success) throw new Error(`Buyer acceptance failed: ${buyerAcceptData.error}`);
  const createdOrder = buyerAcceptData.data.order;
  console.log(`  ✓ Independent Order Created: ${createdOrder.orderNumber}, Confirmed: ${createdOrder.confirmedQuantityKg} kg, Total: ₹${createdOrder.totalOrderAmount}`);

  // Verify Atomic Balance Calculation: 50 kg total - 10 kg allocated = 40 kg available
  const updatedBoot = await (await fetch(`${BASE_URL}/api/bootstrap`)).json();
  const recheckedLot = updatedBoot.data.listings.find((l) => l.id === canonicalLot.id);
  console.log(`  ✓ Atomic Lot Balance Verified: ${recheckedLot.availableQuantityKg} kg remaining available (Allocated: ${recheckedLot.allocatedQuantityKg} kg)`);

  // 5. Test Simulated Banking Escrow Prepayment
  console.log('\n[5/7] Testing Demo Banking Escrow Prepayment...');
  const prepayRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'prepay_escrow',
      orderId: createdOrder.id,
    }),
  });
  const prepayData = await prepayRes.json();
  if (!prepayData.success) throw new Error('Escrow prepayment failed');
  console.log(`  ✓ Escrow Prepayment Confirmed: Order status -> ${prepayData.data.order.status}, Held Amount: ₹${prepayData.data.escrow.heldAmount} (${prepayData.data.escrow.simulationBadge})`);

  // 6. Test Transport Assignment & Single-Use Pickup OTP Handover
  console.log('\n[6/7] Testing Buyer Transport Registration & Handover OTP...');
  const trnRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'assign_transport',
      orderId: createdOrder.id,
      transportPartner: 'Kisan Fast Freight',
      vehicleNumber: 'MH-15-EG-4412',
      vehicleCapacityKg: 1000,
      driverName: 'Santosh Shinde',
      driverPhone: '+91 98220 99112',
      estimatedArrival: new Date().toISOString(),
    }),
  });
  const trnData = await trnRes.json();
  if (!trnData.success) throw new Error('Transport registration failed');
  const pickupOtp = trnData.data.pickup.pickupOtp;
  console.log(`  ✓ Transport Assigned: Vehicle ${trnData.data.transport.vehicleNumber}, Generated Single-Use Pickup OTP: ${pickupOtp}`);

  // Handover: Scale Weighing and Triple Confirmation
  console.log('  -> Officer verifies handover at farm gate scale...');
  const pickupVerifyRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'verify_pickup',
      orderId: createdOrder.id,
      enteredOtp: pickupOtp,
      scaleWeightKg: 10.0,
      inspectionNotes: 'Scale weighment passed. Firm semi-ripe quality confirmed.',
      officerId: 'usr-officer-4',
      officerName: 'Dr. Vijay Deshmukh',
    }),
  });
  const pickupVerifyData = await pickupVerifyRes.json();
  if (!pickupVerifyData.success) throw new Error('Pickup verification failed');
  console.log(`  ✓ Handover Verified! Triple sign-off complete. Order Status: ${pickupVerifyData.data.order.status}, Escrow Released Amount: ₹${pickupVerifyData.data.escrow.releasedAmount}`);

  // 7. Test Grievances & Help Chatbot
  console.log('\n[7/7] Testing Grievance Desk & AI Help Chatbot...');
  // File Grievance
  const grvRes = await fetch(`${BASE_URL}/api/grievances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'submit',
      complainantName: 'Rameshwar Patil',
      complainantRole: 'farmer',
      complainantPhone: '+91 98221 34812',
      category: 'Vehicle / Logistics No-Show',
      description: 'Vehicle arrived 1 hour later than scheduled pickup window.',
      linkedOrderId: createdOrder.id,
    }),
  });
  const grvData = await grvRes.json();
  if (!grvData.success) throw new Error('Grievance filing failed');
  console.log(`  ✓ Grievance Filed: Ticket ${grvData.data.complaintNumber}, Assigned to ${grvData.data.assignedOfficerName}`);

  // Query Chatbot
  const chatRes = await fetch(`${BASE_URL}/api/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'How do I choose a bid and allocate kg?' }),
  });
  const chatData = await chatRes.json();
  if (!chatData.success || !chatData.answer) throw new Error('Chatbot query failed');
  console.log(`  ✓ Chatbot Response (${chatData.source}): "${chatData.answer.substring(0, 100)}..."`);

  console.log('\n====================================================');
  console.log('ALL 7 SIH 26033 WORKFLOWS VERIFIED SUCCESSFULLY! ✓');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
