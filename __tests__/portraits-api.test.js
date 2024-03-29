/**
 * ポートレートAPIを呼び出すメソッドのテスト一式
 */
const {
  getStudentFacultyStatus,
  getCollegeUndergraduateStudentsDetail,
  getGraduateStudentsDetail,
  getJuniorCollegeUndergraduateStudentsDetail,
  getForeignStudent,
  getStatusAfterGraduationGraduates,
  getStatusAfterGraduationJobs,
  getSchoolFacilities,
  verifyAccessKey_,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../src/portraits');

const testParams = {
  accessKey: 'test-access-key-0123456789',
  year: 2022,
  univId: '0000',
  orgId: '0000-00-hoge-fuga',
  foreignId: '0000-0Z00',
};
const patterns = [
  {
    testName: 'getStudentFacultyStatus',
    testFunc: getStudentFacultyStatus,
    input: {
      accessKey: testParams.accessKey,
      year: testParams.year,
      orgId: testParams.univId,
    },
    expectedOutput: {
      url: `https://edit.portraits.niad.ac.jp/api/v1/SchoolBasicSurvey/getStudentFacultyStatus?accesskey=${testParams.accessKey}&year=${testParams.year}&orgid=${testParams.univId}`,
      params: { method: 'get' },
    },
  },
  {
    testName: 'getCollegeUndergraduateStudentsDetail',
    testFunc: getCollegeUndergraduateStudentsDetail,
    input: {
      accessKey: testParams.accessKey,
      year: testParams.year,
      orgId: testParams.orgId,
    },
    expectedOutput: {
      url: `https://edit.portraits.niad.ac.jp/api/v1/SchoolBasicSurvey/getCollegeUndergraduateStudentsDetail?accesskey=${testParams.accessKey}&year=${testParams.year}&orgid=${testParams.orgId}`,
      params: { method: 'get' },
    },
  },
  {
    testName: 'getGraduateStudentsDetail',
    testFunc: getGraduateStudentsDetail,
    input: {
      accessKey: testParams.accessKey,
      year: testParams.year,
      orgId: testParams.orgId,
    },
    expectedOutput: {
      url: `https://edit.portraits.niad.ac.jp/api/v1/SchoolBasicSurvey/getGraduateStudentsDetail?accesskey=${testParams.accessKey}&year=${testParams.year}&orgid=${testParams.orgId}`,
      params: { method: 'get' },
    },
  },
  {
    testName: 'getJuniorCollegeUndergraduateStudentsDetail',
    testFunc: getJuniorCollegeUndergraduateStudentsDetail,
    input: {
      accessKey: testParams.accessKey,
      year: testParams.year,
      orgId: testParams.univId,
    },
    expectedOutput: {
      url: `https://edit.portraits.niad.ac.jp/api/v1/SchoolBasicSurvey/getJuniorCollegeUndergraduateStudentsDetail?accesskey=${testParams.accessKey}&year=${testParams.year}&orgid=${testParams.univId}`,
      params: { method: 'get' },
    },
  },
  {
    testName: 'getForeignStudent',
    testFunc: getForeignStudent,
    input: {
      accessKey: testParams.accessKey,
      year: testParams.year,
      orgId: testParams.foreignId,
    },
    expectedOutput: {
      url: `https://edit.portraits.niad.ac.jp/api/v1/SchoolBasicSurvey/getForeignStudent?accesskey=${testParams.accessKey}&year=${testParams.year}&orgid=${testParams.foreignId}`,
      params: { method: 'get' },
    },
  },
  {
    testName: 'getStatusAfterGraduationGraduates',
    testFunc: getStatusAfterGraduationGraduates,
    input: {
      accessKey: testParams.accessKey,
      year: testParams.year,
      orgId: testParams.orgId,
    },
    expectedOutput: {
      url: `https://edit.portraits.niad.ac.jp/api/v1/SchoolBasicSurvey/getStatusAfterGraduationGraduates?accesskey=${testParams.accessKey}&year=${testParams.year}&orgid=${testParams.orgId}`,
      params: { method: 'get' },
    },
  },
  {
    testName: 'getStatusAfterGraduationJobs',
    testFunc: getStatusAfterGraduationJobs,
    input: {
      accessKey: testParams.accessKey,
      year: testParams.year,
      orgId: testParams.orgId,
    },
    expectedOutput: {
      url: `https://edit.portraits.niad.ac.jp/api/v1/SchoolBasicSurvey/getStatusAfterGraduationJobs?accesskey=${testParams.accessKey}&year=${testParams.year}&orgid=${testParams.orgId}`,
      params: { method: 'get' },
    },
  },
  {
    testName: 'getSchoolFacilities',
    testFunc: getSchoolFacilities,
    input: {
      accessKey: testParams.accessKey,
      year: testParams.year,
      orgId: testParams.univId,
    },
    expectedOutput: {
      url: `https://edit.portraits.niad.ac.jp/api/v1/SchoolBasicSurvey/getSchoolFacilities?accesskey=${testParams.accessKey}&year=${testParams.year}&orgid=${testParams.univId}`,
      params: { method: 'get' },
    },
  },
];

patterns.forEach((pattern) => {
  test(pattern.testName, () => {
    expect(
      pattern.testFunc(
        pattern.input.accessKey,
        pattern.input.year,
        pattern.input.orgId,
      ),
    ).toEqual(pattern.expectedOutput);
  });
});

//////////////////
// 例外処理の確認 //
//////////////////

test('verifyAccessKey_ with invalid access key', () => {
  expect(() => {
    verifyAccessKey_('http://invalid.access.key/');
  }).toThrowError(
    new RangeError(
      '[ERROR] 引数として渡されたアクセスキーが所定の形式でないようです。入力値をご確認ください。',
    ),
  );
});

const nullishPatterns = [null, ''];
nullishPatterns.forEach((pattern) => {
  test(`verifyAccessKey_ with access key as '${pattern}'`, () => {
    expect(() => {
      verifyAccessKey_(pattern);
    }).toThrowError(
      new RangeError(
        '[ERROR] アクセスキーが空白のままAPIを呼び出そうとしています。必ずポートレートAPIのアクセスキーを設定した上で、実行してください。',
      ),
    );
  });
});
