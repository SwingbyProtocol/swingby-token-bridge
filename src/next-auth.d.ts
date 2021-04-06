import 'next-auth';

declare module 'next-auth' {
  export interface User {
    id: number;
    affiliateCode: string;
  }
}
