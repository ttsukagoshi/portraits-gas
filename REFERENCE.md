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

`Object`: `JSON.parse()`された学生教員等状況票 API の出力。

##### 例

```javascript
// 大学IDとして「0000」が存在すると仮定すると
getStudentFacultyStatus(accessKey, 2021, '0000');
```

戻り値は次のような形式となっている：

```json
{
  "GET_STATUS_LIST": {
    "RESULT": {
      "STATUS": "0",
      "ERROR_MSG": "正常に終了しました。",
      "DATE": "2022/09/11 02:13:31"
    },
    "PARAMETER": {
      "YEAR": "2021年度",
      "QUE_NAME": "学生教職員等状況票",
      "ORG_ID": "0000"
    },
    "DATALIST_INF": {
      "NUMBER": "1",
      "DATA_INF": [
        {
          "UPDATE_DATE": "2021/09/01 13:28:58",
          "CONTENT": {
            "GAKKO": {
              "GAKKO_MEI": "○○大学",
              "GAKKO_YUBIN": "123-1234",
              "GAKKO_ADDR": "○○市○区○○"
            },
            "GAKUSEI_SU": {　// 学生数
              "CHUYA_KBN": [　// 昼夜別の学生数と、課程別の人数内訳
                {
                  "CHUYA_MEI": "昼間",
                  "GAKUSEI_SU_KEI_M": "12752", // key末尾「_M」が男女別内訳のうち男の集計値を指す（以下同じ）
                  "GAKUSEI_SU_KEI_F": "5396", // key末尾「_F」が男女別内訳のうち女の集計値を指す（以下同じ）
                  "GAKUSEI_SU_KEI": "18148", // key末尾「_KEI」が男女の合計を指す（以下同じ）
                  "GAKUSEI_SU": [
                    {
                      "GAKUSEI_SU": "1722",
                      "GAKUSEI_TYPE": "博士課程",
                      "GAKUSEI_SEX": "男"
                    },
                    ...
                  ]
                },
                {
                  "CHUYA_MEI": "夜間",
                  "GAKUSEI_SU_KEI_M": "0",
                  "GAKUSEI_SU_KEI_F": "0",
                  "GAKUSEI_SU_KEI": "0",
                  "GAKUSEI_SU": [
                    {
                      "GAKUSEI_SU": "",
                      "GAKUSEI_TYPE": "博士課程",
                      "GAKUSEI_SEX": "男"
                    },
                    ...
                  ]
                }
              ]
            },
            "KYOIN_SU_HOMMUSHA": { // 教員数（本務）
              "HOMMU": [ // 学長・副学長の人数
                {
                  "KYOIN_MEI": "学長・副学長",
                  "KYOIN_MEI_FUGO": "9980",
                  "HOMMU_KYOIN_SU_KEI_M": "4",
                  "HOMMU_KYOIN_SU_KEI_F": "1",
                  "HOMMU_KYOIN_SU_KEI": "5",
                  "KYOIN_SU": [ // 学長・副学長の人数内訳（それぞれ男女別）
                    {
                      "KYOIN_SU": "1",
                      "KYOIN_TYPE": "本務",
                      "KYOIN_SHOKUNA": "学長",
                      "KYOIN_SEX": "男"
                    },
                    ...
                  ]
                }
              ],
              "GAKUBU": [ // 学内組織別（学部・大学院・附属研究所etc.）の本務教員数（学部別）
                {
                  "GAKUBU_MEI": "○○学部",
                  "GAKUBU_MEI_FUGO": "1A00",
                  "GAKUBU_KYOIN_SU_KEI_M": "8",
                  "GAKUBU_KYOIN_SU_KEI_F": "1",
                  "GAKUBU_KYOIN_SU_KEI": "9",
                  "KYOIN_SU": [ // 職階（教授、准教授、助教、助手、講師）別・男女別の教員数内訳
                    {
                      "KYOIN_SU": "",
                      "KYOIN_TYPE": "本務",
                      "KYOIN_SHOKUNA": "教授",
                      "KYOIN_SEX": "男"
                    },
                    ...
                  ]
                },
                ...
              ],
              "KEI": [ // 教員数（本務）合計
                {
                  "MEISHO": "計",
                  "MEISHO_FUGO": "9999",
                  "KYOIN_SU_KEI_M": "1961",
                  "KYOIN_SU_KEI_F": "341",
                  "KYOIN_SU_KEI": "2302",
                  "KYOIN_SU": [ // 職階別・男女別の内訳
                    {
                      "KYOIN_SU": "1",
                      "KYOIN_TYPE": "本務",
                      "KYOIN_SHOKUNA": "学長",
                      "KYOIN_SEX": "男"
                    },
                    ...
                  ]
                }
              ]
            },
            "KYOIN_SU_HOMMUSHA_UCHI": [ // 教員数（本務）の内数で、次に該当する者それぞれの人数内訳
              // 大学院担当者、休職者、または外国人
              {
                "HOMMU_UCHI": [
                  {
                    "HOMMU_MEI": "大学院担当者", // ここが大学院担当者 || 休職者 || 外国人
                    "KYOIN_SU_KEI_M": "1772",
                    "KYOIN_SU_KEI_F": "293",
                    "KYOIN_SU_KEI": "2065",
                    "KYOIN_SU": [ // 職階別・男女別の内訳
                      {
                        "KYOIN_SU": "640",
                        "KYOIN_TYPE": "大学院担当者",
                        "KYOIN_SHOKUNA": "教授",
                        "KYOIN_SEX": "男"
                      },
                      ...
                    ]
                  },
                  ...
                ]
              }
            ],
            "KYOIN_SU_KEMMUSHA": [ // 教員数（兼務）
              {
                "KYOIN_SU_KEI_M": "986",
                "KYOIN_SU_KEI_F": "182",
                "KYOIN_SU_KEI": "1168",
                "KYOIN_SU": [　// 兼務者分類別・男女別の内訳
                  {
                    "KYOIN_SU": "",
                    "KYOIN_TYPE": "兼務",
                    "KYOIN_BUNRUI": "学長", // 兼務者分類（学長、副学長、教員からの兼務、教員以外からの兼務）
                    "KYOIN_SEX": "男"
                  },
                  ...
                ]
              }
            ],
            "KYOIN_SU_KEMMUSHA_GAI": [ // 教員（兼務）のうち外国人数
              {
                "KYOIN_SU_KEI": "82",
                "KYOIN_SU": [ // 男女別内訳（length = 2の配列）
                  {
                    "KYOIN_SU": "57",
                    "KYOIN_BUNRUI": "外国人", // ここでは「外国人」のみ
                    "KYOIN_TYPE": "兼務",
                    "KYOIN_SEX": "男"
                  },
                  ...
                ]
              }
            ],
            "SHOKUIN_SU": [ // 職員数。本務・兼務で別オブジェクトとなっている。
              { // 本務職員についてのオブジェクト
                "SHOKUIN_SU_KEI_M": "1320",
                "SHOKUIN_SU_KEI_F": "2039",
                "SHOKUIN_SU_KEI": "3359",
                "SHOKUIN_SU_KEITO": [ // 専門系統別、男女別の内訳
                  {
                    "SHOKUIN_SU": "623",
                    "SHOKUIN_TYPE": "本務", // ここでは全て本務 or 兼務
                    "SHOKUIN_KEITO": "事務系", // 他には「技術技能系」「医療系」「教務系」「その他」など。
                    "SHOKUIN_SHOKUSHU": "", //　職種。「看護師」など、特定のものについて値あり。
                    "SHOKUIN_KANGO_TYPE": "", // 看護師の場合は「附属病院」「学生の健康管理」
                    "SHOKUIN_SEX": "男" // 男女
                  },
                  ...
                ]
              },
              ... （もう1項目、兼務者についての一式オブジェクト）
            ],
            "GAKKO_KIHON": { "GAKKO_CHOSA_CD": "0000", "SHOZAICHI_CD": "00" }
          }
        }
      ]
    }
  }
}
```

各 key の詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

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
