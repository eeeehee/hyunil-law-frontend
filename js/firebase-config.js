// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// [추가된 부분] 스토리지(파일저장소) 라이브러리 가져오기
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCuj5nd8P3lAMwrdxXtZOrWAtC69CYBNdw",
    authDomain: "corporatehyunillaw.firebaseapp.com",
    projectId: "corporatehyunillaw",
    storageBucket: "corporatehyunillaw.firebasestorage.app",
    messagingSenderId: "693639965402",
    appId: "1:693639965402:web:c5c4b22fb5bd50a39b53e3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// [추가된 부분] 스토리지 초기화
const storage = getStorage(app);

// storage도 같이 내보내기
export { auth, db, storage };