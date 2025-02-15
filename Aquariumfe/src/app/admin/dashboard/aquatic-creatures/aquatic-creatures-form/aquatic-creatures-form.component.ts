import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AquaticCreaturesService } from '../../services/aquatic-creatures.service';
import { AuthService } from '../../../services/auth.service';

interface AquaticCreaturesForm {
  name: string;
  weight: number;
  length: number;
  exhibitStatus: string;
  userId: number;
  speciesId: number;
  images: File[];  
  descriptions: string[];
}

interface Species {
  id: number;
  name: string;
}

@Component({
  selector: 'app-aquatic-creatures-form',
  templateUrl: './aquatic-creatures-form.component.html',
  styleUrls: ['./aquatic-creatures-form.component.css']
})
export class AquaticCreaturesFormComponent implements OnInit {
  aquaticCreaturesForm: AquaticCreaturesForm = {
    name: '',
    weight: 0,
    length: 0,
    exhibitStatus: '',
    userId: 1,
    speciesId: 1,
    images: [],
    descriptions: [],
  };
  speciesList: Species[] = [];
  imagePreviews: string[] = [];
  creatureId: number | null = null;
  nameError: string = '';
  weightError: string = '';
  lengthError: string = '';
  exhibitStatusError: string = '';
  speciesIdError: string = '';
  generalErrorMessage: string = '';
  isUpdateMode: boolean = false;
  imgErrors: string = ''; 
  descreiptionErrors: string = '';
  userInfo: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private aquaticCreaturesService: AquaticCreaturesService,
    private authService: AuthService
  ) {}

  
  ngOnInit() {
    this.loadSpecies();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.creatureId = parseInt(id, 10);
        this.isUpdateMode = true;
        this.getAquaticCreatureData(this.creatureId);
      }else {
        this.aquaticCreaturesForm.images = [];  
        this.aquaticCreaturesForm.descriptions = [];
      }
    });
    this.authService.fetchUserInfo().subscribe(user => {
      this.userInfo = user;
    });
  }
  loadSpecies() {
    this.aquaticCreaturesService.getAllSpecies().subscribe(
      (data) => {
        this.speciesList = data; 
      },
      (error) => {
        console.error('Error fetching aquatic creatures', error);
      }
    );
  }

  getAquaticCreatureData(id: number) {
    this.aquaticCreaturesService.getCreatureById(id).subscribe(
      (creatureData: any) => {
        this.aquaticCreaturesForm = {
          name: creatureData.name,
          weight: creatureData.weight,
          length: creatureData.length,
          exhibitStatus: creatureData.exhibitStatus,
          userId: this.userInfo?.id || 1,
          speciesId: creatureData.speciesId,
          images: creatureData.images || [],  
          descriptions: creatureData.descriptions || [],  
        };
      },
      error => {
        console.error('Failed to fetch aquatic creature:', error);
        this.generalErrorMessage = 'Could not retrieve aquatic creature data. Please try again.';
      }
    );
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const files = Array.from(input.files);
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      this.imagePreviews = [];
      this.aquaticCreaturesForm.images = []; 
      this.aquaticCreaturesForm.descriptions = []; 
      files.forEach(file => {
        if (validTypes.includes(file.type)) {
          this.aquaticCreaturesForm.images.push(file); 
          this.aquaticCreaturesForm.descriptions.push('');
          const reader = new FileReader();
          reader.onload = () => {
            
            this.imagePreviews.push(reader.result as string);
          };
          reader.readAsDataURL(file); 
        }else{
          this.imgErrors = ('Please select valid image files (JPEG, PNG, GIF).');
        }
      }
    );
    }
  }

  

  removeImage(index: number) {
    if (this.aquaticCreaturesForm.images) {
      this.aquaticCreaturesForm.images.splice(index, 1);
    }
    this.imagePreviews.splice(index, 1);
  }

  onSubmit(): void {
    this.resetErrorMessages();

    const formData = this.createFormData();

    const creatureObservable = this.isUpdateMode && this.creatureId
      ? this.aquaticCreaturesService.updateCreature(this.creatureId, formData)
      : this.aquaticCreaturesService.createCreature(formData);

    creatureObservable.subscribe(
      response => {
        console.log(`${this.isUpdateMode ? 'Aquatic creature updated' : 'Aquatic creature created'} successfully:`, response);
        this.router.navigate(['admin/aquatic-creatures']);
      },
      error => {
        console.error('API Error:', error);
        console.error('Validation Errors:', error.error.errors);
        this.handleErrors(error);
      }
    );
  }

  createFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.aquaticCreaturesForm.name);
    formData.append('weight', this.aquaticCreaturesForm.weight.toString());
    formData.append('length', this.aquaticCreaturesForm.length.toString());
    formData.append('exhibitStatus', this.aquaticCreaturesForm.exhibitStatus);
    formData.append('speciesId', this.aquaticCreaturesForm.speciesId.toString());
    formData.append('userId', this.userInfo.id.toString());

    if (this.aquaticCreaturesForm.images) {
      this.aquaticCreaturesForm.images.forEach((img, index) => {
        formData.append(`images[${index}]`, img); 
        formData.append(`descriptions[${index}]`, this.aquaticCreaturesForm.descriptions[index]);
      });
    }
    return formData;
  }

  handleErrors(error: any) {
    this.resetErrorMessages();

    if (error.error && error.error.errors) {
      this.nameError = error.error.errors.name || '';
      this.weightError = error.error.errors.weight || '';
      this.lengthError = error.error.errors.length || '';
      this.exhibitStatusError = error.error.errors.exhibitStatus || '';
      this.speciesIdError = error.error.errors.speciesId || '';
      this.imgErrors = error.error.errors.images || '';
      this.descreiptionErrors = error.error.errors.descriptions || ''
      
    } else {
      this.generalErrorMessage = 'An unknown error occurred. Please try again later.';
    }
  }

  resetErrorMessages() {
    this.nameError = '';
    this.weightError = '';
    this.lengthError = '';
    this.exhibitStatusError = '';
    this.speciesIdError = '';
    this.generalErrorMessage = '';
  }

}


