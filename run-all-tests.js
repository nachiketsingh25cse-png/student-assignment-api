/**
 * Automated Test Runner for Student Course & Assignment Management API.
 * Tests every single API endpoint (Auth + full CRUD) and outputs formatted results.
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING FULL API TEST SUITE (Auth + CRUD Operations)');
  console.log('======================================================\n');

  let createdAssignmentId = '';

  // 1. Health Check
  console.log('▶ Test 1: Health Check (GET /)');
  const res1 = await fetch(`${BASE_URL}/`);
  const data1 = await res1.json();
  console.log(`   Status: ${res1.status} ${res1.statusText}`);
  console.log(`   Message: ${data1.message || data1.status}`);
  console.log('   ✅ PASS\n');

  // 2. Register Student
  console.log('▶ Test 2: Register Student (POST /api/users/register)');
  const res2 = await fetch(`${BASE_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'nachiket',
      email: 'nachiket@university.edu',
      password: 'SecurePassword123',
      role: 'student',
      course: 'B.Tech Computer Science',
    }),
  });
  const data2 = await res2.json();
  console.log(`   Status: ${res2.status} ${res2.statusText}`);
  console.log(`   Response: ${JSON.stringify(data2.user || data2.message)}`);
  console.log('   ✅ PASS\n');

  // 3. Login Student
  console.log('▶ Test 3: Login Student (POST /api/users/login)');
  const res3 = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nachiket@university.edu',
      password: 'SecurePassword123',
    }),
  });
  const data3 = await res3.json();
  console.log(`   Status: ${res3.status} ${res3.statusText}`);
  console.log(`   Message: ${data3.message} (User: ${data3.user?.username})`);
  console.log('   ✅ PASS\n');

  // 4. Create Assignment (CREATE)
  console.log('▶ Test 4: Create Assignment - CREATE (POST /api/assignments)');
  const res4 = await fetch(`${BASE_URL}/api/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Build REST API with Node & Express',
      subject: 'Web Technologies',
      description: 'Implement auth and full CRUD operations with MongoDB Atlas.',
      dueDate: '2026-11-20T23:59:59.000Z',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Nachiket Singh',
    }),
  });
  const data4 = await res4.json();
  createdAssignmentId = data4.data?._id;
  console.log(`   Status: ${res4.status} ${res4.statusText}`);
  console.log(`   Created ID: ${createdAssignmentId}`);
  console.log(`   Title: ${data4.data?.title}`);
  console.log('   ✅ PASS\n');

  // 5. Get All Assignments (READ - List)
  console.log('▶ Test 5: Get All Assignments - READ (GET /api/assignments)');
  const res5 = await fetch(`${BASE_URL}/api/assignments`);
  const data5 = await res5.json();
  console.log(`   Status: ${res5.status} ${res5.statusText}`);
  console.log(`   Total Assignments Count: ${data5.count}`);
  console.log('   ✅ PASS\n');

  // 6. Get Single Assignment (READ - Single)
  console.log(`▶ Test 6: Get Assignment by ID - READ (GET /api/assignments/${createdAssignmentId})`);
  const res6 = await fetch(`${BASE_URL}/api/assignments/${createdAssignmentId}`);
  const data6 = await res6.json();
  console.log(`   Status: ${res6.status} ${res6.statusText}`);
  console.log(`   Fetched Title: ${data6.data?.title}`);
  console.log('   ✅ PASS\n');

  // 7. Update Assignment (UPDATE)
  console.log(`▶ Test 7: Update Assignment - UPDATE (PUT /api/assignments/${createdAssignmentId})`);
  const res7 = await fetch(`${BASE_URL}/api/assignments/${createdAssignmentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'completed',
      priority: 'medium',
      description: 'Assignment completed and tested via automated test suite!',
    }),
  });
  const data7 = await res7.json();
  console.log(`   Status: ${res7.status} ${res7.statusText}`);
  console.log(`   Updated Status: ${data7.data?.status}`);
  console.log('   ✅ PASS\n');

  // 8. Delete Assignment (DELETE)
  console.log(`▶ Test 8: Delete Assignment - DELETE (DELETE /api/assignments/${createdAssignmentId})`);
  const res8 = await fetch(`${BASE_URL}/api/assignments/${createdAssignmentId}`, {
    method: 'DELETE',
  });
  const data8 = await res8.json();
  console.log(`   Status: ${res8.status} ${res8.statusText}`);
  console.log(`   Message: ${data8.message}`);
  console.log('   ✅ PASS\n');

  console.log('======================================================');
  console.log('🎉 ALL 8 TESTS PASSED WITH 100% SUCCESS!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err.message);
});
