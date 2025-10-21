import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Firestore, doc, getDoc } from '@angular/fire/firestore'

@Component({
  selector: 'app-details',
  imports: [RouterModule],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details implements OnInit {
 data: any; // Contiendra les informations de la photo à afficher

  constructor(
    private route: ActivatedRoute,
    private fireStore: Firestore
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null ) {
      const docRef = doc(this.fireStore, 'photos', id);
      getDoc(docRef).then((docData) => {
        if (docData.exists()) {
          this.data = docData.data();
        } else {
          console.log('No document found');
        }
      });
    }
  }
}
