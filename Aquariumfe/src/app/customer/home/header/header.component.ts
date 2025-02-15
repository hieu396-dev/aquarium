import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserInfo } from '../../../models/user-info.model';
import { Router } from '@angular/router';
import { SpeciesService } from '../services/species.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isHeaderHidden = false;
  lastScrollTop = 0;

  constructor(private authService : AuthService, private router :Router, private speciesService : SpeciesService){}

  userInfo: UserInfo | null = null;
  species: any[] = [];
  
  ngOnInit(): void {
    this.authService.fetchUserInfo().subscribe(user => {
      this.userInfo = user;
      console.log(this.userInfo.firstName);
    });
    this.speciesService.getAllSpecies().subscribe(
      (data: any[]) => {
        this.species = data;
      }
    );
  }
  filterAnimals(species: string | null) {
    if (species === 'all') {
      this.router.navigate(['/customer/animal/animalList']);
    } else {
      const selectedSpecies = this.species.find(s => s.name === species);
      if (selectedSpecies) {
        this.router.navigate(['/customer/animal/animalList', selectedSpecies.id]);
      }
    }
  }
  checkLogin(): boolean{
    return this.authService.isLoggedIn();
  }
  @HostListener("window:scroll", [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    this.isHeaderHidden = currentScroll > this.lastScrollTop;
    this.lastScrollTop = currentScroll;
  }

  @ViewChild('userDropdown') userDropdown!: ElementRef;
  @ViewChild('animalsDropdown') animalsDropdown!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      (document.getElementById('user-dropdown-toggle') as HTMLInputElement).checked = false;
    }

    if (this.animalsDropdown && !this.animalsDropdown.nativeElement.contains(event.target)) {
      (document.getElementById('dropdown-toggle') as HTMLInputElement).checked = false;
    }
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
