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
  const semesters = [];

  const currentYear = currentDate.split('-')[0];

  for (let step = 0; step < 3; step++) {
    const newWinterSem = `Winter ${Number(currentYear) + step}/${Number(currentYear) + 1 + step}`;
    const newWinterSemDateFrom = `${Number(currentYear) + step}-10-01`;
    const newWinterSemDateTo = `${Number(currentYear) + 1 + step}-02-27`;

    const newSummerSem = `Summer ${Number(currentYear) + step}/${Number(currentYear) + 1 + step}`;
    const newSummerSemDateFrom = `${Number(currentYear) + 1 + step}-02-28`;
    const newSummerSemDateTo = `${Number(currentYear) + 1 + step}-09-30`;

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

export const semesters = generateListOfSemesters(new Date().toISOString().slice(0, 10));
