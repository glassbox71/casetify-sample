import { div } from 'framer-motion/client';
import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

export default function AddressSearch({ setAddressData }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    // 선택한 데이터를 부모 컴포넌트로 전달
    setAddressData({
      zonecode: data.zonecode, // 우편번호
      address: fullAddress,    // 주소
    });

    setIsOpen(false); // 팝업 닫기
  };

  const handleClose = () => {
    setIsOpen(false); // 팝업 닫기
  }

  return (
    <div>
      <button type="button" className="zonecode-btn" onClick={() => setIsOpen(true)}>주소 검색</button>
      {isOpen && (
        <div className='post-modal' style={popupStyle}>
          {/* <DaumPostcode onComplete={handleComplete} style={{ width: '100%', height: '100%' }}/> */}
          <DaumPostcode
            className="postmodal"
            autoClose
            onComplete={handleComplete} />
          <button className='input-btn close-btn' onClick={handleClose}>닫기</button>
        </div>
      )}
    </div>
  );
}

// 팝업 스타일
const popupStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '500px',
  height: '500px',
  backgroundColor: 'white',
  padding: '20px',
  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
  zIndex: 10
};