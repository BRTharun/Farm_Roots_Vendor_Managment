export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role:string;
    isVendor?:boolean;
    // Add any other properties your user object might have
}
