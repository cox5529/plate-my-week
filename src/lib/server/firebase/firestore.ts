import type {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot
} from 'firebase-admin/firestore';

export function assignTypes<T extends object>(): FirestoreDataConverter<T> {
	return {
		toFirestore(doc: T): DocumentData {
			return doc;
		},
		fromFirestore(snapshot: QueryDocumentSnapshot): T {
			return snapshot.data()! as T;
		}
	};
}
