/* eslint-disable prettier/prettier */
/* eslint radix: ["error", "as-needed"] */
/* eslint-disable no-restricted-globals */
function limitValue(value: any, minValue: any, maxValue: any, allowedDecimals: any) {
  let currentValue = 0;
  if (typeof value === 'number' && !isNaN(allowedDecimals) && typeof allowedDecimals === 'number') {
    if (allowedDecimals > 0) {
      currentValue = parseFloat(value.toFixed(allowedDecimals < 4 ? allowedDecimals : 4));
    } else {
      currentValue = value;
    }
  }
  return Math.min(Math.max(currentValue, minValue), maxValue);
}

export default limitValue;
