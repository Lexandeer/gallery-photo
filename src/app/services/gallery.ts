import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc, updateDoc, increment } from '@angular/fire/firestore'
import { Photo } from '../models/photo.model'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  constructor(private firestore: Firestore) {}

  // Sauvegarder ou mettre à jour une photo dans FireStore
  async savePhoto(photo: Photo): Promise<void> {
    const photosCollection = collection(this.firestore, 'photos');
    if (photo.id) {
      // Si l'objet a déjà un id, on fait un merge(mise à jour)
      const photoRef = doc(photosCollection, photo.id);
      return await setDoc(photoRef, photo, {merge: true});
    } else {
      // Sinon, on créer un nouveau document avec un id auto-généré
      return await setDoc(doc(photosCollection), photo);
    }
  }

  // Récupèrer toutes les photos depuis Firestore (en temps réel)
  getPhotos(): Observable<Photo[]> {
    const photosCollection = collection(this.firestore, 'photos');
    return collectionData(photosCollection, { idField: 'id' }) as Observable<Photo[]>;
  }

  // Supprimer une photo par son identifiant
  async deletePhoto(photoId: string): Promise<void> {
    const photoRef = doc(this.firestore, 'photos', photoId);
    return await deleteDoc(photoRef);
  }

  // Aimer une photo (incrémenter son compteur de like )
  async likePhoto(photo: Photo): Promise<void> {
    if ( photo.id ) {
      const photoRef = doc(this.firestore, 'photos', photo.id);
      return await updateDoc(photoRef, { likes: increment(1)
      });
    } else {
      console.error('impossible de liker une photo sans ID')
      return Promise.reject('Missing photo ID')
    }
  }
}
