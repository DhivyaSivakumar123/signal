import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserPreference } from '../../../core/models/triage.model';
import { TriageActions } from '../../../state/triage/triage.actions';
import { selectPreferences, selectTriageLoading } from '../../../state/triage/triage.selectors';

@Component({
  selector: 'app-focus-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="preferences-form">
      <div class="form-group">
        <label class="form-label">Stated Priorities</label>
        <textarea class="form-textarea" 
                  [(ngModel)]="statedPriorities" 
                  placeholder="e.g. Focus on billing queries, skip marketing updates..."></textarea>
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label class="form-label">Daily Digest Time</label>
          <input type="time" class="form-input" [(ngModel)]="digestTime">
        </div>
        
        <div class="form-group flex-1">
          <label class="form-label">Digest Channel</label>
          <select class="form-select" [(ngModel)]="digestChannel">
            <option value="NONE">Disabled</option>
            <option value="EMAIL">Email</option>
            <option value="SLACK">Slack</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button class="save-btn" [disabled]="saving" (click)="save()">
          {{ saving ? 'Saving...' : 'Save Preferences' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .preferences-form {
      padding: $space-6;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: $space-2;
      margin-bottom: $space-4;
      
      &.flex-1 {
        flex: 1;
      }
    }
    
    .form-row {
      display: flex;
      gap: $space-4;
      margin-bottom: $space-5;
    }
    
    .form-label {
      font-family: $font-body;
      font-size: $text-xs;
      font-weight: $weight-semibold;
      color: $text-secondary;
    }
    
    .form-input, .form-select, .form-textarea {
      font-family: $font-body;
      font-size: $text-sm;
      background-color: $bg-elevated;
      border: 1px solid $border-subtle;
      border-radius: $radius-badge;
      color: $text-primary;
      padding: $space-2 $space-3;
      outline: none;
      transition: border-color 150ms ease;
      
      &:focus {
        border-color: $border-focus;
      }
    }
    
    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .form-input, .form-select {
      height: 38px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
    
    .save-btn {
      background-color: $border-focus;
      color: $text-primary;
      border: none;
      border-radius: $radius-badge;
      padding: $space-2 $space-4;
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      cursor: pointer;
      transition: background-color 150ms ease;
      
      &:hover {
        background-color: lighten($border-focus, 10%);
      }
    }
  `]
})
export class FocusPreferencesComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private sub = new Subscription();

  statedPriorities = '';
  digestTime: string | null = null;
  digestChannel: 'EMAIL' | 'SLACK' | 'NONE' = 'NONE';
  saving = false;

  ngOnInit(): void {
    this.sub.add(
      this.store.select(selectPreferences).subscribe((prefs) => {
        if (prefs) {
          this.statedPriorities = prefs.statedPriorities;
          this.digestTime = prefs.digestTime;
          this.digestChannel = prefs.digestChannel;
        }
      })
    );
    this.sub.add(
      this.store.select(selectTriageLoading).subscribe((s) => this.saving = s)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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
