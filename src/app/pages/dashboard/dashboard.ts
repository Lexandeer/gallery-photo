import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  photoForm: FormGroup;
  selectedFile: any;

  constructor(private fb: FormBuilder) {
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

  // Soumission du formulaire (Pour l'instant on ne fait que loguer les valeurs)
  onSubmit():void {
    console.log(this.photoForm.value)
  }

}
