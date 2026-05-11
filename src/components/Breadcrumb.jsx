import React from 'react';
import { Link } from 'react-router-dom';
import './scss/Breadcrumb.scss';

/**
 * Breadcrumb
 * @param {Array} items - [{ label: '홈', to: '/' }, { label: '케이스' }, ...]
 *   - to가 있으면 Link, 없으면 그냥 span (현재 페이지)
 */
export default function Breadcrumb({ items = [] }) {
    return (
        <div className="category-breadcrumb">
            {items.map((item, idx) => (
                <React.Fragment key={idx}>
                    {idx > 0 && <span> &gt; </span>}
                    {item.to
                        ? <Link to={item.to}>{item.label}</Link>
                        : <span>{item.label}</span>
                    }
                </React.Fragment>
            ))}
        </div>
    );
}
