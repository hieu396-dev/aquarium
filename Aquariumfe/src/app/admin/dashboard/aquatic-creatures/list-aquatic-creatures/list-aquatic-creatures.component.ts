import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AquaticCreaturesService } from '../../services/aquatic-creatures.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-list-aquatic-creatures',
  templateUrl: './list-aquatic-creatures.component.html',
  styleUrls: ['./list-aquatic-creatures.component.css']
})
export class ListAquaticCreaturesComponent implements OnInit {
  creatures: any[] = [];
  paginatedCreatures: any[] = [];
  filteredCreatures: any[] = [];
  page: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;
  searchQuery: string = '';

  constructor(private router: Router, private aquaticCreaturesService: AquaticCreaturesService, private authService : AuthService) {}

  ngOnInit() {
    this.loadCreatures();
  }

  loadCreatures() {
    this.aquaticCreaturesService.getAllCreatures().subscribe(
      (data) => {
        this.creatures = data;
        this.filteredCreatures = this.creatures;
        this.totalPages = Math.ceil(this.filteredCreatures.length / this.itemsPerPage);
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching aquatic creatures', error);
      }
    );
  }

  updatePagination() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCreatures = this.filteredCreatures.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }

  editCreature(id: number) {
    this.router.navigate([`/admin/dashboard/aquatic-creatures/form/${id}`]);
  }

  addCreature() {
    this.router.navigate(['/admin/dashboard/aquatic-creatures/form']);
  }

  searchCreatures() {
    if (this.searchQuery) {
      this.filteredCreatures = this.creatures.filter(creature =>
        creature.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredCreatures = this.creatures;
    }
    this.page = 1;
    this.totalPages = Math.ceil(this.filteredCreatures.length / this.itemsPerPage);
    this.updatePagination();
  }
  hasRole(roles: string[]): boolean {
    let hasRole = false;
    this.authService.getUserRoles().subscribe(userRoles => {
      hasRole = userRoles.some(userRole => roles.includes(userRole));
    });
    return hasRole;
  }
}
