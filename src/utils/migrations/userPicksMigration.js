import { getFirestore } from 'firebase-admin/firestore';

export const migrateUserData = (userData) => {
  if (!userData.picks) return userData;

  const newStructure = {
    seasons: {
      2024: {
        regular_season: {},
        playoffs: {
          wildcard: {},
          divisional: {},
          conference: {},
        },
        superBowl: userData.picks?.superBowl || {}
      }
    }
  };

  Object.entries(userData.picks).forEach(([weekNum, picks]) => {
    if (weekNum === 'superBowl') return;
    
    const weekNumber = parseInt(weekNum);
    if (weekNumber <= 18) {
      newStructure.seasons[2024].regular_season[weekNumber] = picks;
    } else if (weekNumber <= 21) {
      const round = weekNumber === 19 ? 'wildcard' : 
                   weekNumber === 20 ? 'divisional' : 'conference';
      newStructure.seasons[2024].playoffs[round] = picks;
    }
  });

  return {
    ...userData,
    ...newStructure,
    picks: null
  };
};

export const runMigration = async (db) => {
    console.log('Starting user picks migration...');
    
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.get();
    
    const batch = db.batch();
    let count = 0;
  
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.picks) {
        const migratedData = migrateUserData(userData);
        batch.update(doc.ref, migratedData);
        count++;
      }
    });
  
    await batch.commit();
    console.log(`Migration complete. Updated ${count} users`);
    return count;
  };