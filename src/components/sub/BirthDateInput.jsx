import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BirthDateInput({ setBirthDate }) {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <DatePicker
        selected={startDate}
        onChange={(date) => {
            setStartDate(date);
            setBirthDate(date); // 부모 컴포넌트로 전달
        }}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100} // 100년 범위 선택 가능
        />
    );
}
