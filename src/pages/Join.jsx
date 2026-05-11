import React, { useState } from 'react'
import "./scss/Login.scss"
import SectionTitle from '../components/SectionTitle'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import AddressSearch from '../components/sub/AddressSearch'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import Terms from '../components/Terms'
import CasetifyClubTerms from '../components/CasetifyClubTerms'
import Privacy from '../components/Privacy'
import Marketing from '../components/Marketing'
import { motion } from 'framer-motion';

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Join() {
    const {onMember} = useAuthStore();
    const navigate = useNavigate();
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        passwordcon: "",
        phone: "",
        birthDate: "",
        zonecode: "",
        address: "",
        detailaddress: ""
    });

    const [birthErr, setBirthErr] = useState('');
    const [joinErr, setJoinErr] = useState("");
    const [joinAllErr, setJoinAllErr] = useState({
        username: "",
        email: "",
        password: "",
        passwordcon: "", 
        phone: ""
    });
    const [touched, setTouched] = useState({
        username: false,
        email: false,
        password: false,
        passwordcon: false, 
        phone: false
    });

    const [agreements, setAgreements] = useState({
        agree: false,
        security: false,
        market: false
    });
    
    const setAddressData = (data) => {
        setFormData((prev) => ({
        ...prev,
        zonecode: data.zonecode,
        address: data.address,
        }));
    };

    // 각각 입력한 input요소를 name속성으로 찾아서 값 변경시키기
    const handleChange = (e)=>{
        const {name, value} = e.target;
        // console.log(name, value);
        setFormData({...formData, [name]:value});

        // 검증 결과 업데이트
        const error = validate(name, value);
        setJoinAllErr(prev => ({ ...prev, [name]: error }));
    }

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            birthDate: date
        }));
    };

    const handleBlur = (e) => {
        // 입력창에서 나가는 순간, 해당 필드를 '터치'한 것으로 간주
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    // 실시간 검증 로직
    const validate = (name, value) => {
        let error = '';
        if (name === 'username') {
            if (!value || value.trim() === '') error = '필수 입력 항목입니다.';
        }
        if (name === 'email'){
            if(!value.includes('@') || !value || value.trim() === '') error = '이메일 형식이 올바르지 않습니다.';
        }
        if (name === 'phone'){
            const numberRegex = /^[0-9]+$/;
            if(!numberRegex.test(value) || value.includes('-') || !value || value.trim() === '') error = '-없이 숫자만 입력해주세요.';
        }
        if (name === 'password') {
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/;
            if (!passwordRegex.test(value) || !value || value.trim() === '') error = '영문, 숫자를 포함한 6~12자로 입력해주세요.';
        }
        if (name === 'passwordcon'){
            if (formData.password !== value || !value || value.trim() === '') error = '비밀번호가 일치하지 않습니다.';
        }
        return error;
    };

    const handleCheckboxChange = (e) => {
        const { id, checked } = e.target;
        setAgreements(prev => ({
            ...prev,
            [id]: checked
        }));
    };

    // 회원가입 전송
    const handleSubmit = async(e)=>{
        e.preventDefault();

        // 제출 시 최종 검증 (모든 필드에 대해)
        const newErrors = {};
        Object.keys(formData).forEach(key => {
        newErrors[key] = validate(key, formData[key]);
        });
        setJoinAllErr(newErrors);

        const allTouched = {
            username: true,
            email: true,
            password: true,
            passwordcon: true, 
            phone: true
        };
        setTouched(allTouched);

        // 에러가 하나도 없는지 확인
        let isFormValid = Object.values(newErrors).every(err => err === '');

        if(!formData.birthDate){
            setBirthErr("필수 입력 항목입니다.")
            isFormValid = false;
        }

        if(!isFormValid){
            setJoinErr("입력 오류가 있습니다.");
            return;
        }

        // 필수 항목 검사
        if (!agreements.agree || !agreements.security) {
            setJoinErr("필수 약관에 동의해주세요.");
            return;
        }

        const isJoin = await onMember(formData);

        if(isJoin === true){
            // 회원가입되면 완료화면으로 이동
            navigate("/join/mail");
        }else if(isJoin === 'auth/email-already-in-use'){
            setJoinErr("이미 등록된 이메일 주소입니다. 다른 이메일을 사용해주세요.");
        }else if (isJoin === 'auth/invalid-email') {
            setJoinErr("유효하지 않은 이메일 형식입니다.");
        }else{
            setJoinErr("회원가입 중 오류가 발생했습니다");
        }
    }

    const handleToggle = (index) => {
        // 이미 열려있는 걸 다시 누르면 닫고, 아니면 해당 인덱스를 켬
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
    <motion.div
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
    >
    <div className='login-wrap join-wrap'>
        <div className="inner">
            <form onSubmit={handleSubmit}>
                <SectionTitle title={"회원가입"} subtitle={""}/>
                <ul className="join-progress">
                    <li className='active'>
                        <div><img src="./images/icon/join-60.svg" alt="정보입력 약관동의" /></div>
                        <span>정보입력 • 약관동의</span>
                    </li>
                    <li>
                        <div><img src="./images/icon/user-60.svg" alt="본인인증" /></div>
                        <span>본인인증</span>
                    </li>
                    <li>
                        <div><img src="./images/icon/login-60.svg" alt="회원가입 완료" /></div>
                        <span>회원가입 완료</span>
                    </li>
                </ul>
                <div>
                    <div className='input-box line-b'>
                        <div className='label-div'><label htmlFor='username'>이름</label><span>(필수)</span></div>
                        <div className='input-div'>
                            <input type="text" id='username' name='username' placeholder='이름을 입력하세요' onBlur={handleBlur} onChange={handleChange}/>
                            <p className='err-box'>{touched.username && joinAllErr.username}</p>
                        </div>
                    </div>
                    <div className='input-box line-b'>
                        <div className='label-div'><label htmlFor='email'>이메일</label><span>(필수)</span></div>
                        <div className='input-div'>
                            <input type="email" id='email' name='email' placeholder='casetifyuser@casetify.com' onBlur={handleBlur} onChange={handleChange}/>
                            <p className='err-box'>{touched.email && joinAllErr.email}</p>    
                        </div>
                    </div>
                    <div className='line-b'>
                        <div className='input-box'>
                            <div className='label-div'><label htmlFor='password'>비밀번호</label><span>(필수)</span></div>
                            <div className='input-div'>
                                <input type={showPassword ? 'text' : 'password'} id='password' name='password'placeholder='비밀번호 입력' onBlur={handleBlur} onChange={handleChange}/>
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className='eye-btn'
                                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                                >
                                    {showPassword ? (
                                    <img src='/images/login/eye-off.png' alt='비밀번호 숨기기'/>
                                    ) : (
                                    <img src='/images/login/eye-open.png' alt='비밀번호 보기'/>
                                    )}
                                </button>
                                <p className='err-box'>{touched.password && joinAllErr.password}</p>
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='label-div'><label htmlFor='passwordcon'>비밀번호 확인</label><span>(필수)</span></div>
                            <div className='input-div'>
                                <input type="password" id='passwordcon' name='passwordcon' onChange={handleChange} onBlur={handleBlur} placeholder="비밀번호 확인" />
                                <p className='err-box'>{touched.passwordcon && joinAllErr.passwordcon}</p>
                            </div>
                        </div>
                    </div>
                    <div className='line-b'>
                        <div className='input-box'>
                            <div className='label-div'><label htmlFor='phone'>휴대전화</label><span>(필수)</span></div>
                            <div className='input-div'>
                                <input type="text" id='phone' name='phone' placeholder='-없이 입력' onBlur={handleBlur} onChange={handleChange}/>
                                <p className='err-box'>{touched.phone && joinAllErr.phone}</p>
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='label-div'><label>생년월일</label><span>(필수)</span></div>
                            <div className='input-div'>
                                <DatePicker
                                    selected={formData.birthDate}
                                    onChange={handleDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    showYearDropdown
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={100} // 100년 범위 선택 가능
                                    maxDate={new Date()}    // 오늘 이후 날짜 선택 불가
                                    locale={ko}             // 한국어 적용
                                    placeholderText="생년월일을 선택해주세요"
                                />
                                <p className='err-box'>{birthErr}</p>
                            </div>
                        </div>
                    </div>
                    <div className='input-box line-b'>
                        <div className='label-div'><label htmlFor='detailaddress'>주소</label></div>
                        <div className='input-div address-box'>
                            <div className='zonecode-box'>
                                <input value={formData.zonecode} readOnly placeholder="우편번호" />
                                <AddressSearch setAddressData={setAddressData} />
                            </div>
                            <input value={formData.address} readOnly placeholder="기본주소" />
                            <input type="text" id='detailaddress' name='detailaddress' placeholder="상세주소" onChange={handleChange}/>
                        </div>
                    </div>
                </div>
                <div className='agree-wrap'>
                    <div>
                        <div className="login-check agree-box">
                            <input type="checkbox" id="agree" className="login-idcheck screen-reader" checked={agreements.agree} onChange={handleCheckboxChange}/>
                            <div className="label-box">
                                <span className="check-icon" aria-hidden="true"></span>
                                <label htmlFor="agree">이용약관에 동의합니다</label>
                                <button type='button' onClick={() => setIsTermsModalOpen(true)}>내용보기</button>
                            </div>
                        </div>
                        <div className="login-check agree-box">
                            <input type="checkbox" id="security" className="login-idcheck screen-reader" checked={agreements.security} onChange={handleCheckboxChange}/>
                            <div className="label-box">
                                <span className="check-icon" aria-hidden="true"></span>
                                <label htmlFor="security">개인정보 취급방침에 동의합니다</label>
                                <button type='button' onClick={() => setIsSecurityModalOpen(true)}>내용보기</button>
                            </div>
                        </div>
                        <div className="login-check agree-box">
                            <input type="checkbox" id="market" className="login-idcheck screen-reader" checked={agreements.market} onChange={handleCheckboxChange}/>
                            <div className="label-box">
                                <span className="check-icon" aria-hidden="true"></span>
                                <label htmlFor="market">(선택)마케팅정보 수신 동의합니다</label>
                                <button type='button' onClick={() => setIsMarketModalOpen(true)}>내용보기</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='input-btn-box'>
                    <p>{joinErr}</p>
                    <button className='input-btn'>회원가입하기</button>
                </div>
            </form>
            {isTermsModalOpen && (
            <div className="modal-agree">
                <div className="modal-agree-content">
                    <ul>
                        <li>
                            <button type='button' onClick={() => handleToggle(0)}>웹사이트 이용약관</button>
                            <div className={`modal-select ${activeIndex === 0 ? 'active' : ''}`}>
                                <Terms />
                            </div>
                        </li>
                        <li>
                            <button type='button' onClick={() => handleToggle(1)}>CASETiFY Club 이용약관</button>
                            <div className={`modal-select ${activeIndex === 1 ? 'active' : ''}`}>
                                <CasetifyClubTerms />
                            </div>
                        </li>
                    </ul>
                    <button type='button' className='input-btn' onClick={() => setIsTermsModalOpen(false)}>닫기</button>
                </div>
            </div>
            )}
            {isSecurityModalOpen && (
            <div className="modal-agree">
                <div className="modal-agree-content">
                    <div className='modal-div'>
                        <Privacy />
                    </div>
                    <button type='button' className='input-btn' onClick={() => setIsSecurityModalOpen(false)}>닫기</button>
                </div>
            </div>
            )}
            {isMarketModalOpen && (
            <div className="modal-agree">
                <div className="modal-agree-content">
                    <div className='modal-div'>
                        <Marketing />
                    </div>
                    <button type='button' className='input-btn' onClick={() => setIsMarketModalOpen(false)}>닫기</button>
                </div>
            </div>
            )}
        </div>
    </div>
    </motion.div>
    ) 
}
