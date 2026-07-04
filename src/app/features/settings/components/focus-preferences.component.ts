import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserPreference } from '../../../core/models/triage.model';
import { TriageActions } from '../../../state/triage/triage.actions';

@Component({
  selector: 'app-focus-preferences-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h3 class="card-title">Focus & Digest Preferences</h3>
      <p class="card-subtitle">Set your priority guidelines and digest delivery preferences.</p>
      
      <div class="form-group">
        <label class="form-label">Stated Priorities</label>
        <textarea class="form-textarea" 
                  [(ngModel)]="statedPriorities" 
                  placeholder="e.g. Focus on billing queries, skip marketing updates..."></textarea>
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label class="form-label">Digest Delivery Time</label>
          <select class="form-select" [(ngModel)]="digestTime">
            <option [ngValue]="null">Off</option>
            <option value="09:00">9:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="18:00">6:00 PM</option>
          </select>
        </div>

        <div class="form-group flex-1">
          <label class="form-label">Digest Channel</label>
          <select class="form-select" [(ngModel)]="digestChannel">
            <option value="NONE">None</option>
            <option value="EMAIL">Email</option>
            <option value="SLACK">Slack</option>
          </select>
        </div>
      </div>

      <button class="save-btn" [disabled]="saving" (click)="save()">{{ saving ? 'Saving...' : 'Save Changes' }}</button>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .card {
      background-color: $bg-surface;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-5;
      margin-bottom: $space-6;
    }
    
    .card-title {
      font-family: $font-display;
      font-size: $text-base;
      color: $text-primary;
      font-weight: $weight-semibold;
      margin-bottom: $space-1;
    }
    
    .card-subtitle {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-secondary;
      margin-bottom: $space-5;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: $space-1;
      margin-bottom: $space-4;
    }
    
    .flex-1 { flex: 1; }
    
    .form-row {
      display: flex;
      gap: $space-4;
    }
    
    .form-label {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-secondary;
      font-weight: $weight-medium;
    }
    
    .form-textarea {
      font-family: $font-body;
      font-size: $text-sm;
      background-color: $bg-base;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      color: $text-primary;
      padding: $space-2 $space-3;
      resize: vertical;
      min-height: 100px;
      
      &:focus {
        border-color: $border-focus;
        outline: none;
      }
    }
    
    .form-select {
      font-family: $font-body;
      font-size: $text-sm;
      background-color: $bg-base;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      color: $text-primary;
      padding: $space-2 $space-3;
      height: 38px;
      
      &:focus {
        border-color: $border-focus;
        outline: none;
      }
    }
    
    .save-btn {
      width: 120px;
      height: 36px;
      background-color: $border-focus;
      color: $text-primary;
      border-radius: $radius-badge;
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      border: none;
      cursor: pointer;
      transition: background-color 150ms ease;
      
      &:hover {
        background-color: lighten($border-focus, 10%);
      }
    }
  `]
})
export class FocusPreferencesComponent implements OnChanges {
  @Input() preferences: UserPreference | null = null;
  @Input() saving = false;

  private store = inject(Store);

  statedPriorities = '';
  digestTime: string | null = null;
  digestChannel: 'EMAIL' | 'SLACK' | 'NONE' = 'NONE';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preferences'] && this.preferences) {
      this.statedPriorities = this.preferences.statedPriorities;
      this.digestTime = this.preferences.digestTime;
      this.digestChannel = this.preferences.digestChannel;
    }
  }

  save(): void {
    const prefs: UserPreference = {
      statedPriorities: this.statedPriorities,
      digestTime: this.digestTime,
      digestChannel: this.digestChannel
    };
    this.store.dispatch(TriageActions.updatePreferences({ prefs }));
  }
}
