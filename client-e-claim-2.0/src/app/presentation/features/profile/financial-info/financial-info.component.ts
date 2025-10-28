import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../core/infrastructure/services/profile.service';
import { Subject, takeUntil } from 'rxjs';
import { FinancialField } from '../../../../core/domain/entities/profile.entity';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-financial-info',
  templateUrl: './financial-info.component.html',
  styleUrls: [
    './financial-info.component.scss',
    '../setting/setting.component.scss',
  ],
})
export class FinancialInfoComponent implements OnInit, OnDestroy {
  fields: FinancialField[] = [];

  private destroy$ = new Subject<void>();

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.subscribeToFinancialChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToFinancialChanges(): void {
    this.profileService.financialFields$
      .pipe(takeUntil(this.destroy$))
      .subscribe((fields) => {
        this.fields = fields;
      });
  }
}
