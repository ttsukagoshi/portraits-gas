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
const API_VERSION = 'v1';

/**
 * 大学ポートレートWeb-APIとの接続を定義。
 * @param {String} appName このアプリケーションの名称。
 * @returns {PortraitsService_}
 */
function init(appName) {
  return new PortraitsService_(appName);
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
   * setPropertyStoreで指定したpropertyのスコープと揃える。
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
   *
   * @returns {boolean}
   */
  hasAccess() {
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
    let url = `https://edit.portraits.niad.ac.jp/api/${API_VERSION}/SchoolBasicSurvey/getStudentFacultyStatus`;
    url += `?accesskey=${this.getAccessKey()}&year=${year}&orgid=${univId}`;
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

if (typeof module === 'object') {
  module.exports = { init };
}
