export type Role='admin'|'employee';
export interface UserProfile{$id:string;userId:string;name:string;email:string;role:Role;departmentId?:string|null;avatarId?:string;position?:string;status?:'active'|'inactive';}
export interface Department{$id:string;name:string;description?:string;}
export interface AttendanceRecord{$id:string;userId:string;date:string;checkIn:string;checkOut?:string|null;status:'present'|'absent'|'late'|'leave';workingHours?:number;}
