# Portraits-GAS

大学ポートレート Web-API https://api-portal.portraits.niad.ac.jp/ （以下「ポートレート API」）を Google Apps Script (GAS) で使うためのライブラリです。

GAS のスクリプトサンプルを交えながら、ライブラリの使い方をご紹介します。

> ## 目次
>
> - [0. ライブラリを自分のスクリプトに追加する](#0-ライブラリを自分のスクリプトに追加する)
>   - [0-1. 一般的な方法](0-1-一般的な方法)
>   - [0-2. `appsscript.json` に追記する方法](#0-2-appsscriptjson-に追記する方法)
> - [1. 使い方](#1-使い方)
>   - [1-0. ポートレート API サービス呼び出し用の関数を定義](#1-0-ポートレート-api-サービス呼び出し用の関数を定義)
>   - [1-1. ポートレート API のアクセスキーを登録](#1-1-ポートレート-api-のアクセスキーを登録)
>   - [1-2. アクセスキーを削除（リセット）したい場合](#1-2-アクセスキーを削除リセットしたい場合)
>   - [1-3. API 呼び出しに必要な組織 ID の参照](#1-3-api-呼び出しに必要な組織-id-の参照)
>     - [1-3-1. 大学 ID の参照](#1-3-1-大学-id-の参照)
>     - [1-3-2. 学部・研究科等組織 ID の参照](#1-3-2-学部研究科等組織-id-の参照)
>     - [1-3-3. 外国人用組織 ID の参照](#1-3-3-外国人用組織-id-の参照)
>     - [1-3-4. 全ての組織 ID を一度に取得する](#1-3-4-全ての組織-id-を一度に取得する)
> - [2. 使用可能なメソッド一覧](#2-使用可能なメソッド一覧)
>   - [`init(appName)`](#initappname)
>   - [`getIds()`](#getids)
>   - [`PortraitsService_`クラス](#portraitsservice_-クラス)
>     - [`setAccessKey(accessKey)`](#setaccesskeyaccesskey)
>     - [`setPropertyStore(propertyStore)`](#setpropertystorepropertystore)
>     - [`setCache(cache)`](#setcachecache)
>     - [`getAccessKey()`](#getaccesskey)
>     - [`reset()`](#reset)
>     - [`hasAccessKey()`](#hasaccesskey)
>     - [`getStudentFacultyStatus(year, univId)`](#getstudentfacultystatusyear-univid)
>     - [`getCollegeUndergraduateStudentsDetail(year, orgId)`](#getcollegeundergraduatestudentsdetailyear-orgid)
>     - [`getGraduateStudentsDetail(year, orgId)`](#getgraduatestudentsdetailyear-orgid)
>     - [`getJuniorCollegeUndergraduateStudentsDetail(year, univId)`](#getjuniorcollegeundergraduatestudentsdetailyear-univid)
>     - [`getForeignStudent(year, foreignId)`](#getforeignstudentyear-foreignid)
>     - [`getStatusAfterGraduationGraduates(year, orgId)`](#getstatusaftergraduationgraduatesyear-orgid)
>     - [`getStatusAfterGraduationJobs(year, orgId)`](#getstatusaftergraduationjobsyear-orgid)
>     - [`getSchoolFacilities(year, univId)`](#getschoolfacilitiesyear-univid)
>   - [`PortraitsIdsService_`クラス](#portraitsidsservice_-クラス)
>     - [`getAll()`](#getall)
>     - [`getAllUnivIds()`](#getallunivids)
>     - [`getUnivIds(targetUnivNames)`](#getunividstargetunivnames)
>     - [`getAllIntlIdSuffixes()`](#getallintlidsuffixes)
>     - [`getIntlIds(targetUnivIds)`](#getintlidstargetunivids)
>     - [`getAllOrganizationIds()`](#getallorganizationids)
>     - [`getOrganizationIdsbyUniv(targetYear, targetUnivNames)`](#getorganizationidsbyunivtargetyear-targetunivnames)
>     - [`reset()`](#reset)
>     - [`reset()`](#reset)
> - [3. 告知](#3-告知)

## 0. ライブラリを自分のスクリプトに追加する

### 0-1. 一般的な方法

1. GAS スクリプトエディターの編集画面左側にある「ライブラリ」の「＋」をクリック。
2. スクリプト ID `1463IXI3rMb1b76Iwbm-jhuAiondvoDESz0FRPrOvi817HuKNnNJcfYhg` を入力して「検索」
3. 最新のバージョンを選んで「追加」。ここでデフォルトで `Portraits` となっている ID が、スクリプト内でライブラリ呼び出しに使うものです。任意の文字列でいいですが、以下の説明は `Portraits` としてあります。

### 0-2. `appsscript.json` に追記する方法

```json
{
  ...
  "dependencies": {
    "libraries": [
      {
        "userSymbol": "Portraits",
        "version": "4", // ここでバージョンを指定する。
        "libraryId": "1463IXI3rMb1b76Iwbm-jhuAiondvoDESz0FRPrOvi817HuKNnNJcfYhg",
        "developmentMode": false
      }
    ]
  },
  ...
}
```

## 1. 使い方

### 1-0. ポートレート API サービス呼び出し用の関数を定義

`getPortraitsService_` という関数名は任意です。以降の項目ではここで定義したものを指します。

```javascript
function getPortraitsService_() {
  return Portraits.init('my-portraits-app-name') // アプリ名を登録
    .setPropertyStore(PropertiesService.getUserProperties()) // プロパティのスコープは目的に合わせて script propertiesやdocument propertiesも指定可能
    .setCache(CacheService.getUserCache()); // 任意。プロパティのスコープと揃えることを想定。
}
```

### 1-1. ポートレート API のアクセスキーを登録

初期設定として API のアクセスキーを登録するには、[1-0 で定義した API サービス呼び出し関数](#1-0-ポートレート-api-サービス呼び出し用の関数を定義)を経由して、`setAccessKey(key)`メソッドを使います。

Google スプレッドシートのアドオンで、アクセスキーをアドオンのユーザに入力してもらう例：

```javascript
function setAccessKeyByUser() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'アクセスキーを入力してください。',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() === ui.Button.OK) {
    getPortraitsService_().setAccessKey(response.getResponseText());
  } else {
    throw new Error('キャンセルされました。');
  }
}
```

組織/チームで共通で利用するアクセスキーを利用するために、アドオンの script property 内にあらかじめアクセスキーを保存しておくシナリオも想定できます。：

```javascript
function setAccessKeyAddon() {
  getPortraitsService_().setAccessKey(
    PropertiesService.getScriptProperties().getProperty('accessKey')
  );
}
```

以降、アクセスキーは 1-0 で開発者が指定したアプリ名をキーとしてスコープのプロパティ内に保存され、`getPortraitsService_()`経由で API を呼び出し時には自動的に参照されるようになっています。

### 1-2. アクセスキーを削除（リセット）したい場合

アクセスキーをユーザに入力しておらうようなケースでは、逆にそのキーを削除したいこともあるでしょう。その場合は`reset()`を使います：

```javascript
function resetPortraits() {
  getPortraitsService_().reset();
}
```

### 1-3. API 呼び出しに必要な組織 ID の参照

[API の公式ページ](https://api-portal.portraits.niad.ac.jp/api-info.html)から参照できる仕様書にあるとおり、API を通じて情報を参照するには呼び出しごとに組織 ID（大学 ID または学部・研究科等組織 ID）を指定する必要があります。

その組織 ID 自体は API からは直接参照できず、[公式ページ](https://api-portal.portraits.niad.ac.jp/api-info.html)から Excel ファイルをダウンロードなどする必要がありますが、本ライブラリではその一覧を取得できるようになっています。

#### 1-3-1. 大学 ID の参照

大学 ID は `getAllUnivIds()` や `getUnivIds(targetUnivNames: string[])` で参照できます。

```javascript
const targetUnivName = '○○大学';

const ps = getPortraitsService_();
const ids = Portraits.getIds();
const targetUnivId = ids.getUnivIds([targetUnivName])[0].UNIV_ID; // getUnivIds()が受け取るのは大学名の配列
console.log(JSON.stringify(ps.getStudentFacultyStatus(2021, targetUnivId)));
```

`UNIV_ID` と `UNIV_NAME` をキーとした、以下のようなオブジェクトの配列が返ってきます：

```json
[
  {
    "UNIV_ID": "0000", // 大学ID
    "UNIV_NAME": "○○大学" // 大学名
  }
]
```

#### 1-3-2. 学部・研究科等組織 ID の参照

学部・研究科等組織 ID は `getAllOrganizationIds()` や `getOrganizationIdsbyUniv(targetYear: number, targetUnivNames: string[])` で参照でき、学部・研究科ごとに取りまとめられているデータの取得に使います。

```javascript
const ps = getPortraitsService_();
const ids = Portraits.getIds();
const oids = ids.getOrganizationIdsbyUniv(2021, ['○○大学', '▲▲大学']);
Object.keys(oids).forEach((univ) => {
  oids[univ].forEach((org) => {
    console.log(
      JSON.stringify(
        ps.getCollegeUndergraduateStudentsDetail(2021, org.OID) // 学部学生内訳票の取得
      )
    );
  });
}
```

学部・研究科等組織 ID は、学部新設などを考慮して年度ごとに定義されているようです。

```json
{
  "2021": {
    "○○大学": [
      {
        "OID": "0100-01-01-1K08-00-1", // 学部・研究科等組織ID
        "DEP": "○○学部", // 学部・研究科名
        "LOC": "○○", // 所在地
        "CTG": "", // 分類
        "DN": "昼間" // 昼間 or 夜間
      },
      {
        "OID": "0100-01-01-1Y68-01-1",
        "DEP": "○○研究科",
        "LOC": "○○",
        "CTG": "修士課程",
        "DN": "昼間"
      },
      ...
    ],
    ...
  },
  ...
}
```

`getOrganizationIdsbyUniv()` で個別に大学名を指定して取得する場合は、年度も合わせて指定します。戻り値は大学ごとに出力されます。

```json
{
  "○○大学": [
    {
      "OID": "0100-01-01-1K08-00-1",
      "DEP": "○○学部",
      "LOC": "○○",
      "CTG": "",
      "DN": "昼間"
    },
    ...
  ],
  ...
}
```

#### 1-3-3. 外国人用組織 ID の参照

外国人用組織 ID は `<大学ID>`-`<所属課程分類ID>` という文字列となっていて、ハイフン以降の後半部分である所属課程分類 ID を `getAllIntlIdSuffixes()` でまとめて取得したり、 `getIntlIds(targetUnivIds)` で、指定した大学 ID についての`<大学ID>`-`<所属課程分類ID>`の組み合わせ一式を配列として取得できます。外国人学生調査票の取得に使います。

`getAllIntlIdSuffixes()`の出力：

```json
[
  {
    "INTL_ID_SUFFIX": "-1Z11",
    "INTL_CATEGORY": "大学学部、短期大学本科（外国人学生調査票用）"
  },
  {
    "INTL_ID_SUFFIX": "-1Z33",
    "INTL_CATEGORY": "修士課程、博士前期課程、一貫制博士課程の1～2年次（外国人学生調査票用）"
  },
  {
    "INTL_ID_SUFFIX": "-1Z44",
    "INTL_CATEGORY": "博士後期課程、一貫制博士課程の3～5年次、\n医歯学・薬学・獣医学関係の一貫制博士課程（外国人学生調査票用）"
  },
  {
    "INTL_ID_SUFFIX": "-1Z55",
    "INTL_CATEGORY": "専門職学位課程（外国人学生調査票用）"
  }
]
```

`getIntlIds()`は大学 ID の配列を受け取り、その配列の順序を保持したまま、大学ごとの外国人用組織 ID 一式を返します：

```javascript
Portraits.getIds().getIntlIds(['0000', '1111']);
```

の出力は

```json
[
  ["0000-1Z11", "0000-1Z33", "0000-1Z44", "0000-1Z55"], // 大学ID「0000」の外国人用組織ID一式
  ["1111-1Z11", "1111-1Z33", "1111-1Z44", "1111-1Z55"] // 大学ID「1111」の外国人用組織ID一式
]
```

#### 1-3-4. 全ての組織 ID を一度に取得する

全ての種類の組織 ID を一度に取得する場合は `getAll()` を使います：

```javascript
Portraits.getIds().getAll();
```

出力は、全ての組織 ID のオブジェクトです：

```json
{
  "univIds": [
    { "UNIV_ID": "0000", "UNIV_NAME": "○○大学" },
    ...
  ],
  "intlIdSuffixes": [
    {
      "INTL_ID_SUFFIX": "-1Z11",
      "INTL_CATEGORY": "大学学部、短期大学本科（外国人学生調査票用）"
    },
    ...
  ],
  "organizationIds": {
    "2021": {
      "○○大学": [
        {
          "OID": "0100-01-01-1K08-00-1", // 学部・研究科等組織ID
          "DEP": "○○学部", // 学部・研究科名
          "LOC": "○○", // 所在地
          "CTG": "", // 分類
          "DN": "昼間" // 昼間 or 夜間
        },
        {
          "OID": "0100-01-01-1Y68-01-1",
          "DEP": "○○研究科",
          "LOC": "○○",
          "CTG": "修士課程",
          "DN": "昼間"
        },
        ...
      ],
      ...
    },
    ...
  }
}
```

## 2. 使用可能なメソッド一覧

### `init(appName)`

新しい `PortraitsService_`インスタンスの開始、既存の API 接続の呼び出し。API アクセスキーごとに設定するので、通常であれば 1 つのスクリプト/アプリに対して一度定義すれば事足りる。サンプルコードは[こちら](#1-0-ポートレート-api-サービス呼び出し用の関数を定義)。

#### パラメータ

| パラメータ名 | データ型 | 解説                     |
| ------------ | -------- | ------------------------ |
| `appName`    | `String` | アプリケーションの名称。 |

#### 戻り値

[`PortraitsService_`](#portraitsservice_-クラス)

### `getIds()`

大学ポートレート Web-API で大学基本情報等を呼び出す際に必要となる大学 ID などの組織 ID を参照するためのクラス呼び出し。

#### 戻り値

[`PortraitsIdsService_`](#portraitsidsservice_-クラス)

### `PortraitsService_` クラス

#### `setAccessKey(accessKey)`

大学ポートレート Web-API アクセスキーを設定

##### パラメータ

| パラメータ名 | データ型 | 解説                                                                          |
| ------------ | -------- | ----------------------------------------------------------------------------- |
| `accessKey`  | `String` | 大学ポートレート Web-API ポータルサイトでユーザ登録により取得したアクセスキー |

##### 戻り値

[`PortraitsService_`](#portraitsservice_-クラス): この`PortraitsService_`, for chaining

#### `setPropertyStore(propertyStore)`

アクセスキーを保管する property を設定。通常は user property であると想定されるが、組織や部署で共有するツールの場合、document や script property としたほうが適切である場合も。

##### パラメータ

| パラメータ名    | データ型                       | 解説                                                                                                                                                                   |
| --------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `propertyStore` | `PropertiesService.Properties` | Google Apps Script の `PropertiesService` から呼び出せる `Properties` クラス。 https://developers.google.com/apps-script/reference/properties/properties-service?hl=en |

##### 戻り値

[`PortraitsService_`](#portraitsservice_-クラス): この`PortraitsService_`, for chaining

#### `setCache(cache)`

アクセスキー参照の際に使用するキャッシュの種類を指定（任意）。キャッシュを使用することで、Property 参照の回数を減らせるため、スクリプト高速化につながる可能性あり。通常は user cache であると想定されるが、組織や部署で共有するツールの場合、document や script cache としたほうが適切である場合も。

setPropertyStore で指定した property のスコープと揃えることを想定。

##### パラメータ

| パラメータ名 | データ型             | 解説                                                                                                                                                                          |
| ------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cache`      | `CacheService.Cache` | アクセスキーを参照するためのキャッシュの種類。Google Apps Script の `CacheService` から呼び出せる `Cache` クラス。 https://developers.google.com/apps-script/reference/cache/ |

##### 戻り値

[`PortraitsService_`](#portraitsservice_-クラス): この`PortraitsService_`, for chaining

#### `getAccessKey()`

この `PortraitsService_`で指定した property store または cache からアクセスキーを呼び出す。

##### 戻り値

`string`: アクセスキー。アクセスキーが存在しない場合は null

#### `reset()`

この `PortraitsService_` を初期化。登録したアクセスキーを削除する。再度 API と接続するためには再定義が必要となる。

#### `hasAccessKey()`

アクセスキーが登録済みであるか否かを判定

##### 戻り値

`Boolean`: アクセスキーが登録済みの場合、`true`を返す

#### `getStudentFacultyStatus(year, univId)`

学生教員等状況票 API 情報取得

##### パラメータ

| パラメータ名 | データ型 | 解説                |
| ------------ | -------- | ------------------- |
| `year`       | `Number` | 対象年度の西暦 4 桁 |
| `univId`     | `String` | 4 桁の大学 ID       |

##### 戻り値

`Object`: `JSON.parse()`された学生教員等状況票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

#### `getCollegeUndergraduateStudentsDetail(year, orgId)`

学部学生内訳票 API 情報取得

##### パラメータ

| パラメータ名 | データ型 | 解説                  |
| ------------ | -------- | --------------------- |
| `year`       | `Number` | 対象年度の西暦 4 桁   |
| `orgId`      | `String` | 学部・研究科等組織 ID |

##### 戻り値

`Object`: `JSON.parse()`された学部学生内訳票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

#### `getGraduateStudentsDetail(year, orgId)`

大学院学生内訳票 API 情報取得

##### パラメータ

| パラメータ名 | データ型 | 解説                  |
| ------------ | -------- | --------------------- |
| `year`       | `Number` | 対象年度の西暦 4 桁   |
| `orgId`      | `String` | 学部・研究科等組織 ID |

##### 戻り値

`Object`: `JSON.parse()`された大学院学生内訳票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

#### `getJuniorCollegeUndergraduateStudentsDetail(year, univId)`

本科学生内訳票 API 情報取得

##### パラメータ

| パラメータ名 | データ型 | 解説                |
| ------------ | -------- | ------------------- |
| `year`       | `Number` | 対象年度の西暦 4 桁 |
| `univId`     | `String` | 4 桁の大学 ID       |

##### 戻り値

`Object`: `JSON.parse()`された本科学生内訳票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

#### `getForeignStudent(year, foreignId)`

外国人学生調査票 API 情報取得

##### パラメータ

| パラメータ名 | データ型 | 解説                                                             |
| ------------ | -------- | ---------------------------------------------------------------- |
| `year`       | `Number` | 対象年度の西暦 4 桁                                              |
| `foreignId`  | `String` | 外国人学生用組織 ID（`<大学ID>`-`<所属課程分類ID>`の組み合わせ） |

##### 戻り値

`Object`: `JSON.parse()`された外国人学生調査票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

#### `getStatusAfterGraduationGraduates(year, orgId)`

卒業後の状況調査票(2-1) API 情報取得

##### パラメータ

| パラメータ名 | データ型 | 解説                  |
| ------------ | -------- | --------------------- |
| `year`       | `Number` | 対象年度の西暦 4 桁   |
| `orgId`      | `String` | 学部・研究科等組織 ID |

##### 戻り値

`Object`: `JSON.parse()`された卒業後の状況調査票(2-1) API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

#### `getStatusAfterGraduationJobs(year, orgId)`

卒業後の状況調査票(2-2) API 情報取得

##### パラメータ

| パラメータ名 | データ型 | 解説                  |
| ------------ | -------- | --------------------- |
| `year`       | `Number` | 対象年度の西暦 4 桁   |
| `orgId`      | `String` | 学部・研究科等組織 ID |

##### 戻り値

`Object`: `JSON.parse()`された卒業後の状況調査票(2-2) API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

#### `getSchoolFacilities(year, univId)`

学校施設調査票 API 情報取得

##### パラメータ

| パラメータ名 | データ型 | 解説                |
| ------------ | -------- | ------------------- |
| `year`       | `Number` | 対象年度の西暦 4 桁 |
| `univId`     | `String` | 4 桁の大学 ID       |

##### 戻り値

`Object`: `JSON.parse()`された学校施設調査票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

### `PortraitsIdsService_` クラス

#### `getAll()`

全ての種類の組織 ID 一覧を取得

##### 戻り値

`Object`: 詳細は [1-3-4. 全ての組織 ID を一度に取得する](#1-3-4-全ての組織-id-を一度に取得する)。

#### `getAllUnivIds()`

全ての大学 ID 一覧を取得

##### 戻り値

`Array`: 詳細は [1-3-1. 大学 ID の参照](#1-3-1-大学-id-の参照)。

#### `getUnivIds(targetUnivNames)`

指定した大学の ID を取得

##### パラメータ

| パラメータ名      | データ型 | 解説         |
| ----------------- | -------- | ------------ |
| `targetUnivNames` | `Array`  | 大学名の配列 |

##### 戻り値

`Array`: 詳細は [1-3-1. 大学 ID の参照](#1-3-1-大学-id-の参照)。

#### `getAllIntlIdSuffixes()`

外国人用組織 ID 用の所属課程分類 ID 一覧を取得。外国人用組織 ID は `<大学ID>-<所属課程分類ID>` という文字列となっている。ここではハイフンを含めた所属課程分類 ID とその課程分類がオブジェクトの配列として返ってくる。

##### 戻り値

`Array`: 詳細は [1-3-3. 外国人用組織 ID の参照](#1-3-3-外国人用組織-id-の参照)。

#### `getIntlIds(targetUnivIds)`

指定した大学 ID の外国人用組織 ID 一式を、大学ごとにまとまった二次元配列として返す。

##### パラメータ

| パラメータ名    | データ型 | 解説                   |
| --------------- | -------- | ---------------------- |
| `targetUnivIds` | `Array`  | 指定する大学 ID の配列 |

##### 戻り値

`Array`: 詳細は [1-3-3. 外国人用組織 ID の参照](#1-3-3-外国人用組織-id-の参照)。

#### `getAllOrganizationIds()`

全ての年の学部・研究科等組織 ID 一覧を取得

##### 戻り値

`Object`: 詳細は [1-3-2. 学部・研究科等組織 ID の参照](#1-3-2-学部研究科等組織-id-の参照)。

#### `getOrganizationIdsbyUniv(targetYear, targetUnivNames)`

指定した年の、特定の大学についての学部・研究科等組織 ID 一覧を取得

##### パラメータ

| パラメータ名      | データ型 | 解説                                                         |
| ----------------- | -------- | ------------------------------------------------------------ |
| `targetYear`      | `Number` | 年度ごとに定義された学部・研究科等組織 ID のうち、年度を指定 |
| `targetUnivNames` | `Array`  | 学部・研究科等組織 ID を取得したい大学名（string）の配列     |

##### 戻り値

`Object`: 詳細は [1-3-2. 学部・研究科等組織 ID の参照](#1-3-2-学部研究科等組織-id-の参照)。

## 3. 告知

この GAS ライブラリは、[googleworkspace/apps-script-oauth2](https://github.com/googleworkspace/apps-script-oauth2)から枠組みを引用したもので、[大学ポートレートの Web-API 機能](https://api-portal.portraits.niad.ac.jp/index.html)のライブラリとして使用するために改変してあります。独立行政法人大学改革支援・学位授与機構（NIAD）が運用する大学ポートレートの Web-API 機能を使用していますが、本ライブラリの開発は、NIAD と関係のない[Taro Tsukagoshi](https://github.com/ttsukagoshi)によって管理・更新されています。[大学ポートレートの Web-API 機能利用規約](https://api-portal.portraits.niad.ac.jp/agreement.html)および[本ライブラリのライセンス](https://github.com/ttsukagoshi/portraits-gas/blob/main/LICENSE)に同意した上で利用してください。
