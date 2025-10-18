import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore'
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
}
