import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Animal {
  id: number;
  name: string;
  weight: string;
  length: string;
  exhibitStatus: string;
  species: any;
  img: any;
}

@Component({
  selector: 'app-animal-detail-page',
  templateUrl: './animal-detail-page.component.html',
  styleUrls: ['./animal-detail-page.component.css']
})
export class AnimalDetailPageComponent implements OnInit {
  animal: Animal = {
    id: 0,
    name: '',
    weight: '',
    length: '',
    exhibitStatus: '',
    species: null,
    img: []
  };
  otherAnimal: Animal[] = [];
  currentImageIndex = 0;

  constructor(
    private animalService: AnimalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getAnimalData(parseInt(id, 10));
      } else {
        console.error('Animal ID is missing in the URL.');
        this.router.navigate(['customer/animal']);
      }
    });
  }

  getAnimalData(id: number) {
    this.animalService.getAnimalsById(id).subscribe(
      (animalData: Animal) => {
        this.animal = animalData;
        const speciesName = this.animal.species.name;
        this.getOtherAnimalExcluding(speciesName,id);

      },
      error => {
        console.error('Failed to fetch animal:', error);
        this.router.navigate(['/events']);
      }
    );
  }
  getOtherAnimalExcluding(speciesName : String,id: number) {
    this.animalService.getAnimalsBySpecies(speciesName,id).subscribe(
      (animals: Animal[]) => {
        this.otherAnimal = animals;
      },
      error => {
        console.error('Failed to fetch other animals:', error);
      }
    );
  }

  nextImage() {
    if (this.animal.img && this.animal.img.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.animal.img.length;
    }
  }

  prevImage() {
    if (this.animal.img && this.animal.img.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.animal.img.length) % this.animal.img.length;
    }
  }
}
