export function evaluate(value: number, operator: string, target: number) {
  switch (operator) {
    case ">=":
      return value >= target;
    case "<=":
      return value <= target;
    case ">":
      return value > target;
    case "<":
      return value < target;
    case "==":
      return value === target;
    default:
      return false;
  }
}