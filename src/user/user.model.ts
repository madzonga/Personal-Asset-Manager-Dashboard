// Interface representing the structure of a user as stored in the database
export interface UserTable {
    id: number;
    email: string;
    sub: string;
    created_at: string; // Make sure this is defined correctly
  }
  
  // Interface for creating a new user (excludes 'id' and 'created_at')
  export interface NewUser {
    sub: string; // Sub of the new user
    email: string; // Email of the new user
  }