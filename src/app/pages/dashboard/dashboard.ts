import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Photo } from '../../models/photo.model';
import { GalleryService } from '../../services/gallery';
import { Observable } from 'rxjs';
import { AsyncPipe } from "@angular/common"

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  photoForm: FormGroup;
  selectedFile: any;
  isEditing: boolean = false
  photoData!: Observable<Photo[]>;

  ngOnInit(): void {
    this.getData()
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private galleryService: GalleryService
  ) {
    // Initialisation du formulaire réactif avec des contrôles et des validateurs
    this.photoForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(7)]],
      description: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(300)]],
      imageUrl: [''],
      likes: [0]
    });
  }

  // Vérifie si un champ a une erreur spécifique
  hasError(fieldName: string, errorName: string): boolean {
    const fieldErrors = this.photoForm.get(fieldName)?.errors;
    return fieldErrors ? fieldErrors[errorName] : false;
  }

  // Retourne un message d'erreur approprié pour un champ de formulaire donné
  showErrorMessage(fieldName: string): string {
    const fieldControl = this.photoForm.get(fieldName);
    if(fieldControl?.invalid && fieldControl?.touched) {
      if (this.hasError(fieldName, 'required')){
        return 'Ce champs est requis.';
      }
      else if (this.hasError(fieldName, 'minLength')){
        return 'Doit contenir au moins 7 caractères.';
      }
      else if (this.hasError(fieldName, 'maxLength')) {
        return 'Doit contenir moins de 300 caractères.';
      }
    }
    return '';
  }

  // Gère la sélection d'un fichier image par l'utilisateur
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }


  // onSubmit():void {
  //  console.log(this.photoForm.value)
  // }

  saveData() {
    if (this.photoForm.valid) {
      const formData: Photo = this.photoForm.value;
      if (this.selectedFile) {
        // S'il y a une image selectionnée, on la stocke d'abord sur Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + this.selectedFile.name);
        uploadBytes(storageRef, this.selectedFile).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            formData.imageUrl = downloadURL;
            this.galleryService.savePhoto(formData).then(() => {
              this.resetForm();
            });
          });
        });
      } else {
        // Si aucune image n'a été selectionnée, on enregistre juste les données (imageUrl éventuellement vide)
        this.galleryService.savePhoto(formData).then( () => {
          this.resetForm();
        });
      }
    } else {
      console.log('All field are required');
    }
  }

  // Récupérer la liste des photos pour affichage
  getData() {
    this.photoData = this.galleryService.getPhotos();
  }

  // Remplir le formulaire avec les données d'une photo existante (pour édition)
  editData(data: Photo) {
    this.isEditing = true;
    this.photoForm.patchValue(data)
  }

  //Supprimer une photo
  deleteData(id: string) {
    if (confirm('Etes vous sûr de vouloir supprimer cet élément ?')) {
      this.galleryService.deletePhoto(id).catch(error => {
        console.error("error deleting photo:", error);
        alert('Une erreur s est produit lors de la suppression de la photo');
      })
    }
  }

  //Réinitialiser le formulaire après enregistrement ou annulation
  resetForm() {
    this.photoForm.reset({ likes: 0, imageUrl: '', description: '', title: '' });
    this.selectedFile = null
    this.isEditing = false
  }

  // Naviguer vers la page de détails pour une photo donnée
  navigateToDetails(id: string) {
    this.router.navigate(['/details', id])
  }
}
