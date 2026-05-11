export default function AlertPopup({ message, onClose, onConfirm }) {
    if (!message) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm(); // 확인 콜백 실행
        onClose();
    };

    return (
        <div className="alert-overlay" onClick={onClose}>
            <div className="alert-popup" onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <div className="btn-wrap">
                    <button
                        className={onConfirm ? "alert-confirm-btn" : "alert-confirm-btn only"}
                        onClick={handleConfirm}>확인</button>
                    {onConfirm && ( // 취소 버튼은 확인이 필요한 경우만 표시
                        <button className="alert-cancle-btn" onClick={onClose}>취소</button>
                    )}
                </div>
            </div>
        </div>
    );
}