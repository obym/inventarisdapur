import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS } from './firebase';
import { InventoryItem, Kitchen } from '../types';
import { INITIAL_KITCHENS, INITIAL_ITEMS } from '../data/initialData';

const KITCHENS_COLLECTION = FIRESTORE_COLLECTIONS.KITCHENS;
const ITEMS_COLLECTION = FIRESTORE_COLLECTIONS.ITEMS;

/**
 * Initialize / Seed default data in Firestore if the collections are empty.
 */
export async function seedInitialFirestoreData(): Promise<void> {
  try {
    const kitchensSnap = await getDocs(collection(db, KITCHENS_COLLECTION));
    if (kitchensSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_KITCHENS.forEach((k) => {
        const ref = doc(db, KITCHENS_COLLECTION, k.id);
        batch.set(ref, k);
      });
      await batch.commit();
    }

    const itemsSnap = await getDocs(collection(db, ITEMS_COLLECTION));
    if (itemsSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_ITEMS.forEach((it) => {
        const ref = doc(db, ITEMS_COLLECTION, it.id);
        batch.set(ref, it);
      });
      await batch.commit();
    }
  } catch (error) {
    console.error('Firestore seeding notice:', error);
  }
}

/**
 * Subscribe to realtime updates for Kitchens
 */
export function subscribeToKitchens(
  onUpdate: (kitchens: Kitchen[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, KITCHENS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const data: Kitchen[] = [];
      snapshot.forEach((d) => {
        data.push({ ...(d.data() as Kitchen), id: d.id });
      });
      onUpdate(data);
    },
    (err) => {
      console.error('Kitchens snapshot error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Subscribe to realtime updates for Inventory Items
 */
export function subscribeToItems(
  onUpdate: (items: InventoryItem[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, ITEMS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const data: InventoryItem[] = [];
      snapshot.forEach((d) => {
        data.push({ ...(d.data() as InventoryItem), id: d.id });
      });
      onUpdate(data);
    },
    (err) => {
      console.error('Items snapshot error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save / Update an inventory item in Firestore
 */
export async function saveItemToFirestore(
  item: InventoryItem
): Promise<void> {
  const docRef = doc(db, ITEMS_COLLECTION, item.id);
  await setDoc(docRef, item, { merge: true });
}

/**
 * Delete an inventory item from Firestore
 */
export async function deleteItemFromFirestore(itemId: string): Promise<void> {
  const docRef = doc(db, ITEMS_COLLECTION, itemId);
  await deleteDoc(docRef);
}

/**
 * Save / Update a kitchen in Firestore
 */
export async function saveKitchenToFirestore(kitchen: Kitchen): Promise<void> {
  const docRef = doc(db, KITCHENS_COLLECTION, kitchen.id);
  await setDoc(docRef, kitchen, { merge: true });
}

/**
 * Delete a kitchen from Firestore
 */
export async function deleteKitchenFromFirestore(kitchenId: string): Promise<void> {
  const docRef = doc(db, KITCHENS_COLLECTION, kitchenId);
  await deleteDoc(docRef);
}

/**
 * Reset all data to initial factory demo in Firestore
 */
export async function resetAllFirestoreData(): Promise<void> {
  const [kitchensSnap, itemsSnap] = await Promise.all([
    getDocs(collection(db, KITCHENS_COLLECTION)),
    getDocs(collection(db, ITEMS_COLLECTION)),
  ]);

  const batch = writeBatch(db);
  kitchensSnap.forEach((d) => batch.delete(d.ref));
  itemsSnap.forEach((d) => batch.delete(d.ref));

  INITIAL_KITCHENS.forEach((k) => {
    batch.set(doc(db, KITCHENS_COLLECTION, k.id), k);
  });
  INITIAL_ITEMS.forEach((it) => {
    batch.set(doc(db, ITEMS_COLLECTION, it.id), it);
  });

  await batch.commit();
}
