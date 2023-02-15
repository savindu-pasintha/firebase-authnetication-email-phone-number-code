import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCGYv1EyYw5xuYFqd_4E_HwRAEKQm0rwKI',
  authDomain: 'phone-number-otp-8d928.firebaseapp.com',
  projectId: 'phone-number-otp-8d928',
  storageBucket: 'phone-number-otp-8d928.appspot.com',
  messagingSenderId: '879340456868',
  appId: '1:879340456868:web:23eb94834c00c5f91c0f31',
  measurementId: 'G-J3JD718HR9',
} //this is where your firebase app values you copied will go

firebase.initializeApp(firebaseConfig)
export const auth = firebase.auth()
