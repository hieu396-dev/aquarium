import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-animal-list',
  templateUrl: './animal-list.component.html',
  styleUrls: ['./animal-list.component.css']
})
export class AnimalListComponent implements OnInit {
  animals: any[] = [];  
  originalAnimals: any[] = [];
  filteredAnimals: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  animalsPerPage: number = 8;
  totalPages: number = 0;
  selectedSpeciesId: number | null = null;
  transitionClass: string = '';

  constructor(
    private router: Router,
    private animalService: AnimalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const speciesId = params.get('speciesId'); 
      this.selectedSpeciesId = speciesId ? +speciesId : null;
      this.fetchAnimal(this.selectedSpeciesId);
    });
  }


  fetchAnimal(speciesId: number | null = null) {
    this.animalService.getAllAnimals().subscribe(
      (data: any[]) => {
        this.originalAnimals = data;
        this.filteredAnimals = speciesId
          ? this.originalAnimals.filter(animal => animal.species.id === speciesId)
          : [...this.originalAnimals];
        this.totalPages = Math.ceil(this.filteredAnimals.length / this.animalsPerPage);
        this.updateAnimals();
      }
    );
  }

  onSearch() {
    this.currentPage = 1;
    const searchTermLower = this.searchTerm.toLowerCase();

    if (this.searchTerm) {
      this.filteredAnimals = this.originalAnimals.filter(animal =>
        animal.name && animal.name.toLowerCase().includes(searchTermLower)
        || animal.name.toLowerCase().startsWith(searchTermLower)
      );
    } else {
      this.filteredAnimals = [...this.originalAnimals];
    }

    this.totalPages = Math.ceil(this.filteredAnimals.length / this.animalsPerPage);
    this.updateAnimals();
  }

  updateAnimals() {
    const startIndex = (this.currentPage - 1) * this.animalsPerPage;
    const endIndex = startIndex + this.animalsPerPage;
    this.animals = this.filteredAnimals.slice(startIndex, endIndex);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyTransition('transition-prev');
      this.updateAnimals();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyTransition('transition-next');
      this.updateAnimals();
    }
  }

  applyTransition(className: string) {
    this.transitionClass = className;
    setTimeout(() => {
      this.transitionClass = '';
    }, 500);
  }

  // filterBySpecies(speciesId: number | null) {
  //   this.selectedSpeciesId = speciesId;
  //   this.currentPage = 1;
  //   this.fetchAnimal(this.selectedSpeciesId);
  // }

}
