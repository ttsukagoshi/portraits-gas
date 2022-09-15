# レファレンス

このライブラリで使用できるメソッドの一覧です。

> ## 目次
>
> ### ポートレート API を呼び出す
>
> - [`getStudentFacultyStatus(accessKey, year, univId)`](#getstudentfacultystatusaccesskey-year-univid)
> - [`getCollegeUndergraduateStudentsDetail(accessKey, year, orgId)`](#getcollegeundergraduatestudentsdetailaccesskey-year-orgid)
> - [`getGraduateStudentsDetail(accessKey, year, orgId)`](#getgraduatestudentsdetailaccesskey-year-orgid)
> - [`getJuniorCollegeUndergraduateStudentsDetail(accessKey, year, univId)`](#getjuniorcollegeundergraduatestudentsdetailaccesskey-year-univid)
> - [`getForeignStudent(accessKey, year, foreignId)`](#getforeignstudentaccesskey-year-foreignid)
> - [`getStatusAfterGraduationGraduates(accessKey, year, orgId)`](#getstatusaftergraduationgraduatesaccesskey-year-orgid)
> - [`getStatusAfterGraduationJobs(accessKey, year, orgId)`](#getstatusaftergraduationjobsaccesskey-year-orgid)
> - [`getSchoolFacilities(accessKey, year, univId)`](#getschoolfacilitiesaccesskey-year-univid)
>
> ### API 呼び出しに必要な組織 ID の参照
>
> - [`getAllIds()`](#getallids)
> - [`getAllUnivIds()`](#getallunivids)
> - [`getUnivIds(targetUnivNames)`](#getunividstargetunivnames)
> - [`getAllIntlIdSuffixes()`](#getallintlidsuffixes)
> - [`getIntlIds(targetUnivIds)`](#getintlidstargetunivids)
> - [`getAllOrganizationIds()`](#getallorganizationids)
> - [`getOrganizationIdsbyUniv(targetYear, targetUnivNames)`](#getorganizationidsbyunivtargetyear-targetunivnames)

## ポートレート API を呼び出す

### `getStudentFacultyStatus(accessKey, year, univId)`

学生教員等状況票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `univId`     | `String` | 4 桁の大学 ID                   |

#### 戻り値

`Object`: `JSON.parse()`された学生教員等状況票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

### `getCollegeUndergraduateStudentsDetail(accessKey, year, orgId)`

学部学生内訳票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `orgId`      | `String` | 学部・研究科等組織 ID           |

#### 戻り値

`Object`: `JSON.parse()`された学部学生内訳票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

### `getGraduateStudentsDetail(accessKey, year, orgId)`

大学院学生内訳票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `orgId`      | `String` | 学部・研究科等組織 ID           |

#### 戻り値

`Object`: `JSON.parse()`された大学院学生内訳票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

### `getJuniorCollegeUndergraduateStudentsDetail(accessKey, year, univId)`

本科学生内訳票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `univId`     | `String` | 4 桁の大学 ID                   |

#### 戻り値

`Object`: `JSON.parse()`された本科学生内訳票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

### `getForeignStudent(accessKey, year, foreignId)`

外国人学生調査票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                                                             |
| ------------ | -------- | ---------------------------------------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー                                  |
| `year`       | `Number` | 対象年度の西暦 4 桁                                              |
| `foreignId`  | `String` | 外国人学生用組織 ID（`<大学ID>`-`<所属課程分類ID>`の組み合わせ） |

#### 戻り値

`Object`: `JSON.parse()`された外国人学生調査票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

### `getStatusAfterGraduationGraduates(accessKey, year, orgId)`

卒業後の状況調査票(2-1) API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `orgId`      | `String` | 学部・研究科等組織 ID           |

#### 戻り値

`Object`: `JSON.parse()`された卒業後の状況調査票(2-1) API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

### `getStatusAfterGraduationJobs(accessKey, year, orgId)`

卒業後の状況調査票(2-2) API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `orgId`      | `String` | 学部・研究科等組織 ID           |

#### 戻り値

`Object`: `JSON.parse()`された卒業後の状況調査票(2-2) API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

### `getSchoolFacilities(accessKey, year, univId)`

学校施設調査票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `univId`     | `String` | 4 桁の大学 ID                   |

#### 戻り値

`Object`: `JSON.parse()`された学校施設調査票 API の出力。詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

## API 呼び出しに必要な組織 ID の参照

### `getAllIds()`

全ての種類の組織 ID 一覧を取得

#### 戻り値

`Object`: 全ての組織 ID のオブジェクト

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

[README の「全ての組織 ID を一度に取得する」](README.md#全ての組織-id-を一度に取得する)に関連記載あり。

### `getAllUnivIds()`

全ての大学 ID 一覧を取得

#### 戻り値

`Array`: 大学名（`UNIV_NAME`）と大学 ID（`UNIV_ID`）がセットになったオブジェクトの配列

```json
[
  {
    "UNIV_ID": "0000", // 大学ID
    "UNIV_NAME": "○○大学" // 大学名
  }
]
```

[README の「大学 ID の参照」](README.md#大学-id-の参照)に関連記載あり。

### `getUnivIds(targetUnivNames)`

指定した大学の ID を取得

#### パラメータ

| パラメータ名      | データ型 | 解説         |
| ----------------- | -------- | ------------ |
| `targetUnivNames` | `Array`  | 大学名の配列 |

#### 戻り値

`Array`: 指定した大学名について、大学名（`UNIV_NAME`）と大学 ID（`UNIV_ID`）がセットになったオブジェクトの配列

```json
[
  {
    "UNIV_ID": "0000", // 大学ID
    "UNIV_NAME": "○○大学" // 大学名
  }
]
```

[README の「大学 ID の参照」](README.md#大学-id-の参照)に関連記載あり。

### `getAllIntlIdSuffixes()`

外国人用組織 ID 用の所属課程分類 ID 一覧を取得。外国人用組織 ID は `<大学ID>-<所属課程分類ID>` という文字列となっている。ここではハイフンを含めた所属課程分類 ID とその課程分類がオブジェクトの配列として返ってくる。

#### 戻り値

`Array`

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

[README の「外国人用組織 ID の参照」](README.md#外国人用組織-id-の参照)に関連記載あり。

### `getIntlIds(targetUnivIds)`

指定した大学 ID の外国人用組織 ID 一式を、大学ごとにまとまった二次元配列として返す。

#### パラメータ

| パラメータ名    | データ型 | 解説                   |
| --------------- | -------- | ---------------------- |
| `targetUnivIds` | `Array`  | 指定する大学 ID の配列 |

#### 戻り値

`Array`

```json
[
  ["0000-1Z11", "0000-1Z33", "0000-1Z44", "0000-1Z55"], // 大学ID「0000」の外国人用組織ID一式
  ["1111-1Z11", "1111-1Z33", "1111-1Z44", "1111-1Z55"] // 大学ID「1111」の外国人用組織ID一式
]
```

上の例は `Portraits.getIntlIds(['0000', '1111'])` に対する出力の例。[README の「外国人用組織 ID の参照」](README.md#外国人用組織-id-の参照) に関連記載あり。

### `getAllOrganizationIds()`

全ての年の学部・研究科等組織 ID 一覧を取得

#### 戻り値

`Object`

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

[README の「学部・研究科等組織 ID の参照」](README.md#学部研究科等組織-id-の参照) に関連記載あり。

### `getOrganizationIdsbyUniv(targetYear, targetUnivNames)`

指定した年の、特定の大学についての学部・研究科等組織 ID 一覧を取得

#### パラメータ

| パラメータ名      | データ型 | 解説                                                         |
| ----------------- | -------- | ------------------------------------------------------------ |
| `targetYear`      | `Number` | 年度ごとに定義された学部・研究科等組織 ID のうち、年度を指定 |
| `targetUnivNames` | `Array`  | 学部・研究科等組織 ID を取得したい大学名（string）の配列     |

#### 戻り値

`Object`

```json
{
  "○○大学": [
    {
      "OID": "0100-01-01-1K08-00-1", // 学部・研究科等組織ID
      "DEP": "○○学部", // 学部・研究科名
      "LOC": "○○", // 所在地
      "CTG": "", // 分類
      "DN": "昼間" // 昼間 or 夜間
    },
    ...
  ],
  ...
}
```

[README の「学部・研究科等組織 ID の参照」](README.md#学部研究科等組織-id-の参照) に関連記載あり。
