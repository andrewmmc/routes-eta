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
      <p className="mb-2 text-sm font-code tracking-widest uppercase text-transit-muted">
        {t("home.operator")}
      </p>
      <div className="flex border-b border-transit-border">
        {OPERATOR_ORDER.map((operatorId) => {
          const operator = OPERATORS[operatorId];
          if (!operator) return null;

          const isSelected = selectedOperator === operatorId;

          return (
            <button
              key={operatorId}
              onClick={() => onOperatorChange(operatorId)}
              className={`px-4 py-2.5 text-sm font-heading tracking-wide border-b-2 -mb-px transition-colors duration-150 ${
                isSelected
                  ? "border-transit-accent text-foreground"
                  : "border-transparent text-transit-muted hover:text-foreground hover:border-transit-border-strong"
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
