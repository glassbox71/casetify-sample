import React, { useEffect } from 'react'
import { useParams } from "react-router-dom";
import { items } from "../../../data/finalData";


import TabWrap from './TabWrap'
import DetailPage from './DetailPage'
import BundleRecommend from './budleReocomend';
import { useRecentStore } from '../../../store/useRecentStore';
import { modelColorOptions } from "../../../data/finalData";
import { motion } from 'framer-motion';

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};


export default function ProductDetailPage() {

    const { id } = useParams();
    const item = items.find((data) => String(data.id) === String(id));

    if (!item) {
        return <div>상품 없음</div>;
    }

    const addRecentItem = useRecentStore((state) => state.addRecentItem);

    useEffect(() => {
        if (item) {
            const isPhone = item?.productTarget === "phone";
            const recentColor = item.mainCaseColor || item.caseColors?.[0] || "";
            const modelColors = isPhone ? modelColorOptions?.[item?.modelKey] || [] : [];
            const fixedThumbDeviceColor = isPhone ? modelColors?.[0]?.key || "" : "";

            const mainImagePath = isPhone
                ? `/images/category/products/${item.id}_${item.modelKey}_${fixedThumbDeviceColor}_${recentColor}_main.jpg`
                : item.modelKey
            ? `/images/category/products/${item.id}_${item.modelKey}_${recentColor}_main.jpg`
            : `/images/category/products/${item.id}${recentColor ? `_${recentColor}` : ""}_main.jpg`;

            const recentItem = {
                id: item.id,
                productName: item.productName,
                price: item.price,
                imgUrl: mainImagePath
            };

            addRecentItem(recentItem);
        }
    }, [item, addRecentItem]);

    return (
        <>
        <motion.div
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        >
        <div className='product-detail-page'>
            <div className="inner">
                <DetailPage item={item} />
                <BundleRecommend item={item}/>
                <br />
                <TabWrap item={item} />
            </div>
        </div>
        </motion.div>
        </>
    )
}
