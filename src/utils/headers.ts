import { useUserStore } from "@/stores/user";

const { idToken } = useUserStore();

export const getHeaders = () => {
  let headers = {
    'Authorization': '',
  };
  if(idToken != null){
    headers.Authorization = `Bearer ${idToken}`;
  }
  return headers;
}