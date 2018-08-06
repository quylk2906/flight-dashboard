export interface Account {
  _id: string;
  ownedAgency: string[];
  agencyId: string;
  positionId: string;
  fullName: string;
  role: number;
  isActived: boolean;
  username: string;
  email: string;
  emailNotification: string;
  createdAt: string;
  password2: string;
  password: string;
  gender: boolean;
  age: number;
  faxNumber: string;
  timeJoin: string;
  degree: string;
  languages: string;
}
