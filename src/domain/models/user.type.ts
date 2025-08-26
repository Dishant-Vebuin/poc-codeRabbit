export interface LoginUserDetails{
    id: number;
    email: string;
    password: string;
    role: string;
}

export interface UserDetails {
    id: number;
    username: string;
    email: string;
    role: "admin" | "user";
}

export interface Token {
    accessToken: string;
}