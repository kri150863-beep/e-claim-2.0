import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verification-form',
  imports: [],
  templateUrl: './verification-form.component.html',
  styleUrl: './verification-form.component.scss'
})
export class VerificationFormComponent {
  constructor(private router: Router) {}

  private route = inject(ActivatedRoute);

  redirectToClaims() {
    this.router.navigate(['/dashboard/claims']); 
  }
}
