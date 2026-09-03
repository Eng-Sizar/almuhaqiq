import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PlayerProfile, LeaderboardPlayer } from '../types';
import { calculatePlayerXp, getCurrentRank } from '../data/ranks';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use custom firestoreDatabaseId if configured in firebase-applet-config.json
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Sync player to Firestore Leaderboard
export async function syncPlayerToFirestoreLeaderboard(profile: PlayerProfile): Promise<void> {
  try {
    const xp = calculatePlayerXp(profile.stats);
    const rank = getCurrentRank(xp);
    const casesSolved = Object.values(profile.caseRecords || {}).filter(c => c.completed || c.solvedCorrectly).length;
    
    const entry: LeaderboardPlayer = {
      id: profile.id,
      username: profile.username || 'محقق مجهول',
      avatar: profile.avatar || '🕵️‍♂️',
      equippedTitle: profile.equippedTitle || 'مفتش مستجد',
      rankTitle: rank.name,
      rankIcon: rank.iconName,
      xp,
      coins: profile.coins || 0,
      casesSolved,
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'leaderboard', profile.id), entry, { merge: true });
  } catch (err) {
    console.error('Failed to sync leaderboard to Firestore:', err);
  }
}

// Fetch top players from Firestore leaderboard
export async function fetchFirestoreLeaderboard(): Promise<LeaderboardPlayer[]> {
  try {
    const leadCol = collection(db, 'leaderboard');
    const q = query(leadCol, orderBy('xp', 'desc'), limit(25));
    const snap = await getDocs(q);
    const players: LeaderboardPlayer[] = [];
    snap.forEach((docSnap) => {
      players.push(docSnap.data() as LeaderboardPlayer);
    });
    return players;
  } catch (err) {
    console.error('Failed to fetch Firestore leaderboard:', err);
    return [];
  }
}
