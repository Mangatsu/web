import useSWR, { Fetcher } from "swr"
import { ProcessingStatus } from "../../../types/api"
import { APIPathsV1, swrFetcher } from "../../api/other"

const fetcher: Fetcher<ProcessingStatus, string> = (id) => swrFetcher(id)

export default function useProcessingStatus() {
  const { data } = useSWR(APIPathsV1.Status, (key) => fetcher(key), { refreshInterval: 1000 })

  return {
    data,
  }
}
