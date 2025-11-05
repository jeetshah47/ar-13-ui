import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase.js";

/**
 * Deletes all calendar events from Firestore
 * 
 * @param {string} collectionName - The name of the Firestore collection (default: "calendarEvents")
 * @param {boolean} confirmDelete - Safety flag, set to true to actually delete (default: false)
 * @returns {Promise<{ deletedCount: number, success: boolean, error?: string }>}
 */
export const deleteAllCalendarEvents = async (
  collectionName = "calendarEvents",
  confirmDelete = false
) => {
  try {
    if (!confirmDelete) {
      console.warn("⚠️  Safety check: confirmDelete is false. Set to true to actually delete events.");
      return {
        deletedCount: 0,
        success: false,
        error: "Safety check: confirmDelete must be set to true",
      };
    }

    console.log(`🔍 Fetching all documents from collection: ${collectionName}...`);
    
    // Get reference to the collection
    const eventsRef = collection(db, collectionName);
    
    // Get all documents
    const querySnapshot = await getDocs(eventsRef);
    
    if (querySnapshot.empty) {
      console.log("✅ No calendar events found in the collection.");
      return {
        deletedCount: 0,
        success: true,
      };
    }

    console.log(`📊 Found ${querySnapshot.size} calendar event(s) to delete.`);
    
    // Delete in batches (Firestore batch limit is 500 operations)
    const batchSize = 500;
    const docs = querySnapshot.docs;
    let deletedCount = 0;
    
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchDocs = docs.slice(i, i + batchSize);
      
      batchDocs.forEach((document) => {
        const docRef = doc(db, collectionName, document.id);
        batch.delete(docRef);
      });
      
      await batch.commit();
      deletedCount += batchDocs.length;
      console.log(`✅ Deleted batch: ${deletedCount}/${docs.length} events`);
    }
    
    console.log(`🎉 Successfully deleted ${deletedCount} calendar event(s) from collection "${collectionName}"`);
    
    return {
      deletedCount,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("❌ Error deleting calendar events:", errorMessage);
    return {
      deletedCount: 0,
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Counts the number of calendar events in the collection without deleting
 * 
 * @param {string} collectionName - The name of the Firestore collection (default: "calendarEvents")
 * @returns {Promise<number>}
 */
export const countCalendarEvents = async (
  collectionName = "calendarEvents"
) => {
  try {
    const eventsRef = collection(db, collectionName);
    const querySnapshot = await getDocs(eventsRef);
    return querySnapshot.size;
  } catch (error) {
    console.error("❌ Error counting calendar events:", error);
    return 0;
  }
};

// Example usage:
// To actually delete events, uncomment and run:
/*
(async () => {
  // First, count the events
  const count = await countCalendarEvents();
  console.log(`Found ${count} calendar events`);
  
  // Then delete them (set confirmDelete to true)
  const result = await deleteAllCalendarEvents("calendarEvents", true);
  console.log(result);
})();
*/

