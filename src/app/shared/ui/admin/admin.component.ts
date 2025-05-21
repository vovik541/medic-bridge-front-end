import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule]
})
export class AdminComponent implements OnInit {
  filterForm: FormGroup;
  users: any[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 5;
  sortField: string = 'login';
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
      this.users = res.content.map((user: any) => ({
        ...user,
        selectedRoleToRemove: null
      }));
      this.currentPage = res.number;
      this.totalPages = res.totalPages;
    });
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

  goToPage(page: number): void {
    this.search(page);
  }

  pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  blockUser(userId: number): void {
    this.http.post(`${environment.apiUrl}/admin/lock`, null, {
      params: new HttpParams().set('userId', userId)
    }).subscribe(() => this.search(this.currentPage));
  }

  unblockUser(userId: number): void {
    this.http.post(`${environment.apiUrl}/admin/unlock`, null, {
      params: new HttpParams().set('userId', userId)
    }).subscribe(() => this.search(this.currentPage));
  }

  changeRole(userId: number, newRole: string): void {
    this.http.post(`${environment.apiUrl}/admin/add-role`, null, {
      params: new HttpParams().set('userId', userId).set('newRole', newRole)
    }).subscribe(() => this.search(this.currentPage));
  }

  removeRole(userId: number, role: string): void {
    this.http.post(`${environment.apiUrl}/admin/remove-role`, null, {
      params: new HttpParams().set('userId', userId).set('newRole', role)
    }).subscribe(() => this.search(this.currentPage));
  }

  onRoleChange(event: Event, userId: number): void {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value;
    this.changeRole(userId, newRole);
  }
}
