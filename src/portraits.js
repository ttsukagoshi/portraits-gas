// Copyright 2022 Taro TSUKAGOSHI
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const API_BASE_URL = 'https://edit.portraits.niad.ac.jp/api/';
const API_VERSION = 'v1';

// Jest用
if (!UrlFetchApp) {
  const { MockUrlFetchApp } = require('./__mocks__/mockUrlFetchApp');
  var UrlFetchApp = MockUrlFetchApp;
}
if (!PropertiesService) {
  const {
    MockPropertiesService,
  } = require('./__mocks__/mockPropertiesService');
  var PropertiesService = MockPropertiesService;
}

/**
 * 学生教員等状況票API情報取得
 * @param {string} accessKey APIアクセスキー
 * @param {number} year 対象年度の西暦4桁
 * @param {string} univId 4桁の大学ID
 * @returns {*}
 * @see https://api-portal.portraits.niad.ac.jp/api-info.html
 */
function getStudentFacultyStatus(accessKey, year, univId) {
  const params = `accesskey=${verifyAccessKey_(
    accessKey
  )}&year=${year}&orgid=${univId}`;
  const url =
    API_BASE_URL +
    API_VERSION +
    `/SchoolBasicSurvey/getStudentFacultyStatus?${params}`;
  return JSON.parse(UrlFetchApp.fetch(url, { method: 'get' }).getContentText());
}

/**
 * 学部学生内訳票API情報取得
 * @param {string} accessKey APIアクセスキー
 * @param {number} year 対象年度の西暦4桁
 * @param {string} orgId 学部・研究科等組織ID
 * @returns {*}
 * @see https://api-portal.portraits.niad.ac.jp/api-info.html
 */
function getCollegeUndergraduateStudentsDetail(accessKey, year, orgId) {
  const params = `accesskey=${verifyAccessKey_(
    accessKey
  )}&year=${year}&orgid=${orgId}`;
  const url =
    API_BASE_URL +
    API_VERSION +
    `/SchoolBasicSurvey/getCollegeUndergraduateStudentsDetail?${params}`;
  return JSON.parse(UrlFetchApp.fetch(url, { method: 'get' }).getContentText());
}

/**
 * 大学院学生内訳票API情報取得
 * @param {string} accessKey APIアクセスキー
 * @param {number} year 対象年度の西暦4桁
 * @param {string} orgId 学部・研究科等組織ID
 * @returns {*}
 * @see https://api-portal.portraits.niad.ac.jp/api-info.html
 */
function getGraduateStudentsDetail(accessKey, year, orgId) {
  const params = `accesskey=${verifyAccessKey_(
    accessKey
  )}&year=${year}&orgid=${orgId}`;
  const url =
    API_BASE_URL +
    API_VERSION +
    `/SchoolBasicSurvey/getGraduateStudentsDetail?${params}`;
  return JSON.parse(UrlFetchApp.fetch(url, { method: 'get' }).getContentText());
}

/**
 * 本科学生内訳票API情報取得
 * @param {string} accessKey APIアクセスキー
 * @param {number} year 対象年度の西暦4桁
 * @param {string} univId 4桁の大学ID
 * @returns {*}
 * @see https://api-portal.portraits.niad.ac.jp/api-info.html
 */
function getJuniorCollegeUndergraduateStudentsDetail(accessKey, year, univId) {
  const params = `accesskey=${verifyAccessKey_(
    accessKey
  )}&year=${year}&orgid=${univId}`;
  const url =
    API_BASE_URL +
    API_VERSION +
    `/SchoolBasicSurvey/getJuniorCollegeUndergraduateStudentsDetail?${params}`;
  return JSON.parse(UrlFetchApp.fetch(url, { method: 'get' }).getContentText());
}

/**
 * 外国人学生調査票API情報取得
 * @param {string} accessKey APIアクセスキー
 * @param {number} year 対象年度の西暦4桁
 * @param {string} foreignId 外国人学生用組織ID
 * @returns {*}
 * @see https://api-portal.portraits.niad.ac.jp/api-info.html
 */
function getForeignStudent(accessKey, year, foreignId) {
  const params = `accesskey=${verifyAccessKey_(
    accessKey
  )}&year=${year}&orgid=${foreignId}`;
  const url =
    API_BASE_URL +
    API_VERSION +
    `/SchoolBasicSurvey/getForeignStudent?${params}`;
  return JSON.parse(UrlFetchApp.fetch(url, { method: 'get' }).getContentText());
}

/**
 * 卒業後の状況調査票(2-1)API情報取得
 * @param {string} accessKey APIアクセスキー
 * @param {number} year 対象年度の西暦4桁
 * @param {string} orgId 学部・研究科等組織ID
 * @returns {*}
 * @see https://api-portal.portraits.niad.ac.jp/api-info.html
 */
function getStatusAfterGraduationGraduates(accessKey, year, orgId) {
  const params = `accesskey=${verifyAccessKey_(
    accessKey
  )}&year=${year}&orgid=${orgId}`;
  const url =
    API_BASE_URL +
    API_VERSION +
    `/SchoolBasicSurvey/getStatusAfterGraduationGraduates?${params}`;
  return JSON.parse(UrlFetchApp.fetch(url, { method: 'get' }).getContentText());
}

/**
 * 卒業後の状況調査票(2-2)API情報取得
 * @param {string} accessKey APIアクセスキー
 * @param {number} year 対象年度の西暦4桁
 * @param {string} orgId 学部・研究科等組織ID
 * @returns {*}
 * @see https://api-portal.portraits.niad.ac.jp/api-info.html
 */
function getStatusAfterGraduationJobs(accessKey, year, orgId) {
  const params = `accesskey=${verifyAccessKey_(
    accessKey
  )}&year=${year}&orgid=${orgId}`;
  const url =
    API_BASE_URL +
    API_VERSION +
    `/SchoolBasicSurvey/getStatusAfterGraduationJobs?${params}`;
  return JSON.parse(UrlFetchApp.fetch(url, { method: 'get' }).getContentText());
}

/**
 * 学校施設調査票API情報取得
 * @param {string} accessKey APIアクセスキー
 * @param {number} year 対象年度の西暦4桁
 * @param {string} univId 4桁の大学ID
 * @returns {*}
 * @see https://api-portal.portraits.niad.ac.jp/api-info.html
 */
function getSchoolFacilities(accessKey, year, univId) {
  const params = `accesskey=${verifyAccessKey_(
    accessKey
  )}&year=${year}&orgid=${univId}`;
  const url =
    API_BASE_URL +
    API_VERSION +
    `/SchoolBasicSurvey/getSchoolFacilities?${params}`;
  return JSON.parse(UrlFetchApp.fetch(url, { method: 'get' }).getContentText());
}

/////////////////////////////////
// 組織ID等を取得するためのメソッド //
/////////////////////////////////

/**
 * 全ての種類の組織ID一覧を取得
 * @returns {*}
 */
function getAllIds() {
  return getIds_();
}

/**
 * 全ての大学ID一覧を取得
 * @returns {array}
 */
function getAllUnivIds() {
  return getIds_('univIds');
}

/**
 * 指定した大学のIDを取得
 * @param {array} targetUnivNames 大学名の配列
 * @returns {array} 指定した大学について、大学名とIDがセットになったオブジェクトの配列
 */
function getUnivIds(targetUnivNames) {
  const univIds = getAllUnivIds();
  const univNameList = univIds.map((univ) => univ.UNIV_NAME);
  verifyUnivNamesIds_(targetUnivNames).forEach((targetUnivName) => {
    if (!univNameList.includes(targetUnivName)) {
      throw new RangeError(
        `[ERROR] ${targetUnivName} の情報は登録されていません。`
      );
    }
  });
  return univIds.filter((univ) => targetUnivNames.includes(univ.UNIV_NAME));
}

/**
 * 外国人用組織ID用の所属課程分類ID一覧を取得
 * 外国人用組織IDは `<大学ID>-<所属課程分類ID>` という文字列となっている。
 * ここではハイフンを含めた所属課程分類IDとその課程分類がオブジェクトの配列として返ってくる。
 * @returns {array}
 */
function getAllIntlIdSuffixes() {
  return getIds_('intlIdSuffixes');
}

/**
 * 指定した大学IDの外国人用組織ID一式を、大学ごとにまとまった二次元配列として返す。
 * @param {array} targetUnivIds 指定する大学IDの配列
 * @returns {array} 大学IDごとに外国人用組織ID一式を格納した二次元配列
 */
function getIntlIds(targetUnivIds) {
  return verifyUnivNamesIds_(targetUnivIds).map((targetUnivId) =>
    getAllIntlIdSuffixes().map(
      (intlIdSuffix) => targetUnivId + intlIdSuffix.INTL_ID_SUFFIX
    )
  );
}

/**
 * 全ての年の学部・研究科等組織ID一覧を取得
 * @returns {*}
 */
function getAllOrganizationIds() {
  return getIds_('organizationIds');
}

/**
 * 指定した年の、特定の大学についての学部・研究科等組織ID一覧を取得
 * @param {number} targetYear 年度ごとに定義された学部・研究科等組織IDのうち、年度を指定
 * @param {array} targetUnivNames 学部・研究科等組織IDを取得したい大学名（string）の配列
 * @returns {*}
 */
function getOrganizationIdsbyUniv(targetYear, targetUnivNames) {
  const allOrgIds = getAllOrganizationIds();
  if (!allOrgIds[targetYear]) {
    throw new RangeError(
      `[ERROR] ${targetYear}年度の学部・研究科等組織IDは取得できません。`
    );
  }
  let orgIdsObj = {};
  verifyUnivNamesIds_(targetUnivNames).forEach((targetUnivName) => {
    if (!allOrgIds[targetYear][targetUnivName]) {
      throw new RangeError(
        `[ERROR] ${targetUnivName}の情報は登録されていません。`
      );
    }
    orgIdsObj[targetUnivName] = allOrgIds[targetYear][targetUnivName];
  });
  return orgIdsObj;
}

/**
 * ポートレートAPIの呼び出しで必要となる組織ID一覧を、非公式のweb appから取得する
 * @param {string?} mode 取得する組織IDの種類を指定する場合は
 * `univIds`（大学ID）、`intlIdSuffixes`（外国人用組織ID）、`organizationIds`（学部・研究科等組織ID）
 * のいずれかを指定する。空白であれば、全ての一覧が返ってくる
 * @returns {*}
 */
function getIds_(mode) {
  const sp = PropertiesService.getScriptProperties().getProperties();
  let url = `${sp.webAppUrl}?key=${sp.webAppKey}`;
  url += mode ? `&mode=${mode}` : '';
  const response = JSON.parse(
    UrlFetchApp.fetch(url, {
      method: 'get',
    }).getContentText()
  );
  return mode ? response[mode] : response;
}

/**
 * 引数として渡した大学名の配列を検証。問題がなければ、入力値をそのまま出力する。
 * @param {array} univNamesIds 情報を取得したい大学名または大学IDの配列
 * @returns {array} 入力した大学名の配列
 * @private
 */
function verifyUnivNamesIds_(univNamesIds) {
  if (!Array.isArray(univNamesIds)) {
    throw new TypeError(
      `[ERROR] 引数として渡された ${univNamesIds} が配列ではありません。`
    );
  } else if (univNamesIds.length < 1) {
    throw new RangeError('[ERROR] 必ず1つ以上の大学を指定してください。');
  }
  return univNamesIds;
}

/**
 * 引数として渡したポートレートAPIのアクセスキーを検証。問題がなければ、入力値をそのまま出力する。
 * @param {string} accessKey ポートレートAPIのアクセスキー
 * @returns {string} 入力したアクセスキー
 * @private
 */
function verifyAccessKey_(accessKey) {
  if (!accessKey) {
    throw new Error(
      '[ERROR] アクセスキーが空白のままAPIを呼び出そうとしています。必ずポートレートAPIのアクセスキーを設定した上で、実行してください。'
    );
  }
  if (accessKey.match(/^[^:/@]+?$/)) {
    return accessKey;
  } else {
    throw new RangeError(
      '[ERROR] 引数として渡されたアクセスキーが所定の形式でないようです。入力値をご確認ください。'
    );
  }
}

if (typeof module === 'object') {
  module.exports = {
    getStudentFacultyStatus,
    getCollegeUndergraduateStudentsDetail,
    getGraduateStudentsDetail,
    getJuniorCollegeUndergraduateStudentsDetail,
    getForeignStudent,
    getStatusAfterGraduationGraduates,
    getStatusAfterGraduationJobs,
    getSchoolFacilities,
    getAllIds,
    getAllUnivIds,
    getUnivIds,
    getAllIntlIdSuffixes,
    getIntlIds,
    getAllOrganizationIds,
    getOrganizationIdsbyUniv,
    verifyUnivNamesIds_,
    verifyAccessKey_,
  };
}
