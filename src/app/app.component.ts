import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './state/auth/auth.actions';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.getAccessToken()) {
      this.store.dispatch(AuthActions.loadCurrentUser());
    }
  }
}
