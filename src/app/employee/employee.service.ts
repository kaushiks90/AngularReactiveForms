import { Injectable } from "@angular/core";
import { IEmployee } from "./IEmployee";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable()
export class EmployeeService {
  baseUrl = "http://localhost:3000/employees";
  constructor(private httpClient: HttpClient) {}

  getEmployees(): Observable<IEmployee[]> {
    return this.httpClient.get<IEmployee[]>(this.baseUrl);
  }

  getEmployee(id: number): Observable<IEmployee> {
    return this.httpClient.get<IEmployee>(`${this.baseUrl}/${id}`);
  }

  addEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.httpClient.post<IEmployee>(this.baseUrl, employee);
  }

  updateEmployee(employee: IEmployee): Observable<void> {
    return this.httpClient.put<void>(
      `${this.baseUrl}/${employee.id}`,
      employee
    );
  }

  deleteEmployee(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
