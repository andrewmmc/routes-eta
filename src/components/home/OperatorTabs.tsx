/**
 * Operator Tabs Component
 *
 * Tab selector for different transport operators
 */

import { OPERATORS, OPERATOR_ORDER, type OperatorId } from "@/models/operator";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedName } from "@/utils/localization";

interface OperatorTabsProps {
  selectedOperator: OperatorId;
  onOperatorChange: (operator: OperatorId) => void;
}

export function OperatorTabs({
  selectedOperator,
  onOperatorChange,
}: OperatorTabsProps) {
  const { t, language } = useTranslation();

  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {t("home.operator")}
      </label>
      <div className="flex gap-2">
        {OPERATOR_ORDER.map((operatorId) => {
          const operator = OPERATORS[operatorId];
          if (!operator) return null;

          const isSelected = selectedOperator === operatorId;

          return (
            <button
              key={operatorId}
              onClick={() => onOperatorChange(operatorId)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {getLocalizedName(operator, language)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
