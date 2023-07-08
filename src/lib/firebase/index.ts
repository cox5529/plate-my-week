import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	type DocumentData,
	QueryDocumentSnapshot,
	type FirestoreDataConverter
} from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyB2MP1jtHfESqJ91GTPACQWZQeHAK4n2CQ',
	authDomain: 'plate-my-week.firebaseapp.com',
	projectId: 'plate-my-week',
	storageBucket: 'plate-my-week.appspot.com',
	messagingSenderId: '362723165725',
	appId: '1:362723165725:web:c7456a04400aa22fe7a8f4',
	measurementId: 'G-N9M7BLKMSB'
};

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

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
