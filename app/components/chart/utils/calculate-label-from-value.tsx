/* eslint-disable prettier/prettier */
function calculateLabelFromValue(
  value: any,
  labels: any,
  minValue: any,
  maxValue: any,
) {
  // console.log('min:' + minValue + ' max:' + maxValue);
  const currentValue = (value - minValue) / (maxValue - minValue);
  const currentIndex = Math.round((labels.length - 1) * currentValue);
  const label = labels[currentIndex];
  return label;
}

export default calculateLabelFromValue;
