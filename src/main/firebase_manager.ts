// import { initializeApp } from "firebase/app"; // Firebase 초기화
// import { getDatabase, ref, get, set, onValue, off, remove } from "firebase/database"; // Realtime Database 기능 가져오기
// import { FirebaseConfig, DataUpdate, Client, FirebaseManager } from "src/types/firebase";
// import { getFirebaseConfig } from '../configs/firebase.config';

// class FirebasemanagerImpl {
//     private database; // Firebase Realtime Database Interface
//     private clientId: string;

//     constructor(env: "product" | "test" | "release"){ // Firebase 초기화, DB 연결
//         const config = getFirebaseConfig(env);
//         const app = initializeApp(config);
//         this.database = getDatabase(app);
//          // 고유한 클라이언트 ID 생성
//         this.clientId = `client-${Math.random().toString(36).substr(2, 9)}`;
//     }

//     // 클라이언트 ID 가져오기
//     getClientId(): string {
//         return this.clientId;
//     }

//     // Firebase에서 데이터를 가져오는 함수
//     async getData<T>(path: string): Promise<T | null> {
//         try {
//             const dataRef = ref(this.database, path); // Firebase 경로 참조 생성
//             const snapshot = await get(dataRef); // 데이터 읽기
//             return snapshot.exists() ? snapshot.val() : null; // 데이터 반환
//         } catch (error) {
//             console.error(`Error fetching data from ${path}:`, error);
//             throw error;
//         }
//     }

//     // Firebase에 데이터 업데이트 시 sender_id 포함
//     async updateData<T>(update: DataUpdate<T>): Promise<void> {
//         try {
//         const dataRef = ref(this.database, update.path);
//         const dataWithSender = {
//             ...update.value,
//             sender_id: this.clientId,
//             timestamp: Date.now()
//         };
//         await set(dataRef, dataWithSender);
//         console.log(`Data updated at ${update.path} by client ${this.clientId}`);
//         } catch (error) {
//         console.error(`Error updating data at ${update.path}:`, error);
//         throw error;
//         }
//     }

//     // Firebase에서 데이터를 삭제하는 함수
//     async deleteData(path: string): Promise<void> {
//         try {
//             const dataRef = ref(this.database, path); // Firebase 경로 참조 생성
//             await remove(dataRef); // 데이터 삭제
//             console.log(`Data removed from ${path}`);
//         } catch (error) {
//             console.error(`Error removing data from ${path}:`, error);
//             throw error;
//         }
//     }

//     // Firebase 실시간 리스너를 시작하는 함수
//     startListener<T>(path: string, callback: (data: T) => void): void {
//         try {
//             const dataRef = ref(this.database, path); // Firebase 경로 참조 생성
//             onValue(dataRef, (snapshot) => {
//                 callback(snapshot.val()); // 데이터 변경 시 콜백 호출
//             });
//             console.log(`Listener started at ${path}`);
//         } catch (error) {
//             console.error(`Error starting listener at ${path}:`, error);
//         }
//     }

//     // Firebase 실시간 리스너를 중지하는 함수
//     stopListener(path: string): void {
//         try {
//             const dataRef = ref(this.database, path); // Firebase 경로 참조 생성
//             off(dataRef); // 리스너 중지
//             console.log(`Listener stopped at ${path}`);
//         } catch (error) {
//             console.error(`Error stopping listener at ${path}:`, error);
//         }
//     }
    
//     // Firebase 실시간 리스너를 재시작하는 함수
//     restartListener<T>(path: string, callback: (data: T) => void): void {
//         let attempts = 0;
//         const maxAttempts = 5;

//         const tryRestart = async () => {
//             while (attempts < maxAttempts) {
//                 try {
//                     this.startListener(path, callback); // Attempt to restart the listener
//                     console.log(`Listener restarted successfully at ${path}`);
//                     return;
//                 } catch (error) {
//                     console.error(`Listener restart attempt ${attempts + 1} failed:`, error);
//                     attempts++;
//                     await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
//                 }
//             }
//             console.error(`Failed to restart listener after ${maxAttempts} attempts.`);
//         };

//         tryRestart();
//     }

//     // 클라이언트 등록 시 sender_id 포함
//     async registerClient(): Promise<void> {
//         try {
//         const clientRef = ref(this.database, `clients/${this.clientId}`);
//         await set(clientRef, {
//             active: true,
//             lastSeen: Date.now(),
//             clientType: "desktop"
//         });
//         console.log(`Client registered: ${this.clientId}`);
//         } catch (error) {
//         console.error("Error registering client:", error);
//         throw error;
//         }
//     }
 
//     // Firebase에서 클라이언트를 등록 해제하는 함수
//     async unregisterClient(): Promise<void> {
//         try {
//             const clientRef = ref(this.database, `clients/${this.clientId}`); // this.clientId 사용
//             await remove(clientRef); // 클라이언트 데이터 삭제
//             console.log(`Client unregistered: ${this.clientId}`);
//         } catch (error) {
//             console.error("Error unregistering client:", error);
//             throw error;
//         }
//     }

//     // 다른 활성 클라이언트가 있는지 확인하는 함수
//     async isAnyOtherClientActive(): Promise<boolean> {
//         try {
//             const clientsRef = ref(this.database, "clients");
//             const snapshot = await get(clientsRef);
//             const clients: Record<string, Client> = snapshot.exists() ? snapshot.val() : {};
//             const activeClients = Object.keys(clients).filter((id) => clients[id].active);
//             return activeClients.length > 1;
//         } catch (error) {
//             console.error("Error checking active clients:", error);
//             throw error;
//         }
//     }

//     // 다중 클라이언트의 활성 상태를 감시하는 리스너 시작
//     startClientsListener(callback: (clients: Record<string, Client>) => void): void {
//         try {
//             const clientsRef = ref(this.database, "clients");
//             onValue(clientsRef, (snapshot) => {
//                 const clients: Record<string, Client> = snapshot.exists() ? snapshot.val() : {};
//                 callback(clients);
//             });
//             console.log(`Clients listener started`);
//         } catch (error) {
//             console.error("Error starting clients listener:", error);
//         }
//     }

//     // 다중 클라이언트 리스너 중지
//     stopClientsListener(): void {
//         try {
//             const clientsRef = ref(this.database, "clients");
//             off(clientsRef);
//             console.log(`Clients listener stopped`);
//         } catch (error) {
//             console.error("Error stopping clients listener:", error);
//         }
//     }

//     // 클라이언트 변경 사항을 처리하는 함수
//     async handleClientsChange(): Promise<void> {
//         try {
//             const clientsRef = ref(this.database, "clients");
//             const snapshot = await get(clientsRef);

//             const clients: Record<string, Client> = snapshot.exists() ? snapshot.val() : {};
//             const activeClients = Object.keys(clients).filter((id) => clients[id].active);
//             if (activeClients.length === 0) {
//                 console.log("No active clients. Clearing database.");
//                 // await this.clearAllData();
//             }
//         } catch (error) {
//             console.error("Error handling clients change:", error);
//             throw error;
//         }
//     }
// }

// export const firebaseManager:FirebaseManager = new FirebasemanagerImpl("test"); // 환경 선택 1. "Product" 2. "Test", 3. "release

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