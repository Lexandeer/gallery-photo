import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "gallery-photo-64a97", appId: "1:1012892453987:web:de2e424e9e9b97789bfc56", storageBucket: "gallery-photo-64a97.firebasestorage.app", apiKey: "AIzaSyBEjFBpWDQqcP2TfIbp5NnvJ5t9wqq755A", authDomain: "gallery-photo-64a97.firebaseapp.com", messagingSenderId: "1012892453987"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
