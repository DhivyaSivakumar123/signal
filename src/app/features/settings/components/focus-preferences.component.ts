import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserPreference } from '../../../core/models/triage.model';
import { TriageActions } from '../../../state/triage/triage.actions';
import { selectPreferences, selectTriageLoading } from '../../../state/triage/triage.selectors';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-focus-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="preferences-form">
      <!-- Stated Priorities Description & Textarea -->
      <div class="form-group">
        <label class="form-label">Custom Instruction Priorities</label>
        <span class="form-helper">
          Describe what kinds of messages are most critical to you. The AI Scorer will use this context to prioritize signals.
        </span>
        <textarea class="form-textarea" 
                  [(ngModel)]="statedPriorities" 
                  placeholder="e.g. Focus on database infrastructure alerts, skip general marketing newsletters, mark billing tickets as urgent..."></textarea>
      </div>

      <!-- Digest Configuration Row -->
      <div class="form-row">
        <div class="form-group flex-1">
          <label class="form-label">Daily Digest Time</label>
          <span class="form-helper">When should we compile your digest?</span>
          <div class="input-with-icon">
            <mat-icon class="input-icon">schedule</mat-icon>
            <input type="time" class="form-input" [(ngModel)]="digestTime">
          </div>
        </div>
        
        <div class="form-group flex-1">
          <label class="form-label">Digest Channel</label>
          <span class="form-helper">Where should we deliver it?</span>
          <div class="input-with-icon">
            <mat-icon class="input-icon">chat_bubble_outline</mat-icon>
            <select class="form-select" [(ngModel)]="digestChannel">
              <option value="NONE">Disabled</option>
              <option value="EMAIL">Send via Email</option>
              <option value="SLACK">Send via Slack</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Save Button Block -->
      <div class="form-actions">
        <button class="save-btn" [disabled]="saving" (click)="save()">
          <span *ngIf="!saving" class="btn-content">
            <mat-icon>done</mat-icon> Save Preferences
          </span>
          <span *ngIf="saving" class="btn-content">
            Saving...
          </span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .preferences-form {
      padding: $space-6;
      display: flex;
      flex-direction: column;
      gap: $space-5;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      
      &.flex-1 {
        flex: 1;
      }
    }
    
    .form-row {
      display: flex;
      flex-direction: column;
      gap: $space-5;
    }

    @media(min-width: 600px) {
      .form-row {
        flex-direction: row;
      }
    }
    
    .form-label {
      font-family: $font-body;
      font-size: $text-xs;
      font-weight: $weight-semibold;
      color: $text-primary;
    }

    .form-helper {
      font-family: $font-body;
      font-size: 11px;
      color: $text-muted;
      line-height: 1.3;
      margin-bottom: 2px;
    }
    
    .form-input, .form-select, .form-textarea {
      font-family: $font-body;
      font-size: $text-sm;
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px solid $border-subtle;
      border-radius: $radius-badge;
      color: $text-primary;
      padding: $space-2 $space-3;
      outline: none;
      transition: all 150ms ease;
      width: 100%;
      box-sizing: border-box;
      
      &:focus {
        border-color: #3683f6;
        background-color: rgba(255, 255, 255, 0.04);
        box-shadow: 0 0 0 2px rgba(54, 131, 246, 0.15);
      }
    }
    
    .form-textarea {
      min-height: 90px;
      resize: vertical;
      line-height: 1.4;
    }

    .input-with-icon {
      position: relative;
      width: 100%;
      
      .form-input, .form-select {
        padding-left: 36px;
        height: 38px;
      }
    }

    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: $text-muted;
      font-size: 16px;
      width: 16px;
      height: 16px;
      pointer-events: none;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: $space-5;
    }
    
    .save-btn {
      background-color: #3683f6;
      color: #ffffff;
      border: none;
      border-radius: $radius-badge;
      padding: $space-2 $space-5;
      font-family: $font-body;
      font-size: $text-xs;
      font-weight: $weight-semibold;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(54, 131, 246, 0.2);
      transition: all 150ms ease;
      height: 34px;
      
      .btn-content {
        display: flex;
        align-items: center;
        gap: 6px;
        mat-icon { font-size: 14px; width: 14px; height: 14px; }
      }
      
      &:hover:not(:disabled) {
        background-color: #4a91f8;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
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
