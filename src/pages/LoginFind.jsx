import React, { useState } from 'react'
import "./scss/Login.scss"
import SectionTitle from '../components/SectionTitle'
import { useAuthStore } from '../store/useAuthStore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export default function LoginFindId() {
    const { onFindId, onFindPass } = useAuthStore();
    const { content } = useParams(); //id이면 아이디 찾기, pass면 비밀번호 찾기
    const [findEmail, setFindEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isJoin, setIsJoin] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        birthDate: ""
    });

    const [birthErr, setBirthErr] = useState('');
    const [joinErr, setJoinErr] = useState("");
    const [joinAllErr, setJoinAllErr] = useState({
        username: "",
        email: "",
        phone: ""
    });
    const [touched, setTouched] = useState({
        username: false,
        email: false,
        phone: false
    });

    // 각각 입력한 input요소를 name속성으로 찾아서 값 변경시키기
    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value);
        setFormData({ ...formData, [name]: value });

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
        if (content === 'pass' && name === 'email') {
            if (!value.includes('@') || !value || value.trim() === '') error = '이메일 형식이 올바르지 않습니다.';
        }
        if (name === 'phone') {
            const numberRegex = /^[0-9]+$/;
            if (!numberRegex.test(value) || value.includes('-') || !value || value.trim() === '') error = '-없이 숫자만 입력해주세요.';
        }
        return error;
    };

    const handleSubmit = async (e) => {
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
            phone: true
        };
        setTouched(allTouched);

        // 에러가 하나도 없는지 확인
        let isFormValid = Object.values(newErrors).every(err => err === '');

        if (!formData.birthDate) {
            setBirthErr("필수 입력 항목입니다.")
            isFormValid = false;
        }

        if (!isFormValid) {
            setJoinErr("입력 오류가 있습니다.");
            return;
        }

        let isJoin = "";
        if (content === "id") {
            isJoin = await onFindId(formData);
        } else {
            isJoin = await onFindPass(formData);
        }

        if (isJoin === false) {
            setJoinErr("일치하는 회원 정보를 찾을 수 없습니다.");
        } else {
            if (content == "id") {
                const [localPart, domain] = isJoin.split('@');
                if (localPart.length <= 3) {
                    setFindEmail(`${localPart[0]}**@${domain}`);
                } else {
                    // 앞 3글자만 보여주고 나머지는 *로 표시
                    setFindEmail(`${localPart.substring(0, 3)}****@${domain}`);
                }
                setIsModalOpen(true);
            } else {
                setFindEmail(`이메일로 비밀번호 재설정 메일을 보냈습니다`);
                setIsModalOpen(true);
            }
        }
    }

    return (
        <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
        >
            <div className='login-wrap join-wrap find-wrap'>
                <div className="inner">
                    {/* 브레드크럼 */}
                    <Breadcrumb items={[
                        { label: '홈', to: '/' },
                        { label: '로그인', to: '/login' },
                        { label: content === 'id' ? '아이디 찾기' : '비밀번호 찾기' }
                    ]} />
                    <SectionTitle title={content === "id" ? "아이디 찾기" : "비밀번호 찾기"} subtitle={""} />
                    <form onSubmit={handleSubmit}>
                        <div className='input-box'>
                            <div className='label-div'><label htmlFor='username'>이름</label><span>(필수)</span></div>
                            <div className='input-div'>
                                <input type="text" id='username' name='username' placeholder='이름을 입력하세요' onBlur={handleBlur} onChange={handleChange} />
                                <p className='err-box'>{touched.username && joinAllErr.username}</p>
                            </div>
                        </div>
                        {content === "pass" ?
                            <div className='input-box'>
                                <div className='label-div'><label htmlFor='email'>이메일</label><span>(필수)</span></div>
                                <div className='input-div'>
                                    <input type="email" id='email' name='email' placeholder='casetifyuser@casetify.com' onBlur={handleBlur} onChange={handleChange} />
                                    <p className='err-box'>{touched.email && joinAllErr.email}</p>
                                </div>
                            </div>
                            : ""}
                        <div className='input-box'>
                            <div className='label-div'><label htmlFor='phone'>휴대전화</label><span>(필수)</span></div>
                            <div className='input-div'>
                                <input type="text" id='phone' name='phone' placeholder='-없이 입력' onBlur={handleBlur} onChange={handleChange} />
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
                        <div className='input-btn-box'>
                            <p>{joinErr}</p>
                            <button className='input-btn'>{content === "id" ? "아이디 찾기" : "비밀번호 찾기"}</button>
                        </div>
                    </form>
                    {isModalOpen && (
                        <div className='modal-wrap'>
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    {content === 'id' ? <p>입력한 정보와 일치하는 아이디입니다.</p> : ""}
                                    <p>{findEmail}</p>
                                    <Link to="/login"><button className='input-btn'>로그인으로 이동하기</button></Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}