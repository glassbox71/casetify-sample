import { sendPasswordResetEmail, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { create } from "zustand";
import { auth, db, googleProvider, kakaoProvider, naverProvider } from "../firebase/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { persist, createJSONStorage } from "zustand/middleware";
import {
    deleteUser as firebaseDeleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword
} from "firebase/auth";
import { items as finalData } from "../data/finalData";

export const useAuthStore = create(
    persist((set, get) => ({
        // 로그인, 회원가입
        user: null,

        // firebase 로그인 (앱 최초 실행)
        // 자동로그인 방지
        initAuth: () => {
            onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    const userDocRef = doc(db, "users", firebaseUser.uid);
                    const userSnap = await getDoc(userDocRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        set({ user: userData });
                    }
                } else {
                    set({ user: null });
                }
            })
        },

        // 회원가입
        onMember: async ({ username, email, password, phone, birthDate, zonecode, address, detailaddress }) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log(userCredential);
                const user = userCredential.user;

                // 인증 메일 보내기
                await sendEmailVerification(user);

                // Firestore에 저장하기
                // 1단계 - 저장위치 지정 doc(db정보, "컬렉션", 문서)
                const userRef = doc(db, "users", user.uid);

                const year = birthDate.getFullYear();
                const month = String(birthDate.getMonth() + 1).padStart(2, '0');
                const day = String(birthDate.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;

                // 2단계 - 저장할 사용자 정보 만들기
                const userInfo = {
                    uid: user.uid,
                    name: username,
                    email,
                    phone,
                    birthDate: dateString,
                    zonecode,
                    address,
                    detailaddress,
                    point: 0,
                    isFirstLogin: true
                }

                // 3단계 - firestore에 데이터 저장
                await setDoc(userRef, userInfo);

                // 4단계 - zustand에 상태저장
                set({ user: userInfo });
                return true;
            } catch (err) {
                // alert(err.message);
                return err.code;
            }
        },

        // 이메일로그인
        onLogin: async (email, password) => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                // console.log(userCredential);
                const user = userCredential.user;

                if (user.emailVerified) {
                    console.log("인증됨")

                    // 첫 로그인 확인
                    const userDocRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userDocRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        const currentMonth = new Date().getMonth() + 1;
                        let updatedCoupons = [...(userData.coupons || [])];
                        let isUpdated = false;

                        // 상태값 추적을 위한 변수
                        let isFirst = false;
                        let isBirthday = false;

                        const userBirthMonth = userData.birthDate
                            ? Number(userData.birthDate.split('-')[1])
                            : null;

                        const { couponList, getOneMonthsLater } = get();

                        // 1. 첫 로그인 확인 및 웰컴 쿠폰 발급
                        if (userData.isFirstLogin) {
                            const welcomeCoupon = { ...couponList.find(c => c.id === "welcome") };
                            welcomeCoupon.limit = getOneMonthsLater();
                            updatedCoupons.push(welcomeCoupon);
                            isUpdated = true;
                            isFirst = true; // 첫 로그인임
                        }

                        // 2. 생일 달 확인 및 생일 쿠폰 발급
                        if (userBirthMonth === currentMonth) {
                            const hasBirthCoupon = updatedCoupons.some(c => c.id === "birth");

                            if (!hasBirthCoupon) {
                                const birthCoupon = { ...couponList.find(c => c.id === "birth") };
                                birthCoupon.limit = getOneMonthsLater();
                                updatedCoupons.push(birthCoupon);
                                isUpdated = true;
                                isBirthday = true;
                            }
                        }

                        // 3. 반환값(return) 결정 로직
                        let loginStatus = true; // 기본값
                        if (isFirst && isBirthday) {
                            loginStatus = "첫로그인생일";
                        } else if (isFirst) {
                            loginStatus = "첫로그인";
                        } else if (isBirthday) {
                            loginStatus = "생일";
                        }

                        if (isUpdated) {
                            await updateDoc(userDocRef, {
                                isFirstLogin: false,
                                coupons: updatedCoupons
                            });
                            set({ user: { ...userData, isFirstLogin: false, coupons: updatedCoupons } });
                            return loginStatus;
                        }

                        set({ user: userData });
                        return true;
                    }
                }
            } catch (err) {
                console.log(err.message);
                return false;
            }
        },

        // 구글로그인
        onGoogleLogin: async () => {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                console.log(result);

                const user = result.user;
                // 데이터 베이스
                const userRef = doc(db, 'users', user.uid);

                // 회원인지 아닌지 체크하기
                const userDoc = await getDoc(userRef);
                if (!userDoc.exists()) {
                    let updatedCoupons = [];
                    const { couponList, getOneMonthsLater } = get();

                    const welcomeCoupon = { ...couponList.find(c => c.id === "welcome") };
                    welcomeCoupon.limit = getOneMonthsLater();
                    updatedCoupons.push(welcomeCoupon);

                    const userInfo = {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName,
                        phone: user.phoneNumber,
                        birthDate: "",
                        zonecode: "",
                        address: "",
                        detailaddress: "",
                        point: 0,
                        provider: 'google',
                        coupons: updatedCoupons
                    }

                    await setDoc(userRef, userInfo);
                    set({ user: userInfo });
                } else {
                    const userData = userDoc.data();
                    const currentMonth = new Date().getMonth() + 1;
                    let updatedCoupons = [...(userData.coupons || [])];

                    let isBirthday = false;

                    const userBirthMonth = userData.birthDate
                        ? Number(userData.birthDate.split('-')[1])
                        : null;

                    const { couponList, getOneMonthsLater } = get();

                    // 2. 생일 달 확인 및 생일 쿠폰 발급
                    if (userBirthMonth === currentMonth) {
                        const hasBirthCoupon = updatedCoupons.some(c => c.id === "birth");

                        if (!hasBirthCoupon) {
                            const birthCoupon = { ...couponList.find(c => c.id === "birth") };
                            birthCoupon.limit = getOneMonthsLater();
                            updatedCoupons.push(birthCoupon);
                            isBirthday = true;
                        }
                    }

                    if (isBirthday) {
                        await updateDoc(userRef, {
                            coupons: updatedCoupons
                        });
                        set({ user: { ...userData, coupons: updatedCoupons } });
                        return "생일";
                    }
                    console.log(user);
                    set({ user: userData });
                }
                return true;
            } catch (err) {
                console.log(err.message);
                return false;
            }
        },

        // 카카오 로그인
        onKakaoLogin: async () => {
            try {
                const kakaoKey = kakaoProvider;
                // 1 카카오 SDK 초기화
                if (!window.Kakao.isInitialized()) {
                    window.Kakao.init(kakaoKey);
                    // console.log(' Kakao SDK 초기화 완료');
                }

                // 2 로그인 요청 (Promise 변환)
                const authObj = await new Promise((resolve, reject) => {
                    window.Kakao.Auth.login({
                        scope: 'profile_nickname, profile_image',
                        success: resolve,
                        fail: reject,
                    });
                });
                // console.log(' 카카오 로그인 성공:', authObj);

                // 3 사용자 정보 요청 (Promise 기반)
                const res = await window.Kakao.API.request({
                    url: '/v2/user/me',
                });
                // console.log(' 카카오 사용자 정보:', res);

                // 4 사용자 정보 가공
                const uid = res.id.toString();

                // 5 Firestore에 저장
                const userRef = doc(db, 'users', uid);
                const userDoc = await getDoc(userRef);

                if (!userDoc.exists()) {
                    let updatedCoupons = [];
                    const { couponList, getOneMonthsLater } = get();

                    const welcomeCoupon = { ...couponList.find(c => c.id === "welcome") };
                    welcomeCoupon.limit = getOneMonthsLater();
                    updatedCoupons.push(welcomeCoupon);

                    const kakaoUser = {
                        uid,
                        email: res.kakao_account?.email || '',
                        name: res.kakao_account.profile?.nickname || '카카오사용자',
                        photoURL: res.kakao_account.profile?.profile_image_url || '',
                        phone: "",
                        birthDate: "",
                        zonecode: "",
                        address: "",
                        detailaddress: "",
                        point: 0,
                        provider: 'kakao',
                        coupons: updatedCoupons
                        // createdAt: new Date(),
                    };

                    await setDoc(userRef, kakaoUser);
                    set({ user: kakaoUser });
                    // console.log(' 신규 카카오 회원 Firestore에 등록 완료');
                } else {
                    const userData = userDoc.data();
                    const currentMonth = new Date().getMonth() + 1;
                    let updatedCoupons = [...(userData.coupons || [])];

                    let isBirthday = false;

                    const userBirthMonth = userData.birthDate
                        ? Number(userData.birthDate.split('-')[1])
                        : null;

                    const { couponList, getOneMonthsLater } = get();

                    // 2. 생일 달 확인 및 생일 쿠폰 발급
                    if (userBirthMonth === currentMonth) {
                        const hasBirthCoupon = updatedCoupons.some(c => c.id === "birth");

                        if (!hasBirthCoupon) {
                            const birthCoupon = { ...couponList.find(c => c.id === "birth") };
                            birthCoupon.limit = getOneMonthsLater();
                            updatedCoupons.push(birthCoupon);
                            isBirthday = true;
                        }
                    }

                    if (isBirthday) {
                        await updateDoc(userRef, {
                            coupons: updatedCoupons
                        });
                        set({ user: { ...userData, coupons: updatedCoupons } });
                        return "생일";
                    }
                    set({ user: userData });
                }
                // alert(`${kakaoUser.nickname}님, 카카오 로그인 성공! `);
                // if (navigate) navigate('/dashboard');
                return true;
            } catch (err) {
                console.error(' 카카오 로그인 중 오류:', err);
                // alert('카카오 로그인 실패: ' + err.message);
                return false;
            }
        },

        // 네이버 로그인 로직 (카카오 로그인 코드와 비슷한 구조)
        onNaverLogin: async () => {
            try {
                // 1. 네이버 로그인 팝업 열기
                const clientId = naverProvider;
                const callbackUrl = encodeURIComponent("http://localhost:5173/login/naver");
                const state = "random_string";
                const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${callbackUrl}&state=${state}`;

                // 1. 팝업 오픈
                const popup = window.open(naverLoginUrl, 'naverlogin', 'width=600,height=700');
                // 2. 팝업에서 토큰 받아오기
                const token = await new Promise((resolve, reject) => {
                    const handleMessage = (e) => {
                        // 보안을 위해 origin 확인
                        if (e.origin !== window.location.origin) return;

                        window.removeEventListener('message', handleMessage);
                        resolve(e.data.token);
                    };
                    window.addEventListener('message', handleMessage);
                });

                // 3. 사용자 정보 요청 (네이버 API)
                const res = await fetch('/v1/nid/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                const userInfo = data.response;

                // 4. 데이터 가공 및 Firestore 저장
                const uid = `naver_${userInfo.id}`;

                const userRef = doc(db, 'users', uid);
                const userDoc = await getDoc(userRef);
                if (!userDoc.exists()) {
                    let updatedCoupons = [];
                    const { couponList, getOneMonthsLater } = get();

                    const welcomeCoupon = { ...couponList.find(c => c.id === "welcome") };
                    welcomeCoupon.limit = getOneMonthsLater();
                    updatedCoupons.push(welcomeCoupon);

                    const naverUser = {
                        uid,
                        email: userInfo.email,
                        name: userInfo.name,
                        photoURL: userInfo.profile_image,
                        phone: "",
                        birthDate: "",
                        zonecode: "",
                        address: "",
                        detailaddress: "",
                        point: 0,
                        provider: 'naver',
                        coupons: updatedCoupons
                    };
                    await setDoc(userRef, naverUser);
                    set({ user: naverUser });
                }else{
                    const userData = userDoc.data();
                    const currentMonth = new Date().getMonth() + 1;
                    let updatedCoupons = [...(userData.coupons || [])];

                    let isBirthday = false;

                    const userBirthMonth = userData.birthDate
                        ? Number(userData.birthDate.split('-')[1])
                        : null;

                    const { couponList, getOneMonthsLater } = get();

                    // 2. 생일 달 확인 및 생일 쿠폰 발급
                    if (userBirthMonth === currentMonth) {
                        const hasBirthCoupon = updatedCoupons.some(c => c.id === "birth");

                        if (!hasBirthCoupon) {
                            const birthCoupon = { ...couponList.find(c => c.id === "birth") };
                            birthCoupon.limit = getOneMonthsLater();
                            updatedCoupons.push(birthCoupon);
                            isBirthday = true;
                        }
                    }

                    if (isBirthday) {
                        await updateDoc(userRef, {
                            coupons: updatedCoupons
                        });
                        set({ user: { ...userData, coupons: updatedCoupons } });
                        return "생일";
                    }
                    set({ user: userData });
                }
                return true;
            } catch (err) {
                console.error('네이버 로그인 오류:', err);
                return false;
            }
        },

        // 로그아웃
        onLogout: async () => {
            try {
                await signOut(auth);
                set({ user: null, cart: [] });
                return true;
            } catch (err) {
                console.error('로그아웃 오류:', err);
                return false;
            }
        },

        // 아이디찾기
        onFindId: async (formdata) => {
            try {
                const { username, phone, birthDate } = formdata;
                const usersRef = collection(db, 'users');

                const year = birthDate.getFullYear();
                const month = String(birthDate.getMonth() + 1).padStart(2, '0');
                const day = String(birthDate.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;

                const q = query(
                    usersRef,
                    where("name", "==", username),
                    where("phone", "==", phone),
                    where("birthDate", "==", dateString)
                );
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    return false;
                }

                // 일치하는 첫 번째 계정의 이메일 가져오기
                const userData = querySnapshot.docs[0].data();
                return userData.email;

            } catch (error) {
                return false;
            }
        },
        // 비밀번호 찾기
        onFindPass: async (formdata) => {
            try {
                const { username, email, phone, birthDate } = formdata;
                const usersRef = collection(db, 'users');

                const year = birthDate.getFullYear();
                const month = String(birthDate.getMonth() + 1).padStart(2, '0');
                const day = String(birthDate.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;

                const q = query(
                    usersRef,
                    where("name", "==", username),
                    where("email", "==", email),
                    where("phone", "==", phone),
                    where("birthDate", "==", dateString)
                );
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    return false;
                }

                await sendPasswordResetEmail(auth, email);
                return true;
            } catch (error) {
                console.log(error.message);
                return error.code;
            }
        },
        // 현재 날짜로부터 1개월 뒤의 날짜를 "YYYY년MM월DD일" 형식으로 반환
        getOneMonthsLater: () => {
            const now = new Date();
            now.setMonth(now.getMonth() + 1); // 1개월 추가

            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();

            return `${year}년 ${month}월 ${day}일`;
        },
        getThreeMonthsLater : () => {
            const now = new Date();
            now.setMonth(now.getMonth() + 3); // 3개월 추가

            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();

            return `${year}년 ${month}월 ${day}일`;
        },
        // 기본쿠폰
        couponList: [
            {
                id: "welcome",
                rate: 15,
                title: "CASETiFY 클럽 웰컴 쿠폰",
                limit: "",
                use: true
            },
            {
                id: "birth",
                rate: 100,
                title: "생일 기념 무료 케이스",
                limit: "",
                use: true
            },
            {
                id: "bronze",
                rate: 15,
                title: "CASETiFY 클럽 브론즈 쿠폰",
                limit: "",
                use: true
            },
            {
                id: "silver",
                rate: 20,
                title: "CASETiFY 클럽 실버 쿠폰",
                limit: "",
                use: true
            },
            {
                id: "gold",
                rate: 30,
                title: "CASETiFY 클럽 골드 쿠폰",
                limit: "",
                use: true
            },
            {
                id: "auth",
                rate: 5,
                title: "정품인증 감사 쿠폰",
                limit: "",
                use: true
            }
        ],
        getOneYearLater: () => {
            const now = new Date();
            now.setFullYear(now.getFullYear() + 1);
            return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
        },

        // 정품인증 + 쿠폰 발급
        onAuthenticate: async (serialNumber) => {
            // 1. 필요한 상태값 가져오기 (orderList 추가)
            const { user, couponList, orderList, getThreeMonthsLater } = get();

            if (!user) return "login";
            if (!serialNumber.trim()) return "empty";

            // 2. 주문 내역(orderList)에서 일련번호(아이템 id) 일치 확인
            // orderList 내부의 각 order 객체 안에 있는 items 배열을 모두 뒤집니다.
            const allOrderedItems = orderList.flatMap(order => order.orderItems);
            const matched = allOrderedItems.find(item => String(item.productId) === serialNumber.trim());

            // 만약 구매한 내역 중에 해당 id가 없다면 실패 반환
            if (!matched) return "fail";

            try {
                const userDocRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userDocRef);
                const userData = userSnap.data();

                const currentCoupons = userData.coupons || [];

                // 3. 이미 정품인증 쿠폰을 받은 적 있는지 확인
                const alreadyAuth = currentCoupons.some(c => c.id === "auth" && c.use === true);
                if (alreadyAuth) return "already";

                // 4. 쿠폰 발급 로직
                const authTemplate = couponList.find(c => c.id === "auth");
                if (!authTemplate) return "error"; // 템플릿이 없는 경우 예외 처리

                const authCoupon = { 
                    ...authTemplate,
                    limit: getThreeMonthsLater(), // 유효기간 설정
                    use: true // 사용 가능 상태로 추가
                };
                
                const updatedCoupons = [...currentCoupons, authCoupon];

                // 5. DB 및 로컬 상태 업데이트
                await updateDoc(userDocRef, { coupons: updatedCoupons });
                set({ user: { ...user, coupons: updatedCoupons } });

                return "success";
            } catch (err) {
                console.error("정품인증 처리 중 오류:", err.message);
                return "error";
            }
        },

        // 기프트카드
        giftCardList: [
            {
                code: "0000020000",
                price: 20000,
                limit: "",
                use: true
            },
            {
                code: "0000050000",
                price: 50000,
                limit: "",
                use: true
            },
            {
                code: "0000080000",
                price: 80000,
                limit: "",
                use: true
            },
            {
                code: "0000100000",
                price: 100000,
                limit: "",
                use: true
            },
            {
                code: "0000150000",
                price: 150000,
                limit: "",
                use: true
            }
        ],
        registerGiftCard: async (cardCode) => {
            const { user, giftCardList, getOneYearLater } = get();
            if (!user) return;

            // 1. 일련번호와 일치하는 기프트 카드 정보 찾기
            const matchedCard = giftCardList.find(c => c.code === cardCode);

            if (!matchedCard) {
                return "코드";
            }

            try {
                // 2. 새 카드 객체 생성
                const currentGiftCards = user.giftCard || [];
                const newCard = {
                    // ID를 현재 등록된 카드 개수 + 1로 설정 (순서대로)
                    id: currentGiftCards.length + 1,
                    title: "기프트 카드 충전",
                    price: matchedCard.price, // 일치하는 카드의 실제 가격 적용
                    cardCode: cardCode,
                    limit: getOneYearLater(), // 등록일로부터 1년
                    use: true
                };

                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, {
                    giftCard: arrayUnion(newCard)
                });

                // 3. 스토어 상태 업데이트
                set((state) => ({
                    user: {
                        ...state.user,
                        giftCard: [...currentGiftCards, newCard]
                    }
                }));

                return true;
            } catch (error) {
                console.log("기프트 카드 등록 에러:", error.message);
                return false;
            }
        },

        // 위시리스트
        wishlist: [],
        // 위시리스트 추가
        onAddWishlist: async (wishItem) => {
            const user = get().user;

            const productData = {
                productId: wishItem.id,
                device: wishItem.device,
                color: wishItem.color,
                title: wishItem.productName,
                price: wishItem.price,
                imgUrl: wishItem.imgUrl,
                caseCategory: wishItem.caseCategory
            };

            try {
                const userWishRef = doc(db, "wishlists", user.uid);
                const currentWishlist = get().wishlist;

                // 1. 이미 존재하는지 확인 (productId 기준)
                const existingItemIndex = currentWishlist.findIndex(item =>
                    item.productId === wishItem.id &&
                    item.device === wishItem.device &&
                    item.color === wishItem.color
                );
                // const isExisted = currentWishlist.some(item => item.productId === wishItem.id);

                if (existingItemIndex > -1) {
                    // 2. 삭제 처리
                    await setDoc(userWishRef, {
                        items: arrayRemove(productData)
                    }, { merge: true });

                    const updatedList = currentWishlist.filter((_, index) => index !== existingItemIndex);
                    set({ wishlist: updatedList });
                    return "del";
                } else {
                    // 3. 추가 처리
                    await setDoc(userWishRef, {
                        items: arrayUnion(productData)
                    }, { merge: true });
                    set({ wishlist: [...currentWishlist, productData] });
                    return "add";
                }
            } catch (err) {
                console.log(err.message);
                return false;
            }
        },
        // 위시리스트 삭제
        onRemoveWishlist: async (targetItem) => {
            const user = get().user;
            const currentWishlist = get().wishlist;
            const userWishRef = doc(db, "wishlists", user.uid);

            try {
                await updateDoc(userWishRef, {
                    items: arrayRemove(targetItem)
                });

                const updatedList = currentWishlist.filter(item =>
                    !(item.productId === targetItem.productId &&
                        item.device === targetItem.device &&
                        item.color === targetItem.color)
                );
                set({ wishlist: updatedList });
                return true;
            } catch (err) {
                console.log(err.message);
                return false;
            }
        },
        // 위시리스트 가져오기
        onFetchWishlist: async () => {
            const user = get().user; // 현재 로그인된 유저 정보
            if (!user) return;

            try {
                const userWishRef = doc(db, "wishlists", user.uid);
                const docSnap = await getDoc(userWishRef);

                if (docSnap.exists()) {
                    // 문서가 있으면 그 안의 items 배열을 저장
                    set({ wishlist: docSnap.data().items || [] });
                } else {
                    // 문서 자체가 없으면 빈 배열
                    set({ wishlist: [] });
                }
            } catch (err) {
                console.log("위시리스트 로딩 실패:", err.message);
            }
        },

        // 장바구니
        cart: [],
        checkedCart: [],
        // 장바구니 결제할 것만
        onUpdateCheckedCart: (items) => {
            set({ checkedCart: items });
        },
        // 장바구니 가져오기
        onFetchCart: async () => {
            const user = get().user;
            if (!user) return;

            try {
                const cartRef = doc(db, "carts", user.uid);
                const snap = await getDoc(cartRef);

                if (snap.exists()) {
                    set({ cart: snap.data().items });
                } else {
                    set({ cart: [] });
                }
            } catch (err) {
                console.log(err.message);
            }
        },
        // 장바구니 추가
        onAddToCart: async (product) => {
            const { user, cart } = get();
            if (!user) return;

            const currentCart = [...get().cart];

            // 동일 상품(아이디 + 옵션까지 같은지) 찾기
            const existingItemIndex = currentCart.findIndex(item =>
                item.productId === product.id &&
                item.device === product.device &&
                item.color === product.color
            );

            if (existingItemIndex > -1) {
                // 이미 있다면 수량만 증가
                currentCart[existingItemIndex].quantity += 1;
            } else {
                // 없다면 새로 추가
                currentCart.push({
                    productId: product.id,
                    title: product.productName,
                    price: product.price,
                    imgUrl: product.imgUrl,
                    device: product.device,
                    deviceKey: product.deviceKey,
                    color: product.color,
                    imgUrl: product.imgUrl,
                    colorList: product.colorList,
                    deviceList: product.deviceList,
                    isPhone: product.isPhone,
                    isWish: product.isWish,
                    deviceBrand: product.deviceBrand,
                    caseCategory: product.caseCategory,
                    quantity: 1
                });
            }

            // DB 업데이트
            try {
                const cartRef = doc(db, "carts", user.uid);
                await setDoc(cartRef, { items: currentCart }, { merge: true });
                set({ cart: currentCart }); // 로컬 스토어 동기화
                return true;
            } catch (e) {
                console.log(e.message);
                return false;
            }
        },
        //장바구니 옵션 업데이트
        onUpdateOption: async (oldItem, newModel, newColor, newDeviceKey) => {
            const { user, cart } = get();
            if (!user) return;

            let currentCart = [...cart];

            // 1. 기존 아이템 제거
            // 식별 기준: productId + 기존 device + 기존 color
            const targetIndex = currentCart.findIndex(item =>
                item.productId === oldItem.productId &&
                item.device === oldItem.device &&
                item.color === oldItem.color
            );

            if (targetIndex === -1) return; // 수정 대상 못 찾으면 종료

            const updatedItem = {
                ...currentCart[targetIndex],
                device: newModel,
                deviceKey: newDeviceKey,
                color: newColor
            };

            // 기존 위치 아이템 삭제
            currentCart.splice(targetIndex, 1);

            // 2. 새로운 옵션이 이미 장바구니에 있는지 확인 (중복 체크)
            const existingItemIndex = currentCart.findIndex(item =>
                item.productId === updatedItem.productId &&
                item.device === updatedItem.device &&
                item.color === updatedItem.color
            );

            if (existingItemIndex > -1) {
                // 이미 동일 옵션 상품이 있다면 수량 합치기
                currentCart[existingItemIndex].quantity += updatedItem.quantity;
            } else {
                // 없다면 수정된 아이템을 해당 위치 또는 끝에 삽입
                currentCart.splice(targetIndex, 0, updatedItem);
            }

            // 3. DB 및 로컬 스토어 업데이트
            try {
                const cartRef = doc(db, "carts", user.uid);
                await setDoc(cartRef, { items: currentCart }, { merge: true });
                set({ cart: currentCart });
            } catch (e) {
                console.error("옵션 업데이트 실패:", e.message);
            }
        },
        // 장바구니 수량변경
        updateQuantity: async (index, amount) => {
            const newCart = [...get().cart];
            newCart[index].quantity += amount;

            // 수량이 0 이하면 삭제 처리하거나 1로 고정
            if (newCart[index].quantity < 1) return;

            const user = get().user;
            await setDoc(doc(db, "carts", user.uid), { items: newCart }, { merge: true });
            set({ cart: newCart });
        },
        // 장바구니 선택 삭제
        onRemoveSelected: async (selectedItems) => {
            const { user, cart } = get();
            if (!user) return;

            // selectedItems에 포함되지 않은 아이템들만 남기기
            const updatedCart = get().cart.filter(cartItem =>
                !selectedItems.some(selected =>
                    selected.productId === cartItem.productId &&
                    selected.device === cartItem.device &&
                    selected.color === cartItem.color
                )
            );

            try {
                const cartRef = doc(db, "carts", user.uid);
                await setDoc(cartRef, { items: updatedCart }, { merge: true });
                set({ cart: updatedCart });
            } catch (e) {
                console.log("일괄 삭제 실패:", e.message);
            }
        },
        // 장바구니 전체 비우기
        onClearCart: async () => {
            const user = get().user;
            if (!user) return;

            try {
                const cartRef = doc(db, "carts", user.uid);
                await setDoc(cartRef, { items: [] }, { merge: true });
                set({ cart: [] });
            } catch (e) {
                console.log("장바구니 비우기 실패:", e.message);
            }
        },

        orderList: [],
        // 주문정보저장
        onAddOrder: async (orderData) => {
            const { user, orderList, couponList, getThreeMonthsLater, cart } = get();
            if (!user) return;

            // 결제 시 사용할 총 기프트 카드 금액
            let remainingToPay = orderData.priceSummary.giftCard || 0;

            // 유저가 보유한 기프트 카드 복사 (원본 보존을 위해 spread 사용)
            let updatedGiftCards = [...(user.giftCard || [])];

            // 1. 유효기간(limit)이 가까운 순서대로 정렬 (오름차순)
            // 날짜 문자열이 'YYYY. MM. DD.' 형식이라면 Date 객체로 변환하여 비교
            updatedGiftCards.sort((a, b) => new Date(a.limit) - new Date(b.limit));

            // 2. 금액 차감 로직 (사용 가능한 카드만 대상)
            updatedGiftCards = updatedGiftCards.map(card => {
                if (remainingToPay <= 0 || !card.use) return card;

                if (card.price > remainingToPay) {
                    // 카드의 잔액이 결제할 금액보다 많은 경우
                    const newPrice = card.price - remainingToPay;
                    remainingToPay = 0;
                    return { ...card, price: newPrice };
                } else {
                    // 카드의 잔액이 결제할 금액보다 적거나 같은 경우 (전액 소진)
                    remainingToPay -= card.price;
                    return { ...card, price: 0, use: false };
                }
            });
            // console.log(updatedGiftCards);

            // 2. 쿠폰 사용 처리 로직
            const { coupon } = orderData.priceSummary;
            let updatedCoupons = [...(user.coupons || [])];

            if (coupon && coupon.id) {
                updatedCoupons = updatedCoupons.map(c => {
                    // 사용자가 결제 시 선택한 쿠폰의 ID와 일치하는 쿠폰을 찾아 상태 변경
                    if (c.id === coupon.id) {
                        return { ...c, use: false };
                    }
                    return c;
                });
            }

            // 1. 기존 주문 목록에 새 주문 추가
            const updatedOrders = [...(orderList || []), orderData];

            let currentPoint = user.point || 0;
            const totalPrice = orderData.priceSummary.totalPrice || 0; // 전체 결제 금액 기준

            // A. 금액별 포인트 가산
            const earnedPoint = Math.floor(totalPrice / 1000);
            currentPoint += earnedPoint;

            let upgradeMessage = "";
            const rewardMilestones = [{point: 50, label: 'bronze'}, {point: 120, label: 'silver'}, {point: 200, label: 'gold'}];
    
            // 이전 포인트는 달성 못했지만, 새 포인트가 마일스톤을 넘었을 때 발급
            rewardMilestones.forEach(milestone => {
                const oldPoint = user.point || 0;
                if (oldPoint < milestone.point && currentPoint >= milestone.point) {
                    const newCoupon = { ...couponList.find(c => c.id === milestone.label) };
                    newCoupon.limit = getThreeMonthsLater();
                    updatedCoupons.push(newCoupon);
                    upgradeMessage = milestone.label;
                }
            });

            try {
                // A. 주문 내역 저장
                const orderRef = doc(db, "orders", user.uid);
                const orderSnap = await getDoc(orderRef);
                
                let existingOrders = [];
                if (orderSnap.exists()) {
                    existingOrders = orderSnap.data().orderList || [];
                }
        
                // 가져온 실제 주문 목록 뒤에 새 주문 추가
                const updatedOrders = [...existingOrders, orderData];
                await setDoc(orderRef, { orderList: updatedOrders }, { merge: true });

                // B. 유저 정보 업데이트 (기프트 카드 배열 & 쿠폰 배열 전체 업데이트)
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    giftCard: updatedGiftCards,
                    coupons: updatedCoupons,
                    point: currentPoint
                });

                // C. 장바구니 비우기
                // 현재 장바구니에서 주문한 상품(orderItems)을 제외한 나머지만 추출
                let currentCart = [...cart];
                const remainingItems = currentCart.filter(cartItem => {
                    // 주문한 상품들 중에 현재 장바구니 아이템과 id, color, device가 모두 일치하는 게 있는지 확인
                    const isOrdered = orderData.orderItems.some(orderItem => 
                        orderItem.id === cartItem.id && 
                        orderItem.color === cartItem.color && 
                        orderItem.device === cartItem.device
                    );
                    // 일치하지 않는 것(주문 안 한 것)만 남김
                    return !isOrdered;
                });

                // DB 업데이트
                const cartRef = doc(db, "carts", user.uid);
                await setDoc(cartRef, { items: remainingItems }, { merge: true });

                // D. 로컬 상태 업데이트
                set({
                    orderList: updatedOrders,
                    cart: remainingItems,
                    checkedCart: [],
                    user: { 
                        ...user, 
                        giftCard: updatedGiftCards,
                        coupons: updatedCoupons,
                        point: currentPoint
                    }
                });

                if(upgradeMessage !== ""){
                    return upgradeMessage;
                } 
                return true;
            } catch (e) {
                console.log("결제 저장 실패:", e.message);
                return false;
            }
        },
        onFetchOrder: async () => {
            const user = get().user;
            if (!user) return;

            try {
                const orderRef = doc(db, "orders", user.uid);
                const snap = await getDoc(orderRef);

                if (snap.exists()) {
                    const remoteOrderList = snap.data().orderList || [];
                    const today = new Date();
                    let isChanged = false;

                    const updatedOrderList = remoteOrderList.map((order) => {
                        // 주문일로부터 경과일 (배송 상태용)
                        const orderDate = new Date(Number(order.orderId));
                        // (현재시간 - 주문시간)을 '분'으로 계산
                        const minutesSinceOrder = Math.floor((today - orderDate) / (1000 * 60));

                        // 1. 대표 주문 상태 업데이트 (1분 -> 배송중, 2분 -> 배송완료)
                        let newOrderStatus = order.orderStatus;
                        if (!['취소완료', '교환/반품완료', '취소/반품'].includes(order.orderStatus)) {
                            if (minutesSinceOrder >= 2 && order.orderStatus !== "배송완료") {
                                newOrderStatus = "배송완료";
                                isChanged = true;
                            } else if (minutesSinceOrder >= 1 && order.orderStatus === "배송준비중") {
                                newOrderStatus = "배송중";
                                isChanged = true;
                            }
                        }

                        // 2. 아이템별 상태 업데이트 (1분 경과 시 상태 변경)
                        const updatedItems = order.orderItems.map(item => {
                            if (item.statusDate) {
                                const statusDate = item.statusDate.toDate ? item.statusDate.toDate() : new Date(item.statusDate);
                                // (현재시간 - 상태변경시간)을 '분'으로 계산
                                const diffMinutesFromStatus = Math.floor((today - statusDate) / (1000 * 60));

                                // 취소중(1) -> 취소완료(2) 1분 경과 시
                                if (item.status === 1 && diffMinutesFromStatus >= 1) {
                                    isChanged = true;
                                    return { ...item, status: 2 };
                                }
                                // 교환/반품중(3) -> 교환/반품완료(4) 1분 경과 시
                                if (item.status === 3 && diffMinutesFromStatus >= 1) {
                                    isChanged = true;
                                    return { ...item, status: 4 };
                                }
                            }
                            return item;
                        });

                        return { ...order, orderStatus: newOrderStatus, orderItems: updatedItems };
                    });

                    updatedOrderList.sort((a, b) => Number(b.orderId) - Number(a.orderId));
                    // 변경사항이 있을 때만 서버 업데이트
                    if (isChanged) {
                        await updateDoc(orderRef, { orderList: updatedOrderList });
                    }

                    set({ orderList: updatedOrderList });
                }
            } catch (err) {
                console.log(err.message);
            }
        },
        onUpdateItemStatus: async (orderId, checkedIndices, isCancelable) => {
            const user = get().user;
            if (!user) return;

            try {
                const orderList = get().orderList;
                const newStatus = isCancelable ? 1 : 3; // 취소가능하면 1(취소중), 아니면 3(반품중)
                const now = new Date(); // Date 객체 그대로 생성

                // 전체 주문 리스트에서 해당 주문을 찾아 아이템 상태 업데이트
                const updatedOrderList = orderList.map((order) => {
                    if (order.orderId === orderId) {
                        const updatedItems = order.orderItems.map((item, idx) => {
                            if (checkedIndices.includes(idx)) {
                                return { ...item, status: newStatus, statusDate: now };
                            }
                            return item;
                        });
                        // 모든 아이템이 취소/반품 상태인지 확인
                        const isAllProcessed = updatedItems.every(item => item.status && item.status > 0);
                        return {
                            ...order,
                            orderItems: updatedItems,
                            orderStatus: isAllProcessed ? "취소/반품" : order.orderStatus // 모두 처리됐으면 상태 변경
                        };
                    }
                    return order;
                });

                // 1. Firebase Firestore 업데이트
                const orderRef = doc(db, "orders", user.uid);
                await updateDoc(orderRef, { orderList: updatedOrderList });

                // 2. Zustand 상태 업데이트
                set({ orderList: updatedOrderList });

                console.log(isCancelable ? "주문 취소 신청이 완료되었습니다." : "반품/교환 신청이 완료되었습니다.");
                return true;
            } catch (err) {
                console.log("업데이트 실패:", err.message);
                return false;
            }
        },
        onUpdateAllItemsStatus: async (orderId, isCancelable) => {
            const user = get().user;
            if (!user) return;

            try {
                const orderList = get().orderList;
                const newStatus = isCancelable ? 1 : 3; // 아이템 상태 코드
                const now = new Date();

                const updatedOrderList = orderList.map((order) => {
                    if (order.orderId === orderId) {
                        // 1. 모든 아이템의 상태와 날짜 변경
                        const updatedItems = order.orderItems.map((item) => ({
                            ...item,
                            status: newStatus,
                            statusDate: now,
                        }));

                        // 2. 💡 전체 주문 상태를 "취소/반품"으로 변경
                        return {
                            ...order,
                            orderStatus: "취소/반품",
                            orderItems: updatedItems
                        };
                    }
                    return order;
                });

                // Firebase 업데이트
                const orderRef = doc(db, "orders", user.uid);
                await updateDoc(orderRef, { orderList: updatedOrderList });

                // Zustand 상태 반영
                set({ orderList: updatedOrderList });

                console.log(isCancelable ? "전체 주문이 취소되었습니다." : "전체 상품의 반품 신청이 완료되었습니다.");
                return true;
            } catch (err) {
                console.log("전체 업데이트 실패:", err);
                return false;
            }
        },
        // 회원정보 수정
        onUpdateUser: async (formData) => {
            try {
                const user = get().user;
                if (!user) return false;

                const userRef = doc(db, "users", user.uid);

                // birthDate 변환
                let birthDateString = '';
                if (formData.birthDate instanceof Date) {
                    const year = formData.birthDate.getFullYear();
                    const month = String(formData.birthDate.getMonth() + 1).padStart(2, '0');
                    const day = String(formData.birthDate.getDate()).padStart(2, '0');
                    birthDateString = `${year}-${month}-${day}`;
                } else {
                    birthDateString = formData.birthDate || '';
                }

                await updateDoc(userRef, {
                    name: formData.name,
                    phone: formData.phone,
                    zonecode: formData.zonecode,
                    address: formData.address,
                    detailaddress: formData.detailaddress,
                    birthDate: birthDateString
                });

                set({
                    user: {
                        ...user,
                        ...formData,
                        birthDate: birthDateString  // zustand에도 문자열로 저장
                    }
                });

                return true;
            } catch (err) {
                console.log(err.message);
                return false;
            }
        },
        handleChangePassword: async (passwordData) => {
            // console.log("받은 passwordData:", passwordData); // 확인용
            const user = auth.currentUser;
            // console.log("현재 user:", user); // 확인용

            // if (!user) {
            //     alert("로그인이 필요합니다");
            //     return false;
            // }
            if (!user) return "no-user";

            // if (passwordData.newPassword !== passwordData.confirmPassword) {
            //     alert("비밀번호가 일치하지 않습니다");
            //     return false;
            // }

            if (passwordData.newPassword !== passwordData.confirmPassword) return "password-mismatch";

            try {
                const credential = EmailAuthProvider.credential(
                    user.email,
                    passwordData.currentPassword
                );
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, passwordData.newPassword);
                console.log("sss", passwordData.newPassword);
                console.log("aaa", passwordData.confirmPassword);
                console.log("fff", passwordData.currentPassword);
                return true;
            } catch (err) {
                console.log(err.code);
                return err.code;
            }
        },
        // 계정 삭제
        onDeleteUser: async () => {
            try {
                const user = get().user;
                const currentUser = auth.currentUser;

                if (!user || !currentUser) return false;

                // 1. Auth 계정 삭제
                await firebaseDeleteUser(currentUser);

                // 2. Firestore 데이터 삭제
                const userRef = doc(db, "users", user.uid);
                await deleteDoc(userRef);

                // 3. 상태 초기화
                set({ user: null });

                return true;
            } catch (err) {
                console.log(err.message);
                return err.code;
            }
        },
    }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                user: state.user ? {
                    uid: state.user.uid,
                    provider: state.user.provider,
                } : null,
                checkedCart: state.checkedCart
            })
        }
    ));