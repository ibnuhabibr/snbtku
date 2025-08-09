import { db } from '../src/db/index';
import { 
  users, 
  userProgress, 
  tryoutSessions, 
  userAnswers, 
  questionStats 
} from '../src/db/schema/index';
import { eq, sql } from 'drizzle-orm';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for proper path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend directory
config({ path: join(__dirname, '../.env') });

/**
 * Reset all user data to initial state
 * This script will:
 * 1. Reset user gamification stats (XP, coins, level, streaks)
 * 2. Clear all user progress data
 * 3. Remove all tryout sessions and answers
 * 4. Reset question statistics
 * 
 * WARNING: This will permanently delete all user progress data!
 */
export async function resetAllUserData(): Promise<void> {
  console.log('🚀 Starting user data reset process...');
  
  try {
    await db.transaction(async (tx) => {
      console.log('📊 Resetting user statistics and gamification data...');
      
      // Reset user gamification stats to initial values
      // Note: Current schema doesn't have XP/coins fields, but preparing for future implementation
      await tx.update(users).set({
        // Reset account status fields that exist
        email_verified: false,
        phone_verified: false,
        is_active: true,
        is_premium: false,
        premium_expires_at: null,
        
        // Reset profile information
        avatar_url: null,
        date_of_birth: null,
        school_name: null,
        grade_level: null,
        target_university: null,
        target_major: null,
        
        // Update timestamps
        updated_at: new Date()
      });
      
      console.log('🗑️  Clearing user progress data...');
      
      // Clear all user progress records
      // This removes all performance tracking, ability estimates, and analytics
      await tx.delete(userProgress);
      
      console.log('📝 Removing tryout sessions and user answers...');
      
      // Clear all user answers first (due to foreign key constraints)
      // This removes all question responses and timing data
      await tx.delete(userAnswers);
      
      // Clear all tryout sessions
      // This removes all session data, progress, and results
      await tx.delete(tryoutSessions);
      
      console.log('📈 Resetting question statistics...');
      
      // Reset question statistics to initial state
      // This clears usage data, success rates, and IRT parameters
      await tx.update(questionStats).set({
        total_attempts: 0,
        correct_attempts: 0,
        incorrect_attempts: 0,
        skipped_attempts: 0,
        success_rate: '0',
        average_time_seconds: '0',
        median_time_seconds: '0',
        fastest_time_seconds: null,
        slowest_time_seconds: null,
        time_percentiles: {
          p25: 0,
          p50: 0,
          p75: 0,
          p90: 0,
          p95: 0
        },
        current_difficulty: '0',
        discrimination: '1',
        guessing_parameter: '0.25',
        updated_at: new Date()
      });
      
      console.log('✅ All user data reset successfully!');
      console.log('📋 Reset Summary:');
      console.log('   - User profiles reset to default state');
      console.log('   - All progress data cleared');
      console.log('   - All tryout sessions removed');
      console.log('   - All user answers deleted');
      console.log('   - Question statistics reset');
    });
    
  } catch (error) {
    console.error('❌ Error during data reset:', error);
    throw error;
  }
}

/**
 * Create a backup of current user data before reset
 * This function exports current data to JSON files for recovery
 */
export async function createDataBackup(): Promise<void> {
  console.log('💾 Creating data backup...');
  
  try {
    // Get current timestamp for backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `./backups/user-data-${timestamp}`;
    
    // Create backup directory
    const fs = await import('fs/promises');
    const path = await import('path');
    
    await fs.mkdir(backupDir, { recursive: true });
    
    // Backup users data
    const usersData = await db.select().from(users);
    await fs.writeFile(
      path.join(backupDir, 'users.json'),
      JSON.stringify(usersData, null, 2)
    );
    
    // Backup user progress
    const progressData = await db.select().from(userProgress);
    await fs.writeFile(
      path.join(backupDir, 'user-progress.json'),
      JSON.stringify(progressData, null, 2)
    );
    
    // Backup tryout sessions
    const sessionsData = await db.select().from(tryoutSessions);
    await fs.writeFile(
      path.join(backupDir, 'tryout-sessions.json'),
      JSON.stringify(sessionsData, null, 2)
    );
    
    // Backup user answers
    const answersData = await db.select().from(userAnswers);
    await fs.writeFile(
      path.join(backupDir, 'user-answers.json'),
      JSON.stringify(answersData, null, 2)
    );
    
    console.log(`✅ Backup created successfully at: ${backupDir}`);
    
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    throw error;
  }
}

/**
 * Main execution function with safety prompts
 */
async function main(): Promise<void> {
  // Safety check for production environment
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  WARNING: You are about to reset data in PRODUCTION environment!');
    console.log('This action cannot be undone!');
    
    // In production, require explicit confirmation
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise<string>((resolve) => {
      rl.question('Type "CONFIRM_RESET" to proceed: ', resolve);
    });
    
    rl.close();
    
    if (answer !== 'CONFIRM_RESET') {
      console.log('❌ Reset cancelled.');
      process.exit(0);
    }
  }
  
  try {
    // Create backup before reset
    await createDataBackup();
    
    // Perform the reset
    await resetAllUserData();
    
    console.log('🎉 User data reset completed successfully!');
    console.log('💡 Tip: Restart your application to see the changes.');
    
  } catch (error) {
    console.error('💥 Reset failed:', error);
    process.exit(1);
  }
}

// Execute the main function
main().catch((error) => {
  console.error('Script execution failed:', error);
  process.exit(1);
});