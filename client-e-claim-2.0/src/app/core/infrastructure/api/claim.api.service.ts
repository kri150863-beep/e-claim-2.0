import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CardItem, Claim } from '../../domain/entities/claim.entity';

import { IClaimRepository } from '../../domain/repositories/claim.repository';

import { Injectable } from '@angular/core';

import { MOCK_CLAIM } from '../mock-backend/data/claims.mock-data';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClaimApiService implements IClaimRepository {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClaims(
    page: number = 1,
    pageSize: number = 10,
    filters?: any
  ): Observable<{ data: Claim[]; total_claims: number }> {
    if (environment?.useMockBackend) {
      let filteredData = [...MOCK_CLAIM];

      // Apply filters if provided
      if (filters?.status?.length) {
        const hasAll = filters.status.includes('All');
        const hasBreach = filters.status.includes('Breach');

        filteredData = filteredData.filter((claim) => {
          if (hasAll) return true;

          if (hasBreach && claim.status_name === 'New' && claim.ageing >= 48) {
            return true;
          }

          return filters.status.includes(claim.status_name);
        });
      }

      // Apply search if provided
      if (filters?.search?.column && filters?.search?.value) {
        const searchValue = filters.search.value.toLowerCase();
        filteredData = filteredData.filter((claim) => {
          const column = filters.search.column;
          switch (column) {
            case 'searchNum':
              return claim.number?.toLowerCase().includes(searchValue);
            case 'searchName':
              return claim.name?.toLowerCase().includes(searchValue);
            case 'searchRegNum':
              return claim.registration_number
                ?.toLowerCase()
                .includes(searchValue);
            case 'searchPhone':
              return claim.phone?.toLowerCase().includes(searchValue);
            default:
              return true;
          }
        });
      }

      // Apply sorting if provided
      if (filters?.sort) {
        filteredData = this.sortClaims(filteredData, filters.search);
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + pageSize
      );

      return of({
        data: paginatedData,
        total_claims: filteredData.length,
      });
    }

    // Real API implementation
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('email', filters.email.toString());

    if (filters?.status.length && !filters?.status.includes('All')) {
      params = params.set('status', filters.status.join(','));
    }

    if (filters?.search?.column && filters?.search?.value) {
      params = params.set(filters?.search?.column, filters?.search?.value);
    }

    if (filters?.sort) {
      params = params.set('sortBy', filters.sort);
    }

    return this.http.get<any>(`${this.apiUrl}/claims`, { params }).pipe(
      map((response) => {
        if (response && response?.status === 'success' && response?.data) {
          return response.data;
        } else if (response && response?.id) {
          return response;
        } else if (Array.isArray(response) && response.length > 0) {
          return response[0];
        } else {
          return response;
        }
      }),
      catchError((error) => {
        console.error('ProfileApiService: HTTP error:', error);
        console.error('ProfileApiService: Error type:', typeof error);
        return throwError(() => error);
      })
    );
  }

  getClaimCards(email: string = ''): Observable<any> {
    if (environment?.useMockBackend) {
      return of([
        { id: 'All', name: 'Received', count: 72 },
        { id: 'New', name: 'New', count: 22 },
        { id: 'Breach', name: 'About to breach', count: 30 },
        { id: 'Queries', name: 'Queries', count: 20 },
      ]);
    }

    return this.http
      .get<any>(`${this.apiUrl}/claim/card-stats`, {
        params: new HttpParams().set('email', email),
      })
      .pipe(
        map((response) => {
          return this.updateCardItems(response?.data);
        })
      );
  }

  getClaimById({
    claimNo,
    email,
  }: {
    claimNo: string;
    email: string;
  }): Observable<any> {
    if (environment?.useMockBackend) {
      let filteredData = [...MOCK_CLAIM];

      return of(filteredData.filter((claim) => claim.number === claimNo));
    }

    let params = new HttpParams()
      .set('claimNo', claimNo.toString())
      .set('email', email.toString());

    return this.http.get<Claim>(`${this.apiUrl}/claim/`, { params });
  }

  getClaimReport({
    claimNo,
    email,
  }: {
    claimNo: string;
    email: string;
  }): Observable<any> {
    if (environment?.useMockBackend) {
      // let filteredData = [...MOCK_CLAIM];
      const reportData = {
        status: 'success',
        code: 200,
        message: 'Successful Claim partial information retrieval.',
        data: {
          vehicle_information: {
            claim_number: 'M0119926',
            make: 'Mazda',
            model: 'BT50',
            cc: 1200,
            fuel_type: 'Petrol',
            transmission: 'Manuel',
            engine_no: '036 NI 09',
            chassis_no: 'CHS987654321',
            vehicle_no: '626 GT 23',
          },
          survey_information: {
            garage: 'Garage TE',
            garage_address: 'Port Louis',
            garage_contact_number: '543729836',
            eor_value: '105082.00',
          },
          repair_estimate: [
            {
              name: 'Pare-chocs avant',
              quantity: 1,
              part_details: [{
                part_detail_id: 1,
                supplier: 'Garage TGE',
                quality: 'Premium',
                cost_part: 3299,
                discount_part: '500.00',
                vat_part: '15',
                part_total: '4080.00',
              }],
              labour_details: [{
                part_detail_id: 1,
                eor_or_surveyor: 'EOR',
                activity: 'Remplacement pare-chocs avant',
                number_of_hours: '3.00',
                hourly_cost_labour: '0.00',
                discount_labour: '200.00',
                vat_labour: '15',
                labour_total: '-204.00',
              }],
            },
            {
              name: 'Peinture métallisée',
              quantity: 1,
              part_details: [{
                part_detail_id: 2,
                supplier: 'Garage tieu',
                quality: 'Premium',
                cost_part: 237,
                discount_part: '0.00',
                vat_part: '15',
                part_total: '1224.00',
              }],
              labour_details: [{
                part_detail_id: 2,
                eor_or_surveyor: 'SURVEYOR',
                activity: 'Application peinture métallisée',
                number_of_hours: '2.00',
                hourly_cost_labour: '0.00',
                discount_labour: '0.00',
                vat_labour: '15',
                labour_total: '0.00',
              }],
            },
          ],
          additional_labour_details: [
            {
              eor_or_surveyor: 'EOR',
              painting_cost: '1200.00',
              painting_materiels: '300.00',
              sundries: '50.00',
              num_of_repaire_days: 3,
              discount_add_labour: '100.00',
              vat: '15.00',
              add_labour_total: '1557.50',
            },
            {
              eor_or_surveyor: 'Surveyor',
              painting_cost: '1500.00',
              painting_materiels: '400.00',
              sundries: '70.00',
              num_of_repaire_days: 4,
              discount_add_labour: '200.00',
              vat: '15.00',
              add_labour_total: '2062.50',
            },
          ],
        },
      };

      return of(reportData);
    }

    let params = new HttpParams()
      .set('claimNo', claimNo.toString())
      .set('email', email.toString());

    return this.http.get<Claim>(`${this.apiUrl}/claim/report`, { params });
  }

  saveClaimReport({
    claimId,
    surveyorId,
    status,
    currentStep,
    reportData,
  }: any): Observable<Claim> {
    console.log(reportData);
    return this.http.post<Claim>(`${this.apiUrl}/claim/report`, {
      ...reportData,
      claimNo: claimId,
      surveyorId,
      status,
      currentStep,
    });
  }

  updateClaimReport(claimId: string, reportData: any): Observable<Claim> {
    return this.http.put<Claim>(
      `${this.apiUrl}/claims/${claimId}/report`,
      reportData
    );
  }

  submitClaimReport(claimId: string): Observable<Claim> {
    return this.http.post<Claim>(`${this.apiUrl}/claims/${claimId}/submit`, {});
  }

  returnClaim(claimId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/claims/${claimId}/return`, {});
  }

  downloadClaimReport(claimId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/claims/${claimId}/download`, {
      responseType: 'blob',
    });
  }

  private sortClaims(claims: Claim[], sortBy: string): Claim[] {
    switch (sortBy) {
      case 'received_date-asc':
        return [...claims].sort(
          (a, b) =>
            new Date(a.received_date).getTime() -
            new Date(b.received_date).getTime()
        );
      case 'received_date-desc':
        return [...claims].sort(
          (a, b) =>
            new Date(b.received_date).getTime() -
            new Date(a.received_date).getTime()
        );
      case 'ageing-asc':
        return [...claims].sort((a, b) => a.ageing - b.ageing);
      case 'ageing-desc':
        return [...claims].sort((a, b) => b.ageing - a.ageing);
      default:
        return claims;
    }
  }

  private updateCardItems(data: any): CardItem[] {
    return [
      {
        id: 'All',
        name: 'Received',
        count: data?.received || 0,
      },
      {
        id: 'New',
        name: 'New',
        count: data?.new || 0,
      },
      {
        id: 'Breach',
        name: 'About to breach',
        count: data?.about_to_breach || 0,
      },
      {
        id: 'Queries',
        name: 'Queries',
        count: data?.queries,
      },
    ];
  }
}
