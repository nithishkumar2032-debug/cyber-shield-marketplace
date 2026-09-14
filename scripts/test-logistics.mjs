// End-to-End API Test for Dynamic Logistics & Freight Engine
// Prepared by Cyber Shield | SIH 26033

const BASE_URL = 'http://localhost:3000';

console.log('====================================================');
console.log('CYBER SHIELD DYNAMIC LOGISTICS & FREIGHT API TEST');
console.log('====================================================\n');

async function runTests() {
  try {
    // 1. Test GET /api/logistics
    console.log('[1/4] Testing GET /api/logistics catalogue...');
    const getRes = await fetch(`${BASE_URL}/api/logistics?origin=Thanjavur&destination=Chennai&weight=2500`);
    const getData = await getRes.json();

    if (!getData.success || !Array.isArray(getData.vehicles) || getData.vehicles.length !== 6) {
      throw new Error(`GET /api/logistics failed or returned invalid vehicles: ${JSON.stringify(getData)}`);
    }
    console.log(`  * Vehicles returned: ${getData.vehicles.length} vehicle categories`);
    console.log(`  * Verified partners returned: ${getData.partners.length} partners`);
    console.log(`  * Estimated Distance: ${getData.estimatedDistanceKm} km (Thanjavur -> Chennai)`);
    console.log('  ✓ GET /api/logistics passed.\n');

    // 2. Test POST /api/logistics for Small Payload (500 kg, local taluka/inter-district)
    console.log('[2/4] Testing POST /api/logistics for Small Lot (500 kg, 185 km)...');
    const smallRes = await fetch(`${BASE_URL}/api/logistics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payloadKg: 500,
        distanceKm: 185,
        origin: 'Thanjavur',
        destination: 'Madurai',
      }),
    });
    const smallData = await smallRes.json();
    if (!smallData.success || !smallData.data.estimates.length) {
      throw new Error(`Small payload calculation failed: ${JSON.stringify(smallData)}`);
    }
    const topSmall = smallData.data.estimates[0];
    console.log(`  * Recommended Vehicle: ${topSmall.vehicle.name}`);
    console.log(`  * Total Freight: ₹${topSmall.totalFreightInr.toLocaleString('en-IN')}`);
    console.log(`  * Unit Freight: ₹${topSmall.freightPerKgInr}/kg`);
    console.log(`  * Transit Time: ~${topSmall.estimatedTransitHours} hours`);
    console.log('  ✓ Small lot calculation passed.\n');

    // 3. Test POST /api/logistics for Bulk Heavy Payload (15,000 kg, long haul)
    console.log('[3/4] Testing POST /api/logistics for Bulk Cargo (15,000 kg, 910 km)...');
    const bulkRes = await fetch(`${BASE_URL}/api/logistics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payloadKg: 15000,
        distanceKm: 910,
        origin: 'Thanjavur',
        destination: 'Hyderabad',
      }),
    });
    const bulkData = await bulkRes.json();
    if (!bulkData.success || !bulkData.data.estimates.length) {
      throw new Error(`Bulk payload calculation failed: ${JSON.stringify(bulkData)}`);
    }
    const topBulk = bulkData.data.estimates[0];
    console.log(`  * Recommended Vehicle: ${topBulk.vehicle.name} (Rated ${topBulk.vehicle.maxPayloadKg} kg)`);
    console.log(`  * Total Freight: ₹${topBulk.totalFreightInr.toLocaleString('en-IN')}`);
    console.log(`  * Unit Freight: ₹${topBulk.freightPerKgInr}/kg`);
    console.log(`  * Suggested Partners: ${topBulk.suggestedPartners.map((p) => p.name).join(', ')}`);

    if (topBulk.vehicle.maxPayloadKg < 15000) {
      throw new Error('Vehicle cannot hold 15,000 kg!');
    }
    console.log('  ✓ Bulk payload capacity calculation passed.\n');

    // 4. Test POST /api/logistics for Perishables (Cold-Chain Reefer)
    console.log('[4/4] Testing POST /api/logistics for Perishable Cargo (Reefer)...');
    const reeferRes = await fetch(`${BASE_URL}/api/logistics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payloadKg: 4500,
        distanceKm: 340,
        origin: 'Thanjavur',
        destination: 'Chennai',
        isPerishable: true,
      }),
    });
    const reeferData = await reeferRes.json();
    const hasReefer = reeferData.data.estimates.some((e) => e.vehicle.category === 'Cold-Chain Reefer');
    console.log(`  * Cold-Chain Reefer Included: ${hasReefer}`);
    if (!hasReefer) {
      throw new Error('Perishable query did not return Cold-Chain Reefer option!');
    }
    console.log('  ✓ Perishable cold-chain routing passed.\n');

    console.log('====================================================');
    console.log('ALL DYNAMIC LOGISTICS API TESTS PASSED! ✓');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runTests();
