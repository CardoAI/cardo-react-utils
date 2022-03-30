import axios from "axios";
import {IClient, ICreateClientParams} from "./interfaces"

const createClient = ({baseURL}: ICreateClientParams): IClient => {
    const client = axios.create({baseURL: baseURL}) as IClient;
    client.isCancel = axios.isCancel;
    client.CancelToken = axios.CancelToken;
    return client;
}

export default createClient;
