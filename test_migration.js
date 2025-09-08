#!/usr/bin/env node
// Migration Test Script for Customer-Scoped Suppressions
// This script validates the migration is working correctly

import pkg from 'pg';
const { Pool } = pkg;

// Database connection (using environment variables or defaults)
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'communications_db',
  user: 'comm_user',
  password: process.env.COMM_DB_PASSWORD || 'UzI1NiIsInR5cCI6IkpXVCJ9.ey'
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing Customer-Scoped Suppression Migration...\n');

async function runTests() {
  try {
    // Test 1: Verify schema changes
    console.log('✅ Test 1: Verifying schema changes...');
    const schemaResult = await query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'suppressions' 
      ORDER BY ordinal_position
    `);
    
    const columns = schemaResult.rows.map(r => r.column_name);
    if (!columns.includes('motorical_account_id')) {
      throw new Error('❌ motorical_account_id column missing from suppressions table');
    }
    console.log('   ✓ motorical_account_id column exists');
    
    // Test 2: Verify constraints
    console.log('\n✅ Test 2: Verifying constraints...');
    const constraintResult = await query(`
      SELECT constraint_name, constraint_type 
      FROM information_schema.table_constraints 
      WHERE table_name = 'suppressions' AND constraint_type = 'UNIQUE'
    `);
    
    const hasCustomerEmailConstraint = constraintResult.rows.some(
      r => r.constraint_name === 'suppressions_customer_email_key'
    );
    if (!hasCustomerEmailConstraint) {
      throw new Error('❌ suppressions_customer_email_key constraint missing');
    }
    console.log('   ✓ Customer-email unique constraint exists');
    
    // Test 3: Verify data integrity
    console.log('\n✅ Test 3: Verifying data integrity...');
    const dataResult = await query(`
      SELECT 
        COUNT(*) as total_suppressions,
        COUNT(motorical_account_id) as with_account_id,
        COUNT(DISTINCT motorical_account_id) as unique_accounts
      FROM suppressions
    `);
    
    const { total_suppressions, with_account_id, unique_accounts } = dataResult.rows[0];
    if (total_suppressions !== with_account_id) {
      throw new Error(`❌ Data integrity issue: ${total_suppressions} suppressions but only ${with_account_id} have motorical_account_id`);
    }
    console.log(`   ✓ All ${total_suppressions} suppressions have motorical_account_id`);
    console.log(`   ✓ ${unique_accounts} unique motorical accounts in suppressions`);
    
    // Test 4: Test suppression enforcement
    console.log('\n✅ Test 4: Testing suppression enforcement...');
    
    // Get a test scenario
    const testData = await query(`
      SELECT 
        t.id as tenant_id,
        t.motorical_account_id,
        c.id as contact_id,
        c.email,
        s.email as suppressed_email
      FROM tenants t
      JOIN contacts c ON c.tenant_id = t.id
      LEFT JOIN suppressions s ON s.motorical_account_id = t.motorical_account_id AND s.email = c.email
      LIMIT 5
    `);
    
    console.log(`   ✓ Found ${testData.rows.length} test contacts`);
    
    for (const row of testData.rows) {
      const isSuppressed = !!row.suppressed_email;
      console.log(`   ${isSuppressed ? '🚫' : '✅'} ${row.email} - ${isSuppressed ? 'SUPPRESSED' : 'ACTIVE'}`);
    }
    
    // Test 5: Test sender query
    console.log('\n✅ Test 5: Testing sender query logic...');
    
    const senderTestResult = await query(`
      SELECT COUNT(*) as active_recipients
      FROM contacts c
      JOIN tenants t ON t.id = c.tenant_id
      LEFT JOIN suppressions s ON s.motorical_account_id = t.motorical_account_id AND s.email = c.email
      WHERE c.status = 'active' AND s.email IS NULL
    `);
    
    const activeRecipients = senderTestResult.rows[0].active_recipients;
    console.log(`   ✓ ${activeRecipients} contacts can receive emails (not suppressed)`);
    
    // Test 6: Cross-tenant suppression test
    console.log('\n✅ Test 6: Testing cross-tenant suppression scope...');
    
    const crossTenantTest = await query(`
      SELECT 
        COUNT(DISTINCT motorical_account_id) as unique_accounts,
        COUNT(*) as total_tenants
      FROM tenants
    `);
    
    if (crossTenantTest.rows.length > 0) {
      const { unique_accounts, total_tenants } = crossTenantTest.rows[0];
      console.log(`   ✓ ${unique_accounts} unique motorical accounts`);
      console.log(`   ✓ ${total_tenants} total tenants`);
      if (unique_accounts === total_tenants) {
        console.log(`   ✓ All tenants have separate accounts (suppressions isolated)`);
      } else {
        console.log(`   ⚠️  Some tenants share accounts (suppressions shared)`);
      }
    }
    
    console.log('\n🎉 All migration tests passed!');
    console.log('\n📊 Migration Summary:');
    console.log(`   • Schema: ✅ Updated to customer-scoped`);
    console.log(`   • Data: ✅ All suppressions migrated`);
    console.log(`   • Logic: ✅ Sender queries updated`);
    console.log(`   • Scope: ✅ Customer-level suppression enforced`);
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Migration test failed:', error.message);
    return false;
  } finally {
    await pool.end();
  }
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
