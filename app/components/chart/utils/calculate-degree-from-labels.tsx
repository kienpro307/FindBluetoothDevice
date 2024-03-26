/* eslint-disable prettier/prettier */
function calculateDegreeFromLabels(degree: any, labels: any) {
  // console.log('label length:' + labels.length);
  const perLevelDegree = degree / labels.length;
  return perLevelDegree;
}

export default calculateDegreeFromLabels;
