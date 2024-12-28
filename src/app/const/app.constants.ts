import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConstants {
    public successMessage = 'Create Successfully';       // 200
    public dataNotFound = 'Not found data';              // 404
    public notValidData = 'Invalid data';                // 422
    public internalServerError = 'Server Error';         // 500
    public networkError = 'Please check internet'; 
    public confirmAlertMsg = 'Are you sure you want to delete this?'
    public confirmAlertheader = 'Confirm Alert'
}