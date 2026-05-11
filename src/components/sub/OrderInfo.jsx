import React, { useEffect, useState, forwardRef } from 'react'
import "./scss/OrderInfo.scss"
import MypageTitle from './MypageTitle'
import { useAuthStore } from '../../store/useAuthStore'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';
import OrderDetailModal from './OrderDetailModal';
import EmptyState from './EmptyState';

const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="datepicker-box" onClick={onClick} ref={ref}>
        <span className="calendar-icon"><img src="/images/icon/CalendarStart.svg" alt="시작기간선택" /></span>
        <input
            readOnly
            value={value}
            placeholder={placeholder}
        />
    </div>
));

const CustomDateInputEnd = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="datepicker-box" onClick={onClick} ref={ref}>
        <input
            readOnly
            value={value}
            placeholder={placeholder}
        />
        <span className="calendar-icon"><img src="/images/icon/CalendarEnd.svg" alt="시작기간선택" /></span>
    </div>
));

const statusBtn = {
    "배송준비중": "전체 취소",
    "배송중": "전체 반품/교환",
    "배송완료": "전체 반품/교환",
    "취소/반품": "" // 이미 취소된 경우 버튼 안 보임
};

const STATUS_MAP = {
    1: { text: "취소중", className: "cancel-ing" },
    2: { text: "취소완료", className: "cancel-done" },
    3: { text: "교환/반품중", className: "return-ing" },
    4: { text: "교환/반품완료", className: "return-done" },
};

const tabs = ['전체', '배송준비중', '배송중', '배송완료', '취소/반품'];

export default function OrderInfo() {
    const { user, orderList, onFetchOrder, onUpdateAllItemsStatus } = useAuthStore();
    const [allCheckedMode, setAllCheckedMode] = useState(false);
    // 검색할 시작/종료 날짜 상태
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d;
    });
    const [endDate, setEndDate] = useState(new Date());
    // 필터링된 주문 내역
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('전체');

    useEffect(() => {
        if (!user) return;
        onFetchOrder();
    }, [user]);

    useEffect(() => {
        setFilteredOrders(orderList);
    }, [orderList]);

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    const indexOfLastPost = currentPage * postsPerPage; // 예: 1페이지면 5, 2페이지면 10
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 예: 1페이지면 0, 2페이지면 5
    const currentItems = filteredOrders.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지 데이터

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(filteredOrders.length / postsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const handleSearch = () => {
        if (!startDate || !endDate) {
            alert("시작일과 종료일을 모두 선택해주세요.");
            return;
        }
        applyFilters(activeTab, startDate, endDate);
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        // 클릭한 탭 이름과 현재 입력된 날짜를 가지고 필터 적용
        applyFilters(tabName, startDate, endDate);
    };

    const handleAllAction = (e, order) => {
        e.stopPropagation();

        // 1. 모든 아이템의 인덱스 배열 생성 [0, 1, 2, ...]
        const allIndexes = order.orderItems.map((_, idx) => idx);

        // 2. 전체 선택 모드임을 알리는 상태와 함께 모달 데이터 설정
        // (선택사항: 상세 모달 컴포넌트가 이 인덱스들을 초기값으로 갖게 함)
        setSelectedOrder(order);
        setAllCheckedMode(true);
    };

    const applyFilters = (tabName, start, end) => {
        const startThreshold = start ? new Date(start).setHours(0, 0, 0, 0) : null;
        const endThreshold = end ? new Date(end).setHours(23, 59, 59, 999) : null;

        const result = orderList.filter((order) => {
            // 날짜 변환 및 체크
            const dateString = order.orderDate.replace(/\//g, '-');
            const orderTime = new Date(dateString).getTime();

            // 날짜 조건: 범위 내에 있거나, 범위 설정이 안 되어 있거나
            const isWithinDate = (!startThreshold || !endThreshold) ||
                (orderTime >= startThreshold && orderTime <= endThreshold);

            // 상태 필터링
            let isStatusMatch = false;

            if (tabName === '전체') {
                isStatusMatch = true;
            } else if (tabName === '취소/반품') {
                // 주문 자체의 상태가 취소/반품이거나, 
                // 아이템 중 하나라도 status가 1, 2, 3, 4 중 하나인 경우
                const hasCanceledItem = order.orderItems.some(item =>
                    item.status && [1, 2, 3, 4].includes(item.status)
                );
                isStatusMatch = order.orderStatus === '취소/반품' || hasCanceledItem;
            } else {
                // 배송준비중, 배송중, 배송완료 탭
                isStatusMatch = order.orderStatus === tabName;
            }

            return isWithinDate && isStatusMatch;
        });

        setFilteredOrders(result);
        setCurrentPage(1);
    };

    // 모달에 띄울 주문 데이터 상태 (null이면 모달 닫힘)
    const [selectedOrder, setSelectedOrder] = useState(null);

    // '상세보기' 버튼 클릭 핸들러
    const handleShowDetail = (order) => {
        setSelectedOrder(order); // 데이터를 넣어서 모달을 염
    };

    // 모달을 닫을 때 상태 초기화
    const handleCloseModal = () => {
        setSelectedOrder(null);
        setAllCheckedMode(false);
    };

    return (
        <div className="order-list-container">
            <div>
                <MypageTitle title={"주문 정보"} />
            </div>

            {/* 상단 탭 및 필터 */}
            <div className="order-status-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={activeTab === tab ? 'active' : ''}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="order-period-search">
                <div className="datepicker-group">
                    <div>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            maxDate={new Date()}
                            locale={ko}
                            dateFormat="yy/MM/dd"
                            customInput={<CustomDateInput />}
                        />
                    </div>
                    <span className="tilde">~</span>
                    <div>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            maxDate={new Date()}
                            locale={ko}
                            dateFormat="yy/MM/dd"
                            customInput={<CustomDateInputEnd />}
                        />
                    </div>
                    <button className="period-search-btn" onClick={handleSearch}>기간 검색</button>
                </div>
            </div>

            <div className='order-length'>총 {filteredOrders.length}건</div>

            <div className="order-table-header">
                <div className="col">날짜/주문번호</div>
                <div className="col">상품명/옵션</div>
                <div className="col">상품금액/수량</div>
                <div className="col">주문상태</div>
            </div>

            {filteredOrders.length === 0 ? (
                <EmptyState
                    icon="📦"
                    strong="주문 내역"
                    title="이 없습니다."
                    desc="아직 주문한 상품이 없어요. 마음에 드는 상품을 찾아보세요."
                    btnText="쇼핑하러 가기"
                    btnLink="/case/device"
                />
            ) : (
                currentItems.map((order) => {
                    // 상품이 3개보다 많은지 확인
                    const isMoreThanThree = order.orderItems.length > 3;
                    // 실제로 보여줄 리스트 (최대 3개)
                    const displayItems = order.orderItems.slice(0, 3);
                    // 숨겨진 상품 개수
                    const extraCount = order.orderItems.length - 3;
                    return (
                        <div className="order-group" key={order.orderId}>
                            {/* 왼쪽: 날짜 및 주문번호 */}
                            <div className="order-info-col">
                                <p className="date">{order.orderDate.replace(/\.\s*$/, "")}</p>
                                <p className="order-id">{order.orderId}</p>
                                <button className="detail-btn" onClick={() => handleShowDetail(order)}>주문정보 상세보기 〉</button>
                            </div>

                            {/* 중간: 상품 리스트 (한 주문 내의 상품들) */}
                            <div className="order-items-col">
                                {displayItems.map((item, idx) => {
                                    const statusInfo = STATUS_MAP[item.status];
                                    return (
                                    <div className="item-row" key={`${order.orderId}-${idx}`}>
                                        <div className="item-img">
                                            <img src={item.imgUrl} alt={item.title} />
                                        </div>
                                        <div className="item-txt">
                                            <div className="col-check">
                                            {statusInfo ? (
                                                // 상태 코드가 (1,2,3,4) 있으면 텍스트 표시
                                                <span className={`status-badge ${statusInfo.className}`}>
                                                {statusInfo.text}
                                                </span>
                                            ) : ("")}
                                            </div>
                                            <p className="item-title">{item.title}</p>
                                            <p className="item-option">{item.device && <span>{item.device}</span>}{item.color && <span>{item.color}</span>}</p>
                                        </div>
                                        <div className="item-price-qty">
                                            <p className="price">{item.price.toLocaleString()}원</p>
                                            <p className="qty">{item.quantity}개</p>
                                        </div>
                                    </div>
                                )})}
                                {/* 3개 이상일 경우 '그 외 몇 개' 표시 */}
                                {isMoreThanThree && (
                                    <div className="more-items-tag">
                                        <p>그 외 <strong>{extraCount}</strong>개의 상품</p>
                                    </div>
                                )}
                            </div>

                            {/* 오른쪽: 주문 상태 */}
                            <div className="order-status-col">
                                <p className="status-txt">{order.orderStatus}</p>
                                {statusBtn[order.orderStatus] && (
                                    <button
                                        className="cancel-btn"
                                        onClick={(e) => handleAllAction(e, order)}
                                    >
                                        {statusBtn[order.orderStatus]}
                                    </button>
                                )}
                            </div>
                            {selectedOrder && (
                                <OrderDetailModal
                                    order={selectedOrder}
                                    onClose={handleCloseModal}
                                    initialAllChecked={allCheckedMode} // Props 추가
                                />
                            )}
                        </div>
                    )
                })
            )}
            {/* 페이지네이션*/}
            <div className="pagination">
                {/* 처음으로 버튼 */}
                <button onClick={() => paginate(1)} disabled={currentPage === 1}>«</button>

                {/* 이전 버튼 */}
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>‹</button>

                {/* 숫자 버튼들 */}
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={currentPage === i + 1 ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}

                {/* 다음 버튼 */}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>›</button>

                {/* 끝으로 버튼 */}
                <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>»</button>
            </div>
        </div>
    )
}
