// firebase앱을 초기화하는 함수
import { initializeApp } from "firebase/app";
// getAuth - 인증시스템 생성
// GoogleAuthProvider - 구글 로그인 기능 제공
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// 데이터베이스 -> json형태로 저장
import { getFirestore } from "firebase/firestore";
// 파일저장소 - 이미지, 영상, 파일업로드
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// 데이터베이스 연결
// 상품 저장, 주문데이터 저장
export const db = getFirestore(app);
// 파일업로드용, 상품 이미지 등록 ...
export const storage = getStorage(app);

export const kakaoProvider = import.meta.env.VITE_KAKAO_API_KEY;
export const naverProvider = import.meta.env.VITE_NAVER_CLIENT_ID;