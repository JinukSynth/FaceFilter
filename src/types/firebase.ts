// Firebase Data type

export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    storageBucket?: string;
}

export interface Client {
    id: string;
    active: boolean;
}

export interface DataUpdate<T> {
    path: string; // Firebase 경로
    value: T;     // 저장할 값
}

// Firebase CRUD 작업 함수 정의
export interface FirebaseManager {
    getData<T>(path: string): Promise<T | null>;
    updateData<T>(update: DataUpdate<T>): Promise<void>;
    deleteData(path: string): Promise<void>;
    // clearAllData(): Promise<void>;

    // 실시간 리스너 관리
    startListener<T>(path: string, callback: (data: T) => void): void;
    stopListener(path: string): void;

    // 클라이언트 관리
    registerClient(): Promise<void>;
    unregisterClient(): Promise<void>;
    isAnyOtherClientActive(): Promise<boolean>;

    // 다중 클라이언트 스트림 관리
    startClientsListener(callback: (clients: Record<string, Client>) => void): void;
    stopClientsListener(): void;
    handleClientsChange(): Promise<void>;
}