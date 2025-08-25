import {axiosCall} from "../client/clientCall";
const BASE_URL = "http://localhost:5000/api/machines";
type Filtervalues = {
  os: string | null,
  status: string | null,
  issue: string | null
}
export const fetchMachines = async (filters: Partial<Filtervalues> = {}) => {
  try {
    const appliedFilters: Filtervalues = {
      os: filters.os ?? "",
      status: filters.status ?? "",
      issue: filters.issue ?? "",
    };

    const url = `${BASE_URL}?os=${appliedFilters.os}&status=${appliedFilters.status}&issue=${appliedFilters.issue}`;
    const response = await axiosCall(url, "GET");
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
};
