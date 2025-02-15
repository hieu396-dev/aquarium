import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  userInfor: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService : AuthService
  ) {
    this.feedbackForm = this.fb.group({
      userId: 0,
      content: ['']
    });
  }
  ngOnInit(): void {
    this.authService.fetchUserInfo().subscribe((info) => {
      this.userInfor = info;
    })
  }
  submitFeedback(): void {
    const feedbackData = {
      userId: this.userInfor.id,
      content: this.feedbackForm.value.content
    };

    this.userService.addFeedback(feedbackData).subscribe(
      response => {
        console.log('Feedback submitted successfully:', response);
        alert('Thank you for your feedback!');
        this.feedbackForm.reset();
      },
      error => {
        console.error('Error submitting feedback:', error);
      }
    );
  }
}
