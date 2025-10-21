import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'
import { Firestore, collection, collectionData }  from '@angular/fire/firestore'
import { Observable, map } from 'rxjs'
import { Photo } from '../../models/photo.model'
import { GalleryService } from '../../services/gallery'
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-gallery',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery implements OnInit {
  photoData!: Observable<Photo[]>;
  selectedImage: Photo | null = null;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private galleryService: GalleryService
  ) {}

  ngOnInit() {
    this.getData()
  }

   getData() {
      const collectionInstance = collection(this.firestore, 'photos');
      this.photoData = collectionData(collectionInstance, {idField: 'id'}).pipe(
        map(dataArray =>
          dataArray.map(data => ({
            id: data['id'],
            title: data['title'],
            description: data['description'],
            imageUrl: data['imageUrl'],
            likes: data['likes']
          }) as Photo )
        )
      );
   }

  onLikes(photo: Photo) {
    this.galleryService.likePhoto(photo)
  }

  navigateToDetails(id: string) {
    this.router.navigate(['/details', id]);
  }
}
