/**
 * Mock PropertiesService class
 * @see https://developers.google.com/apps-script/reference/properties/properties-service?hl=en
 */
class MockPropertiesService {
  static getScriptProperties() {
    return new MockProperties();
  }
}

/**
 * Mock Properties class
 * @see https://developers.google.com/apps-script/reference/properties/properties?hl=en
 */
class MockProperties {
  constructor() {}
  getProperties() {
    return {
      webAppUrl: 'https://test-url.com',
      webAppKey: 'testKey',
      ids: {
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
      },
    };
  }
}

module.exports = { MockPropertiesService, MockProperties };
