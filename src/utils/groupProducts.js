export function groupModelsByProductName(items = []) {
    return Object.values(
        items.reduce((acc, item) => {
            const rawName = item.productName || "";
            const rawCaseCategory = item.caseCategory || "";

            const normalizedName = rawName.trim().toLowerCase();
            const normalizedCaseCategory = rawCaseCategory.trim().toLowerCase();

            if (!normalizedName) return acc;

            const groupKey = `${normalizedName}__${normalizedCaseCategory}`;

            if (!acc[groupKey]) {
                acc[groupKey] = {
                    productName: rawName.trim(),
                    caseCategory: rawCaseCategory.trim(),
                    modelKeys: [],
                    modelLabels: [],
                    items: [],
                };
            }

            if (item.modelKey && !acc[groupKey].modelKeys.includes(item.modelKey)) {
                acc[groupKey].modelKeys.push(item.modelKey);
            }

            if (item.modelLabel && !acc[groupKey].modelLabels.includes(item.modelLabel)) {
                acc[groupKey].modelLabels.push(item.modelLabel);
            }

            acc[groupKey].items.push(item);

            return acc;
        }, {})
    );
}

export function getModelsByProductGroup(items = [], targetItem) {
    if (!targetItem) return [];

    const matchedItems = items.filter((item) => {
        return (
            item.productName === targetItem.productName &&
            item.caseCategory === targetItem.caseCategory
        );
    });

    return Array.from(
        new Map(
            matchedItems
                .filter((item) => item.modelKey && item.modelLabel)
                .map((item) => [
                    item.modelKey,
                    { key: item.modelKey, label: item.modelLabel },
                ])
        ).values()
    );
}

export function getModelsByProductGroupCartItem(items = [], targetItem) {
    if (!targetItem) return [];

    const matchedItems = items.filter((item) => {
        return (
            item.productName === targetItem.productName || item.productName === targetItem.title &&
            item.caseCategory === targetItem.caseCategory
        );
    });

    return Array.from(
        new Map(
            matchedItems
                .filter((item) => item.modelKey && item.modelLabel)
                .map((item) => [
                    item.modelKey,
                    { key: item.modelKey, label: item.modelLabel },
                ])
        ).values()
    );
}

export const getUserGrade = (point = 0) => {
  if (point >= 200) return "골드";
  if (point >= 120) return "실버";
  if (point >= 50) return "브론즈";
  return "베이직";
};