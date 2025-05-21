import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AdminComponent implements OnInit {
  filterForm: FormGroup;
  users: any[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 5;
  sortField = 'login';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.filterForm = this.fb.group({
      login: [''],
      email: [''],
      role: ['']
    });
  }

  ngOnInit(): void {
    this.search();
  }

  search(page: number = 0): void {
    const { login, email, role } = this.filterForm.value;
    let params = new HttpParams()
      .set('page', page)
      .set('size', this.pageSize)
      .set('sort', `${this.sortField},${this.sortDirection}`);

    if (login) params = params.set('login', login);
    if (email) params = params.set('email', email);
    if (role) params = params.set('role', role);

    this.http.get<any>(`${environment.apiUrl}/admin/users`, { params }).subscribe(res => {
      this.users = res.content;
      this.currentPage = res.number;
      this.totalPages = res.totalPages;
    });
  }

  changeRole(userId: number, newRole: string): void {
    this.http.post(`${environment.apiUrl}/admin/add-role`, null, {
      params: new HttpParams().set('userId', userId).set('newRole', newRole)
    }).subscribe(() => this.search(this.currentPage));
  }

  blockUser(userId: number): void {
    this.http.post(`${environment.apiUrl}/admin/lock`, null, {
      params: new HttpParams().set('userId', userId)
    }).subscribe(() => this.search(this.currentPage));
  }

  goToPage(page: number): void {
    this.search(page);
  }

  pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  onRoleChange(event: Event, userId: number): void {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value;
    this.changeRole(userId, newRole);
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.search(this.currentPage);
  }

  sortIcon(field: string): string {
    if (this.sortField !== field) return '';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }
}
