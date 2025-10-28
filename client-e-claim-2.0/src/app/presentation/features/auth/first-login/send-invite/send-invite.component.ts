import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../../core/infrastructure/services/auth.service';
import { ToastService } from '../../../../../core/infrastructure/services/toast.service';

@Component({
  selector: 'app-send-invite',
  templateUrl: './send-invite.component.html',
  styleUrl: './send-invite.component.scss',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
})
export class SendInviteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  sendInviteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.sendInviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.sendInviteForm.invalid) {
      this.sendInviteForm.markAllAsTouched();
      return;
    }

    const credentials: any = this.sendInviteForm.value;

    this.authService.sendInvite(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => setTimeout(() => this.handleSendInviteSuccess()),
        error: (err) => this.handleSendInviteError(err)
      });
  }

  private handleSendInviteSuccess(): void {
    this.toast.success("Success");
  }

  private handleSendInviteError(error: any): void {
    this.toast.error(error.message);
  }
}
