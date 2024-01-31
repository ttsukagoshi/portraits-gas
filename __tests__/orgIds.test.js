/**
 * 組織ID等を呼び出すためのメソッドのテスト一式
 */
const {
  getAllIds,
  getAllUnivIds,
  getUnivIds,
  getAllIntlIdSuffixes,
  getIntlIds,
  getAllOrganizationIds,
  getOrganizationIdsbyUniv,
  verifyUnivNamesIds_,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../src/portraits');

test('getAllIds', () => {
  expect(getAllIds()).toEqual({
    univIds: [
      { UNIV_ID: '0000', UNIV_NAME: '○○大学' },
      { UNIV_ID: '0001', UNIV_NAME: 'xx大学' },
    ],
    intlIdSuffixes: [
      {
        INTL_ID_SUFFIX: '-1Z11',
        INTL_CATEGORY: '大学学部、短期大学本科（外国人学生調査票用）',
      },
    ],
    organizationIds: {
      2021: {
        '○○大学': [
          {
            OID: '0000-01-01-1K00-00-1',
            DEP: '○○学部',
            LOC: '東京都',
            CTG: '',
            DN: '昼間',
          },
        ],
      },
    },
  });
});

test('getAllUnivIds', () => {
  expect(getAllUnivIds()).toEqual([
    { UNIV_ID: '0000', UNIV_NAME: '○○大学' },
    { UNIV_ID: '0001', UNIV_NAME: 'xx大学' },
  ]);
});

test('getUnivIds', () => {
  expect(getUnivIds(['○○大学'])).toEqual([
    { UNIV_ID: '0000', UNIV_NAME: '○○大学' },
  ]);
});

test('getAllIntlIdSuffixes', () => {
  expect(getAllIntlIdSuffixes()).toEqual([
    {
      INTL_ID_SUFFIX: '-1Z11',
      INTL_CATEGORY: '大学学部、短期大学本科（外国人学生調査票用）',
    },
  ]);
});

test('getIntlIds', () => {
  expect(getIntlIds(['0000'])).toEqual([['0000-1Z11']]);
});

test('getAllOrganizationIds', () => {
  expect(getAllOrganizationIds()).toEqual({
    2021: {
      '○○大学': [
        {
          OID: '0000-01-01-1K00-00-1',
          DEP: '○○学部',
          LOC: '東京都',
          CTG: '',
          DN: '昼間',
        },
      ],
    },
  });
});

test('getOrganizationIdsbyUniv', () => {
  expect(getOrganizationIdsbyUniv(2021, ['○○大学'])).toEqual({
    '○○大学': [
      {
        OID: '0000-01-01-1K00-00-1',
        DEP: '○○学部',
        LOC: '東京都',
        CTG: '',
        DN: '昼間',
      },
    ],
  });
});

//////////////////
// 例外処理の確認 //
//////////////////

test('getUnivIds with invalid univ name', () => {
  const testUnivName = '▲▲大学';
  expect(() => {
    getUnivIds([testUnivName]);
  }).toThrowError(
    new RangeError(`[ERROR] ${testUnivName} の情報は登録されていません。`),
  );
});

test('getOrganizationIdsbyUniv with invalid year', () => {
  const testYear = 1970;
  expect(() => {
    getOrganizationIdsbyUniv(testYear, ['○○大学']);
  }).toThrowError(
    new RangeError(
      `[ERROR] ${testYear}年度の学部・研究科等組織IDは取得できません。`,
    ),
  );
});

test('getOrganizationIdsbyUniv with invalid univ name', () => {
  const testUnivName = '▲▲大学';
  expect(() => {
    getOrganizationIdsbyUniv(2021, [testUnivName]);
  }).toThrowError(
    new RangeError(`[ERROR] ${testUnivName}の情報は登録されていません。`),
  );
});

test('verifyUnivNamesIds_ with non-array arg', () => {
  const param = 'this is not an array';
  expect(() => verifyUnivNamesIds_(param)).toThrowError(
    new TypeError(`[ERROR] 引数として渡された ${param} が配列ではありません。`),
  );
});

test('verifyUnivNamesIds_ with zero-length array', () => {
  expect(() => {
    verifyUnivNamesIds_([]);
  }).toThrowError(
    new RangeError('[ERROR] 必ず1つ以上の大学を指定してください。'),
  );
});
