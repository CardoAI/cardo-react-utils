import {ICreateClientStorageParams} from "./interfaces";

const createStorage = ({accessKey = 'access', refreshKey = 'refresh', roleKey = 'role'}: ICreateClientStorageParams) => {

    const storage = {
        getAccessToken(): string | null {
            return localStorage.getItem(accessKey);
        },
        setAccessToken(token: string): void {
            localStorage.setItem(accessKey, token);
        },
        clearAccessToken(): void {
            localStorage.removeItem(accessKey);
        },
        getRefreshToken(): string | null {
            return localStorage.getItem(refreshKey);
        },
        setRefreshToken(token: string): void {
            localStorage.setItem(refreshKey, token);
        },
        clearRefreshToken(): void {
            localStorage.removeItem(refreshKey);
        },
        getRole(): string | null {
            return localStorage.getItem(roleKey);
        },
        setToken(role: string): void {
            localStorage.setItem(roleKey, role);
        },
        cleaRole(): void {
            localStorage.removeItem(roleKey);
        },
        clearAll(): void {
            storage.clearAccessToken();
            storage.clearRefreshToken();
            storage.cleaRole();
        },
    }

    return storage;
}

export default createStorage;
