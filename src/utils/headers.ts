import { useUserStore } from "@/stores/user";

const { idToken } = useUserStore();

export const getHeaders = (): Record<string, string> => {
  let headers = {
    'Authorization': '',
  };
  if(idToken != null){
    headers.Authorization = `Bearer ${idToken}`;
  }
  return headers;
}