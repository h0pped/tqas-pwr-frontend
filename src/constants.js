export const academicTitlesList = [
  'lic',
  'inz',
  'mgr',
  'mgr inz',
  'dr',
  'dr inz',
  'dr hab',
  'dr hab inz',
  'prof dr hab',
  'prof dr hab inz',
];

export const userRolesList = [
  { key: 'admin', title: 'admin' },
  { key: 'dean', title: 'dean' },
  { key: 'head', title: 'head of department' },
  { key: 'et', title: 'evaluation team member' },
  { key: 'evaluatee', title: 'evaluatee' },
];

export const assesmentStatuses = [
  'Draft',
  'Awaiting approval',
  'Ongoing',
  'Changes requested',
  'Done',
];

function generateListOfSemesters(currentDate) {
  var semesters = [];

  const currentYear = currentDate.split('-')[0];
  console.log(currentDate);

  for (let step = 0; step < 3; step++) {
    var newWinterSem = `Winter ${parseInt(currentYear) + step}/${parseInt(currentYear) + 1 + step}`;
    var newWinterSemDateFrom = `${parseInt(currentYear) + step}-10-01`;
    var newWinterSemDateTo = `${parseInt(currentYear) + 1 + step}-02-27`;

    var newSummerSem = `Summer ${parseInt(currentYear) + step}/${parseInt(currentYear) + 1 + step}`;
    var newSummerSemDateFrom = `${parseInt(currentYear) + 1 + step}-02-28`;
    var newSummerSemDateTo = `${parseInt(currentYear) + 1 + step}-09-30`;

    var newWinterSemester = {
      label: newWinterSem,
      dateFrom: newWinterSemDateFrom,
      dateTo: newWinterSemDateTo,
    };

    semesters.push(newWinterSemester);

    var newSummerSemester = {
      label: newSummerSem,
      dateFrom: newSummerSemDateFrom,
      dateTo: newSummerSemDateTo,
    };
    semesters.push(newSummerSemester);
  }

  console.log(semesters);
  return semesters;
}

export const semesters = generateListOfSemesters(new Date().toISOString().slice(0, 10));
