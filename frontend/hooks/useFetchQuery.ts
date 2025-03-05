import { useQuery } from "@tanstack/react-query"

const endpoint = "localhost:4000"

export function useFetchQuery(path: string){
    return useQuery({
        queryKey: [path],
        queryFn: async () => {
            return fetch(endpoint + path).then(r => r.json())
        }
    })
}
