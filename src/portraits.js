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

/**
 * 大学ポートレートWeb-APIとの接続を定義。
 * @param {String} accessName この接続の名称。
 * @returns {PortraitsService_}
 */
function setup(accessName) {
  return new PortraitsService_(accessName);
}

/**
 * 大学ポートレートWeb-APIとの一意の接続。
 * ポートレートAPIのアクセスキーごとに定義される
 */
class PortraitsService_ {
  /**
   * @param {String} accessName
   */
  constructor(accessName) {
    if (!accessName) {
      throw new Error(
        'accessNameは必須です。setup(accessName)にて必ず指定してください。'
      );
    }
    this.accessName_ = accessName;
  }
  /**
   * 大学ポートレートWeb-APIアクセスキーを設定
   * @param {Sring} accessKey 大学ポートレートWeb-APIポータルサイトでユーザ登録により取得したアクセスキー
   * @returns {!PortraitsService_} This PortraitsService_, for chaining.
   * @see https://api-portal.portraits.niad.ac.jp/
   */
  setAccessKey(accessKey) {
    this.accessKey_ = accessKey;
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
      const prefix = STORAGE_PREFIX + this.accessName_;
      this.storage_ = new Storage_(prefix, this.propertyStore_, this.cache_);
    }
    return this.storage_;
  }
  /**
   * アクセスキーをこのPortraitsService_で指定したproperty storeとcacheに保存する。
   * @param {String} accessKey 保存するアクセスキー
   * @private
   */
  saveAccessKey_(accessKey) {
    this.getStorage().setValue(null, accessKey);
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
  }
}

if (typeof module === 'object') {
  module.exports = { setup };
}
