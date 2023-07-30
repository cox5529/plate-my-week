import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyB2MP1jtHfESqJ91GTPACQWZQeHAK4n2CQ',
	authDomain: 'plate-my-week.firebaseapp.com',
	projectId: 'plate-my-week',
	storageBucket: 'plate-my-week.appspot.com',
	messagingSenderId: '362723165725',
	appId: '1:362723165725:web:c7456a04400aa22fe7a8f4',
	measurementId: 'G-N9M7BLKMSB'
};

export const app = initializeApp(firebaseConfig);
