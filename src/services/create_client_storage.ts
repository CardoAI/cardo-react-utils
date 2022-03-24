import {ICreateClientStorageParams} from "./interfaces";

const createStorage = ({access = 'access', refresh = 'refresh'}: ICreateClientStorageParams) => {

    const storage = {
        getAccessToken() {
            return localStorage.getItem(access)
        },
        setAccessToken(token: string) {
            return localStorage.setItem(access, token)
        },
        clearAccessToken() {
            return localStorage.removeItem(access)
        },
        getRefreshToken() {
            return localStorage.getItem(refresh)
        },
        setRefreshToken(token: string) {
            return localStorage.setItem(refresh, token)
        },
        clearRefreshToken() {
            return localStorage.removeItem(refresh)
        },
        clearTokens() {
            storage.clearAccessToken();
            storage.clearRefreshToken()
        }
    }

    return storage;
}

export default createStorage;
