/**
 * Standalone script to delete all calendar events from Firestore
 * 
 * Usage:
 * 1. Make sure your .env file has all Firebase configuration variables
 * 2. Run: npx tsx scripts/deleteCalendarEvents.ts
 * 
 * Or import and use in your code:
 * import { deleteAllCalendarEvents } from '../src/utils/deleteAllCalendarEvents';
 * await deleteAllCalendarEvents("calendarEvents", true);
 */

import { deleteAllCalendarEvents, countCalendarEvents } from "../src/utils/deleteAllCalendarEvents";

const main = async () => {
  console.log("🚀 Starting calendar events deletion script...\n");
  
  // Collection name - adjust if your collection has a different name
  const collectionName = "calendarEvents";
  
  try {
    // First, count the events
    console.log("📊 Counting calendar events...");
    const count = await countCalendarEvents(collectionName);
    console.log(`Found ${count} calendar event(s) in collection "${collectionName}"\n`);
    
    if (count === 0) {
      console.log("✅ No events to delete. Exiting...");
      return;
    }
    
    // Safety confirmation
    console.log("⚠️  WARNING: This will delete ALL calendar events!");
    console.log("⚠️  To proceed, edit this script and set confirmDelete to true\n");
    
    // Set this to true to actually delete
    const confirmDelete = false;
    
    if (!confirmDelete) {
      console.log("❌ Deletion cancelled. Set confirmDelete to true to proceed.");
      return;
    }
    
    // Delete all events
    console.log("🗑️  Deleting all calendar events...");
    const result = await deleteAllCalendarEvents(collectionName, confirmDelete);
    
    if (result.success) {
      console.log(`\n✅ Success! Deleted ${result.deletedCount} calendar event(s)`);
    } else {
      console.log(`\n❌ Error: ${result.error}`);
    }
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
};

// Run the script
main();

