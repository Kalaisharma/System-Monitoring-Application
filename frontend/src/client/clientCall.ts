import axios from "axios";
export const axiosCall = async (url:string, method:string, data:string | null = null) => {
    try {
        const config = {
            url: url,
            method: method,
            data: data
        }
        const response = await axios(config);
        return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        throw new Error(err);
    }
}