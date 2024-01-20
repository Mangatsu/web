import useSWR, { Fetcher } from "swr"
import { ProcessingStatus } from "../../../types/api"
import { APIPathsV1, swrFetcher } from "../../api/other"

const fetcher: Fetcher<ProcessingStatus, string> = (id) => swrFetcher(id)

export default function useProcessingStatus(refresh?: boolean) {
  const { data } = useSWR(APIPathsV1.Status, (key) => fetcher(key), { refreshInterval: refresh ? 2000 : 0 })

  return {
    data,
  }
}
