/*
MIT License

Copyright (c) 2022 Taro TSUKAGOSHI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const STORAGE_PREFIX = 'portraits.';
const API_BASE_URL = 'https://edit.portraits.niad.ac.jp/api/';
const API_VERSION = 'v1';

/**
 * 大学ポートレートWeb-APIとの接続を定義。
 * @param {String} appName このアプリケーションの名称。
 * @returns {PortraitsService_}
 */
function init(appName) {
  return new PortraitsService_(appName);
}

/**
 * 大学ポートレートWeb-APIで大学基本情報等を呼び出す際に必要となる
 * 大学IDなどの組織IDを参照するためのクラス
 * @returns {PortraitsIdsService_}
 */
function getIds() {
  const sp = PropertiesService.getScriptProperties().getProperties();
  return new PortraitsIdsService_(sp.webAppUrl, sp.webAppKey);
}

class PortraitsService_ {
  /**
   * 大学ポートレートWeb-APIとの一意の接続。
   * ポートレートAPIのアクセスキーごとに定義する。
   * @param {String} appName
   */
  constructor(appName) {
    if (!appName) {
      throw new Error('appNameは必須です。必ず指定してください。');
    }
    this.appName_ = appName;
  }

  /**
   * 大学ポートレートWeb-APIアクセスキーを設定
   * @param {Sring} accessKey 大学ポートレートWeb-APIポータルサイトでユーザ登録により取得したアクセスキー
   * @returns {!PortraitsService_} This PortraitsService_, for chaining.
   * @see https://api-portal.portraits.niad.ac.jp/
   */
  setAccessKey(accessKey) {
    this.accessKey_ = accessKey;
    this.getStorage().setValue(null, accessKey);
    return this;
  }

  /**
   * アクセスキーを保管するpropertyを設定。
   * 通常はuser propertyであると想定されるが、組織や部署で共有するツールの場合、
   * documentやscript propertyとしたほうが適切である場合も。
   * @param {PropertiesService.Properties} propertyStore
   * @returns {!PortraitsService_} This PortraitsService_, for chaining.
   * @see https://developers.google.com/apps-script/reference/properties/
   */
  setPropertyStore(propertyStore) {
    this.propertyStore_ = propertyStore;
    return this;
  }

  /**
   * アクセスキー参照の際に使用するキャッシュの種類を指定（任意）。
   * キャッシュを使用することで、Property参照の回数を減らせるため、スクリプト高速化につながる
   * 可能性あり。通常はuser cacheであると想定されるが、組織や部署で共有するツールの場合、
   * documentやscript cacheとしたほうが適切である場合も。
   * setPropertyStoreで指定したpropertyのスコープと揃えることを想定。
   * @param {CacheService.Cache} cache アクセスキーを参照するためのキャッシュの種類
   * @returns {!PortraitsService_} This PortraitsService_, for chaining.
   * @see https://developers.google.com/apps-script/reference/cache/
   */
  setCache(cache) {
    this.cache_ = cache;
    return this;
  }

  /**
   * 一貫したアクセスキーを保持するための、Storageとの接続レイヤー
   * @returns {Storage_} このPortraitsService_でのstorage
   */
  getStorage() {
    if (!this.storage_) {
      const prefix = STORAGE_PREFIX + this.appName_;
      this.storage_ = new Storage_(prefix, this.propertyStore_, this.cache_);
    }
    return this.storage_;
  }

  /**
   * このPortraitsService_で指定したproperty storeまたはcacheからアクセスキーを呼び出す。
   * @returns {String} アクセスキー。アクセスキーが存在しない場合はnull
   */
  getAccessKey() {
    return this.getStorage().getValue(null); // アクセスキー保存のために割り当てているnullキーで呼び出し
  }

  /**
   * このPortraitsService_を初期化。登録したアクセスキーを削除する。
   * 再度APIと接続するためには再定義が必要となる。
   */
  reset() {
    this.getStorage().reset();
  }

  /**
   * アクセスキーが登録済みであるか否かを判定
   * @returns {boolean} アクセスキーが登録済みの場合、`true`を返す
   */
  hasAccessKey() {
    return this.getAccessKey() ? true : false;
  }

  /**
   * 学生教員等状況票API情報取得
   * @param {Number} year 対象年度の西暦4桁
   * @param {String} univId 4桁の大学ID
   * @returns {Object}
   * @see https://api-portal.portraits.niad.ac.jp/api-info.html
   */
  getStudentFacultyStatus(year, univId) {
    const params = `accesskey=${this.getAccessKey()}&year=${year}&orgid=${univId}`;
    const url =
      API_BASE_URL +
      API_VERSION +
      `/SchoolBasicSurvey/getStudentFacultyStatus?${params}`;
    return JSON.parse(
      UrlFetchApp.fetch(url, { method: 'get' }).getContentText()
    );
  }

  /**
   * 学部学生内訳票API情報取得
   * @param {Number} year 対象年度の西暦4桁
   * @param {String} orgId 学部・研究科等組織ID
   * @returns {Object}
   * @see https://api-portal.portraits.niad.ac.jp/api-info.html
   */
  getCollegeUndergraduateStudentsDetail(year, orgId) {
    const params = `accesskey=${this.getAccessKey()}&year=${year}&orgid=${orgId}`;
    const url =
      API_BASE_URL +
      API_VERSION +
      `/SchoolBasicSurvey/getCollegeUndergraduateStudentsDetail?${params}`;
    return JSON.parse(
      UrlFetchApp.fetch(url, { method: 'get' }).getContentText()
    );
  }

  /**
   * 大学院学生内訳票API情報取得
   * @param {Number} year 対象年度の西暦4桁
   * @param {String} orgId 学部・研究科等組織ID
   * @returns {Object}
   * @see https://api-portal.portraits.niad.ac.jp/api-info.html
   */
  getGraduateStudentsDetail(year, orgId) {
    const params = `accesskey=${this.getAccessKey()}&year=${year}&orgid=${orgId}`;
    const url =
      API_BASE_URL +
      API_VERSION +
      `/SchoolBasicSurvey/getGraduateStudentsDetail?${params}`;
    return JSON.parse(
      UrlFetchApp.fetch(url, { method: 'get' }).getContentText()
    );
  }

  /**
   * 本科学生内訳票API情報取得
   * @param {Number} year 対象年度の西暦4桁
   * @param {String} univId 4桁の大学ID
   * @returns {Object}
   * @see https://api-portal.portraits.niad.ac.jp/api-info.html
   */
  getJuniorCollegeUndergraduateStudentsDetail(year, univId) {
    const params = `accesskey=${this.getAccessKey()}&year=${year}&orgid=${univId}`;
    const url =
      API_BASE_URL +
      API_VERSION +
      `/SchoolBasicSurvey/getJuniorCollegeUndergraduateStudentsDetail?${params}`;
    return JSON.parse(
      UrlFetchApp.fetch(url, { method: 'get' }).getContentText()
    );
  }

  /**
   * 外国人学生調査票API情報取得
   * @param {Number} year 対象年度の西暦4桁
   * @param {String} foreignId 外国人学生用組織ID
   * @returns {Object}
   * @see https://api-portal.portraits.niad.ac.jp/api-info.html
   */
  getForeignStudent(year, foreignId) {
    const params = `accesskey=${this.getAccessKey()}&year=${year}&orgid=${foreignId}`;
    const url =
      API_BASE_URL +
      API_VERSION +
      `/SchoolBasicSurvey/getForeignStudent?${params}`;
    return JSON.parse(
      UrlFetchApp.fetch(url, { method: 'get' }).getContentText()
    );
  }

  /**
   * 卒業後の状況調査票(2-1)API情報取得
   * @param {Number} year 対象年度の西暦4桁
   * @param {String} orgId 学部・研究科等組織ID
   * @returns {Object}
   * @see https://api-portal.portraits.niad.ac.jp/api-info.html
   */
  getStatusAfterGraduationGraduates(year, orgId) {
    const params = `accesskey=${this.getAccessKey()}&year=${year}&orgid=${orgId}`;
    const url =
      API_BASE_URL +
      API_VERSION +
      `/SchoolBasicSurvey/getStatusAfterGraduationGraduates?${params}`;
    return JSON.parse(
      UrlFetchApp.fetch(url, { method: 'get' }).getContentText()
    );
  }

  /**
   * 卒業後の状況調査票(2-2)API情報取得
   * @param {Number} year 対象年度の西暦4桁
   * @param {String} orgId 学部・研究科等組織ID
   * @returns {Object}
   * @see https://api-portal.portraits.niad.ac.jp/api-info.html
   */
  getStatusAfterGraduationJobs(year, orgId) {
    const params = `accesskey=${this.getAccessKey()}&year=${year}&orgid=${orgId}`;
    const url =
      API_BASE_URL +
      API_VERSION +
      `/SchoolBasicSurvey/getStatusAfterGraduationJobs?${params}`;
    return JSON.parse(
      UrlFetchApp.fetch(url, { method: 'get' }).getContentText()
    );
  }

  /**
   * 学校施設調査票(2-2)API情報取得
   * @param {Number} year 対象年度の西暦4桁
   * @param {String} univId 4桁の大学ID
   * @returns {Object}
   * @see https://api-portal.portraits.niad.ac.jp/api-info.html
   */
  getSchoolFacilities(year, univId) {
    const params = `accesskey=${this.getAccessKey()}&year=${year}&orgid=${univId}`;
    const url =
      API_BASE_URL +
      API_VERSION +
      `/SchoolBasicSurvey/getSchoolFacilities?${params}`;
    return JSON.parse(
      UrlFetchApp.fetch(url, { method: 'get' }).getContentText()
    );
  }
}

/**
 * アクセスキーなどをProperty storeやキャッシュとして保存し、呼び出すためのクラス
 */
class Storage_ {
  constructor(prefix, optProperties, optCache) {
    this.prefix_ = prefix;
    this.properties_ = optProperties;
    this.cache_ = optCache;
    this.memory_ = {};
    this.CACHE_EXPIRATION_TIME_SECONDS_ = 21600; // キャッシュのTTL（秒）。21600 sec = 6 hr
    this.CACHE_NULL_VALUE_ = '__NULL__'; // キャッシュに値が存在しないことを示す特別な値
  }

  /**
   * 保存された値を呼び出す
   * @param {String} key キー
   * @param {Boolean?} optSkipMemoryCheck 値を呼び出す時にローカルのキャッシュをバイパスするか否かのオプション。デフォルトではfalse。
   * @return {*} 保存された値。保存された値が存在しなければnullを返す
   */
  getValue(key, optSkipMemoryCheck) {
    const prefixedKey = this.getPrefixedKey_(key);
    let jsonValue, value;
    if (!optSkipMemoryCheck) {
      // メモリ内のキャッシュを確認
      if ((value = this.memory_[prefixedKey])) {
        if (value === this.CACHE_NULL_VALUE_) {
          return null;
        }
        return value;
      }
    }
    // CacheService内のキャッシュを確認
    if (this.cache_ && (jsonValue = this.cache_.get(prefixedKey))) {
      value = JSON.parse(jsonValue);
      this.memory_[prefixedKey] = value;
      if (value === this.CACHE_NULL_VALUE_) {
        return null;
      }
      return value;
    }
    // PropertiesService内のプロパティを確認
    if (
      this.properties_ &&
      (jsonValue = this.properties_.getProperty(prefixedKey))
    ) {
      if (this.cache_) {
        this.cache_.put(
          prefixedKey,
          jsonValue,
          this.CACHE_EXPIRATION_TIME_SECONDS_
        );
      }
      value = JSON.parse(jsonValue);
      this.memory_[prefixedKey] = value;
      return value;
    }

    // Not found. Store a special null value in the memory and cache to reduce
    // hits on the PropertiesService.
    this.memory_[prefixedKey] = this.CACHE_NULL_VALUE_;
    if (this.cache_) {
      this.cache_.put(
        prefixedKey,
        JSON.stringify(this.CACHE_NULL_VALUE_),
        this.CACHE_EXPIRATION_TIME_SECONDS_
      );
    }
    return null;
  }

  /**
   * 値を保存する
   * @param {String} key 保存する値のキー
   * @param {*} value 保存する値
   */
  setValue(key, value) {
    const prefixedKey = this.getPrefixedKey_(key);
    const jsonValue = JSON.stringify(value);
    if (this.properties_) {
      this.properties_.setProperty(prefixedKey, jsonValue);
    }
    if (this.cache_) {
      this.cache_.put(
        prefixedKey,
        jsonValue,
        this.CACHE_EXPIRATION_TIME_SECONDS_
      );
    }
    this.memory_[prefixedKey] = value;
  }

  /**
   * 保存されている値を、キーを指定して削除する。
   * @param {String} key 保存する値のキー
   */
  removeValue(key) {
    const prefixedKey = this.getPrefixedKey_(key);
    this.removeValueWithPrefixedKey_(prefixedKey);
  }

  /**
   * 保存されている全ての値を削除して初期化する。
   */
  reset() {
    const prefix = this.getPrefixedKey_();
    let prefixedKeys = Object.keys(this.memory_);
    if (this.properties_) {
      const props = this.properties_.getProperties();
      prefixedKeys = Object.keys(props).filter(
        (prefixedKey) =>
          prefixedKey === prefix || prefixedKey.indexOf(prefix + '.') === 0
      );
    }
    prefixedKeys.forEach((prefixedKey) =>
      this.removeValueWithPrefixedKey_(prefixedKey)
    );
  }

  /**
   * 保存されている値を、Prefix付きキーを指定して削除する。
   * @param {string} prefixedKey Prefix付きキー
   */
  removeValueWithPrefixedKey_(prefixedKey) {
    if (this.properties_) {
      this.properties_.deleteProperty(prefixedKey);
    }
    if (this.cache_) {
      this.cache_.remove(prefixedKey);
    }
    delete this.memory_[prefixedKey];
  }

  /**
   * 指定したキーに対してPrefix付きキーを返す
   * @param {string?} key キー
   * @return {string} Prefix付きキー
   * @private
   */
  getPrefixedKey_(key) {
    if (key) {
      return this.prefix_ + '.' + key;
    } else {
      return this.prefix_;
    }
  }
}

/**
 * ポートレートAPIの呼び出しで必要となる組織ID一覧を、非公式のweb appから取得するためのクラス。
 *
 * 非公式web appの内実は、公式サイトに掲載されている詳細仕様の別紙（組織ID一覧等）をダウンロードして、
 * Googleスプレッドシートにしたもの。web appとして公開した上で、GETリクエストを受けると
 * そのコンテンツをJSON形式で返す
 * @see https://api-portal.portraits.niad.ac.jp/api-info.html
 */
class PortraitsIdsService_ {
  /**
   * @param {String} webAppUrl スクリプトプロパティに保存した、web appのURL
   * @param {String} webAppKey スクリプトプロパティに保存した、web appで正常に処理が行われるようにするためのkey
   */
  constructor(webAppUrl, webAppKey) {
    const response = JSON.parse(
      UrlFetchApp.fetch(`${webAppUrl}?key=${webAppKey}`, {
        method: 'get',
      }).getContentText()
    );
    this.univIds = response.univIds;
    this.intlIdSuffixes = response.intlIdSuffixes;
    this.organizationIds = response.organizationIds;
  }

  /**
   * 全てのID一覧を取得
   * @returns {Object}
   */
  getAll() {
    return {
      univIds: this.univIds,
      intlIdSuffixes: this.intlIdSuffixes,
      organizationIds: this.organizationIds,
    };
  }

  /**
   * 大学ID一覧を取得
   * @returns {Array}
   */
  getAllUnivIds() {
    return this.univIds;
  }

  /**
   * 指定した大学のIDを取得
   * @param {Array} targetUnivNames 大学名の配列
   * @returns {Array} 指定した大学について、大学名とIDがセットになったオブジェクトの配列
   */
  getUnivIds(targetUnivNames) {
    const univNameList = this.univIds.map((univ) => univ.UNIV_NAME);
    this.verifyUnivNamesIds_(targetUnivNames).forEach((targetUnivName) => {
      if (!univNameList.includes(targetUnivName)) {
        throw new RangeError(
          `[ERROR] ${targetUnivName}の情報は登録されていません。`
        );
      }
    });
    return this.univIds.filter((univ) =>
      targetUnivNames.includes(univ.UNIV_NAME)
    );
  }

  /**
   * 外国人用組織ID用の所属課程分類ID一覧を取得
   * 外国人用組織IDは `<大学ID>-<所属課程分類ID>` という文字列となっている。
   * ここではハイフンを含めた所属課程分類IDとその課程分類がオブジェクトの配列として返ってくる。
   * @returns {array}
   */
  getAllIntlIdSuffixes() {
    return this.intlIdSuffixes;
  }

  /**
   * 指定した大学IDの外国人用組織ID一式を、大学ごとにまとまった二次元配列として返す。
   * @param {array} targetUnivIds 指定する大学IDの配列
   * @returns {array} 大学IDごとに外国人用組織ID一式を格納した二次元配列
   */
  getIntlIds(targetUnivIds) {
    return this.verifyUnivNamesIds_(targetUnivIds).map((targetUnivId) =>
      this.intlIdSuffixes.map(
        (intlIdSuffix) => targetUnivId + intlIdSuffix.INTL_ID_SUFFIX
      )
    );
  }

  /**
   * 全ての年の学部・研究科等組織ID一覧を取得
   * @returns {Object}
   */
  getAllOrganizationIds() {
    return this.organizationIds;
  }

  /**
   * 指定した年の、特定の大学についての学部・研究科等組織ID一覧を取得
   * @param {number} targetYear 年度ごとに定義された学部・研究科等組織IDのうち、年度を指定
   * @param {array} targetUnivNames 学部・研究科等組織IDを取得したい大学名（string）の配列
   * @returns {Object}
   */
  getOrganizationIdsbyUniv(targetYear, targetUnivNames) {
    if (!this.organizationIds[targetYear]) {
      throw new RangeError(
        `[ERROR] ${targetYear}年度の学部・研究科等組織IDは取得できません。`
      );
    }
    let orgIdsObj = {};
    this.verifyUnivNamesIds_(targetUnivNames).forEach((targetUnivName) => {
      if (!this.organizationIds[targetYear][targetUnivName]) {
        throw new RangeError(
          `[ERROR] ${targetUnivName}の情報は登録されていません。`
        );
      }
      orgIdsObj[targetUnivName] =
        this.organizationIds[targetYear][targetUnivName];
    });
    return orgIdsObj;
  }

  /**
   * 引数として渡した大学名の配列を検証。問題がなければ、入力値をそのまま出力する。
   * @param {array} univNamesIds 情報を取得したい大学名または大学IDの配列
   * @returns {array} 入力した大学名の配列
   * @private
   */
  verifyUnivNamesIds_(univNamesIds) {
    if (!Array.isArray(univNamesIds)) {
      throw new TypeError(
        `[ERROR] 引数として渡された ${univNamesIds} が配列ではありません。`
      );
    } else if (univNamesIds.length < 1) {
      throw new RangeError('[ERROR] 必ず1つ以上の大学を指定してください。');
    }
    return univNamesIds;
  }
}

if (typeof module === 'object') {
  module.exports = { init, getIds };
}
