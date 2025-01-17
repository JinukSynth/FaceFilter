import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, onValue, off, remove } from "firebase/database";
import { FirebaseConfig, DataUpdate, Client, FirebaseManager } from "src/types/firebase";
import { getFirebaseConfig } from '../configs/firebase.config';

class FirebasemanagerImpl {
   private database;
   private clientId: string;
   private activeListeners: Map<string, boolean> = new Map(); // 리스너 상태 추적을 위한 Map 추가

   constructor(env: "product" | "test" | "release"){
       const config = getFirebaseConfig(env);
       const app = initializeApp(config);
       this.database = getDatabase(app);
       this.clientId = `client-${Math.random().toString(36).substr(2, 9)}`;
   }

   getClientId(): string {
       return this.clientId;
   }

   async getData<T>(path: string): Promise<T | null> {
       try {
           const dataRef = ref(this.database, path);
           const snapshot = await get(dataRef);
           return snapshot.exists() ? snapshot.val() : null;
       } catch (error) {
           console.error(`Error fetching data from ${path}:`, error);
           throw error;
       }
   }

   async updateData<T>(update: DataUpdate<T>): Promise<void> {
       try {
           const dataRef = ref(this.database, update.path);
           const dataWithSender = {
               ...update.value,
               sender_id: this.clientId,
               timestamp: Date.now()
           };
           await set(dataRef, dataWithSender);
           console.log(`Data updated at ${update.path} by client ${this.clientId}`);
       } catch (error) {
           console.error(`Error updating data at ${update.path}:`, error);
           throw error;
       }
   }

   async deleteData(path: string): Promise<void> {
       try {
           // 삭제 전에 리스너 정리
           this.stopListener(path);
           
           const dataRef = ref(this.database, path);
           await remove(dataRef);
           
           // 삭제 후 잠시 대기
           await new Promise(resolve => setTimeout(resolve, 100));
           
           console.log(`Data removed from ${path}`);
       } catch (error) {
           console.error(`Error removing data from ${path}:`, error);
           throw error;
       }
   }

   startListener<T>(path: string, callback: (data: T) => void): void {
       try {
           // 이전 리스너가 있다면 먼저 정리
           this.stopListener(path);

           const dataRef = ref(this.database, path);
           onValue(dataRef, (snapshot) => {
               callback(snapshot.val());
           });
           
           this.activeListeners.set(path, true);
           console.log(`Listener started at ${path}`);
       } catch (error) {
           console.error(`Error starting listener at ${path}:`, error);
       }
   }

   stopListener(path: string): void {
       try {
           if (this.activeListeners.get(path)) {
               const dataRef = ref(this.database, path);
               off(dataRef, 'value'); // 특정 이벤트의 리스너만 제거
               this.activeListeners.delete(path);
               console.log(`Listener stopped at ${path}`);
           }
       } catch (error) {
           console.error(`Error stopping listener at ${path}:`, error);
       }
   }
   
   restartListener<T>(path: string, callback: (data: T) => void): void {
       let attempts = 0;
       const maxAttempts = 5;

       const tryRestart = async () => {
           while (attempts < maxAttempts) {
               try {
                   this.startListener(path, callback);
                   console.log(`Listener restarted successfully at ${path}`);
                   return;
               } catch (error) {
                   console.error(`Listener restart attempt ${attempts + 1} failed:`, error);
                   attempts++;
                   await new Promise((resolve) => setTimeout(resolve, 5000));
               }
           }
           console.error(`Failed to restart listener after ${maxAttempts} attempts.`);
       };

       tryRestart();
   }

   async registerClient(): Promise<void> {
       try {
           const clientRef = ref(this.database, `clients/${this.clientId}`);
           await set(clientRef, {
               active: true,
               lastSeen: Date.now(),
               clientType: "desktop"
           });
           console.log(`Client registered: ${this.clientId}`);
       } catch (error) {
           console.error("Error registering client:", error);
           throw error;
       }
   }

   async unregisterClient(): Promise<void> {
       try {
           const clientRef = ref(this.database, `clients/${this.clientId}`);
           await remove(clientRef);
           console.log(`Client unregistered: ${this.clientId}`);
       } catch (error) {
           console.error("Error unregistering client:", error);
           throw error;
       }
   }

   async isAnyOtherClientActive(): Promise<boolean> {
       try {
           const clientsRef = ref(this.database, "clients");
           const snapshot = await get(clientsRef);
           const clients: Record<string, Client> = snapshot.exists() ? snapshot.val() : {};
           const activeClients = Object.keys(clients).filter((id) => clients[id].active);
           return activeClients.length > 1;
       } catch (error) {
           console.error("Error checking active clients:", error);
           throw error;
       }
   }

   startClientsListener(callback: (clients: Record<string, Client>) => void): void {
       try {
           const clientsRef = ref(this.database, "clients");
           onValue(clientsRef, (snapshot) => {
               const clients: Record<string, Client> = snapshot.exists() ? snapshot.val() : {};
               callback(clients);
           });
           console.log(`Clients listener started`);
       } catch (error) {
           console.error("Error starting clients listener:", error);
       }
   }

   stopClientsListener(): void {
       try {
           const clientsRef = ref(this.database, "clients");
           off(clientsRef);
           console.log(`Clients listener stopped`);
       } catch (error) {
           console.error("Error stopping clients listener:", error);
       }
   }

   async handleClientsChange(): Promise<void> {
       try {
           const clientsRef = ref(this.database, "clients");
           const snapshot = await get(clientsRef);

           const clients: Record<string, Client> = snapshot.exists() ? snapshot.val() : {};
           const activeClients = Object.keys(clients).filter((id) => clients[id].active);
           if (activeClients.length === 0) {
               console.log("No active clients. Clearing database.");
           }
       } catch (error) {
           console.error("Error handling clients change:", error);
           throw error;
       }
   }
}

export const firebaseManager:FirebaseManager = new FirebasemanagerImpl("test");