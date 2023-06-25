import { defineStore } from 'pinia'
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import type { User } from '@/models/models';

export type Value<T> = {
  available: boolean;
  value?: T;
}

export const useUserStore = defineStore('user', ()=>{
  const idToken: RemovableRef<string|null> = useLocalStorage('idToken', null);
  const username: RemovableRef<string|null> = useLocalStorage('username', null);
  const user: RemovableRef<Value<User>> = useLocalStorage('user', {available: false});
  return { 
    idToken,
    username,
    user
  }
})
