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

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];
export const assessmentStatuses = [
  'Draft',
  'Awaiting approval',
  'Ongoing',
  'Changes requested',
  'Done',
];

function generateListOfSemesters(currentYearNumber) {
  const semesters = [];

  for (let step = 0; step < 3; step += 1) {
    const newWinterSem = `Winter ${currentYearNumber + step}/${
      currentYearNumber + 1 + step
    }`;
    const newWinterSemDateFrom = `${currentYearNumber + step}-10-01`;
    const newWinterSemDateTo = `${currentYearNumber + 1 + step}-02-27`;

    const newSummerSem = `Summer ${currentYearNumber + step}/${
      currentYearNumber + 1 + step
    }`;
    const newSummerSemDateFrom = `${currentYearNumber + 1 + step}-02-28`;
    const newSummerSemDateTo = `${currentYearNumber + 1 + step}-09-30`;

    const newWinterSemester = {
      label: newWinterSem,
      dateFrom: newWinterSemDateFrom,
      dateTo: newWinterSemDateTo,
    };

    semesters.push(newWinterSemester);

    const newSummerSemester = {
      label: newSummerSem,
      dateFrom: newSummerSemDateFrom,
      dateTo: newSummerSemDateTo,
    };
    semesters.push(newSummerSemester);
  }

  return semesters;
}

export const semesters = generateListOfSemesters(new Date().getFullYear());
