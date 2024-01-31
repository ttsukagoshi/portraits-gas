# レファレンス

このライブラリで使用できるメソッドの一覧です。

## 目次

### ポートレート API を呼び出す

- [`getStudentFacultyStatus(accessKey, year, univId)`](#getstudentfacultystatusaccesskey-year-univid)
- [`getCollegeUndergraduateStudentsDetail(accessKey, year, orgId)`](#getcollegeundergraduatestudentsdetailaccesskey-year-orgid)
- [`getGraduateStudentsDetail(accessKey, year, orgId)`](#getgraduatestudentsdetailaccesskey-year-orgid)
- [`getJuniorCollegeUndergraduateStudentsDetail(accessKey, year, univId)`](#getjuniorcollegeundergraduatestudentsdetailaccesskey-year-univid)
- [`getForeignStudent(accessKey, year, foreignId)`](#getforeignstudentaccesskey-year-foreignid)
- [`getStatusAfterGraduationGraduates(accessKey, year, orgId)`](#getstatusaftergraduationgraduatesaccesskey-year-orgid)
- [`getStatusAfterGraduationJobs(accessKey, year, orgId)`](#getstatusaftergraduationjobsaccesskey-year-orgid)
- [`getSchoolFacilities(accessKey, year, univId)`](#getschoolfacilitiesaccesskey-year-univid)

### API 呼び出しに必要な組織 ID を参照する

- [`getAllIds()`](#getallids)
- [`getAllUnivIds()`](#getallunivids)
- [`getUnivIds(targetUnivNames)`](#getunividstargetunivnames)
- [`getAllIntlIdSuffixes()`](#getallintlidsuffixes)
- [`getIntlIds(targetUnivIds)`](#getintlidstargetunivids)
- [`getAllOrganizationIds()`](#getallorganizationids)
- [`getOrganizationIdsbyUniv(targetYear, targetUnivNames)`](#getorganizationidsbyunivtargetyear-targetunivnames)

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
Portraits.getStudentFacultyStatus(accessKey, 2021, '0000');
```

戻り値は次のような形式となっている：

```jsonc
{
  "GET_STATUS_LIST": {
    "RESULT": {
      "STATUS": "0",
      "ERROR_MSG": "正常に終了しました。",
      "DATE": "2022/09/11 02:13:31",
    },
    "PARAMETER": {
      "YEAR": "2021年度",
      "QUE_NAME": "学生教職員等状況票",
      "ORG_ID": "0000",
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
              "GAKKO_ADDR": "○○市○区○○",
            },
            "GAKUSEI_SU": {
              // 学生数
              "CHUYA_KBN": [
                // 昼夜別の学生数と、課程別の人数内訳
                {
                  "CHUYA_MEI": "昼間", // 昼間、夜間
                  "GAKUSEI_SU_KEI_M": "12752", // key末尾「_M」が男女別内訳のうち男の集計値を指す（以下同じ）
                  "GAKUSEI_SU_KEI_F": "5396", // key末尾「_F」が男女別内訳のうち女の集計値を指す（以下同じ）
                  "GAKUSEI_SU_KEI": "18148", // key末尾「_KEI」が男女の合計を指す（以下同じ）
                  "GAKUSEI_SU": [
                    {
                      "GAKUSEI_SU": "1722",
                      "GAKUSEI_TYPE": "博士課程", // 学生種別。「博士課程」「修士課程」「専門職学位課程」「学部・本科」「専攻科」「別科」「科目等履修生・聴講生・研究生 学部卒以上」「科目等履修生・聴講生・研究生 左記以外」
                      "GAKUSEI_SEX": "男", // 男女
                    },
                    // ...
                  ],
                },
                // ... 夜間についての同様のオブジェクト
              ],
            },
            "KYOIN_SU_HOMMUSHA": {
              // 教員数（本務）
              "HOMMU": [
                // 学長・副学長の人数
                {
                  "KYOIN_MEI": "学長・副学長",
                  "KYOIN_MEI_FUGO": "9980",
                  "HOMMU_KYOIN_SU_KEI_M": "4",
                  "HOMMU_KYOIN_SU_KEI_F": "1",
                  "HOMMU_KYOIN_SU_KEI": "5",
                  "KYOIN_SU": [
                    // 学長・副学長の人数内訳（それぞれ男女別）
                    {
                      "KYOIN_SU": "1",
                      "KYOIN_TYPE": "本務",
                      "KYOIN_SHOKUNA": "学長", // 学長、副学長
                      "KYOIN_SEX": "女", // 男女
                    },
                    // ...
                  ],
                },
              ],
              "GAKUBU": [
                // 学内組織別（学部・大学院・附属研究所etc.）の本務教員数（学部別）
                {
                  "GAKUBU_MEI": "○○学部",
                  "GAKUBU_MEI_FUGO": "1A00",
                  "GAKUBU_KYOIN_SU_KEI_M": "8",
                  "GAKUBU_KYOIN_SU_KEI_F": "1",
                  "GAKUBU_KYOIN_SU_KEI": "9",
                  "KYOIN_SU": [
                    // 職階（教授、准教授、助教、助手、講師）別・男女別の教員数内訳
                    {
                      "KYOIN_SU": "",
                      "KYOIN_TYPE": "本務",
                      "KYOIN_SHOKUNA": "教授", // 教授、准教授、助教、助手、講師
                      "KYOIN_SEX": "男", // 男女
                    },
                    // ...
                  ],
                },
                // ...
              ],
              "KEI": [
                // 教員数（本務）合計
                {
                  "MEISHO": "計",
                  "MEISHO_FUGO": "9999",
                  "KYOIN_SU_KEI_M": "1961",
                  "KYOIN_SU_KEI_F": "341",
                  "KYOIN_SU_KEI": "2302",
                  "KYOIN_SU": [
                    // 職階別・男女別の内訳
                    {
                      "KYOIN_SU": "1",
                      "KYOIN_TYPE": "本務",
                      "KYOIN_SHOKUNA": "学長", // 学長、副学長、教授、准教授、助教、助手、講師
                      "KYOIN_SEX": "女", // 男女
                    },
                    // ...
                  ],
                },
              ],
            },
            "KYOIN_SU_HOMMUSHA_UCHI": [
              // 教員数（本務）の内数で、次に該当する者それぞれの人数内訳
              // 大学院担当者、休職者、または外国人
              {
                "HOMMU_UCHI": [
                  {
                    "HOMMU_MEI": "大学院担当者", // ここが大学院担当者 || 休職者 || 外国人
                    "KYOIN_SU_KEI_M": "1772",
                    "KYOIN_SU_KEI_F": "293",
                    "KYOIN_SU_KEI": "2065",
                    "KYOIN_SU": [
                      // 職階別・男女別の内訳
                      {
                        "KYOIN_SU": "640",
                        "KYOIN_TYPE": "大学院担当者",
                        "KYOIN_SHOKUNA": "教授", // 教授、准教授、助教、助手、講師
                        "KYOIN_SEX": "男", // 男女
                      },
                      // ...
                    ],
                  },
                  // ...
                ],
              },
            ],
            "KYOIN_SU_KEMMUSHA": [
              // 教員数（兼務）
              {
                "KYOIN_SU_KEI_M": "986",
                "KYOIN_SU_KEI_F": "182",
                "KYOIN_SU_KEI": "1168",
                "KYOIN_SU": [
                  // 兼務者分類別・男女別の内訳
                  {
                    "KYOIN_SU": "",
                    "KYOIN_TYPE": "兼務",
                    "KYOIN_BUNRUI": "学長", // 兼務者分類（学長、副学長、教員からの兼務、教員以外からの兼務）
                    "KYOIN_SEX": "女", // 男女
                  },
                  // ...
                ],
              },
            ],
            "KYOIN_SU_KEMMUSHA_GAI": [
              // 教員（兼務）のうち外国人数
              {
                "KYOIN_SU_KEI": "82",
                "KYOIN_SU": [
                  // 男女別内訳（length = 2の配列）
                  {
                    "KYOIN_SU": "57",
                    "KYOIN_BUNRUI": "外国人", // ここでは「外国人」のみ
                    "KYOIN_TYPE": "兼務",
                    "KYOIN_SEX": "男", // 男女
                  },
                  // ... 「女」についての同様のオブジェクト
                ],
              },
            ],
            "SHOKUIN_SU": [
              // 職員数。本務・兼務で別オブジェクトとなっている。
              {
                // 本務職員についてのオブジェクト
                "SHOKUIN_SU_KEI_M": "1320",
                "SHOKUIN_SU_KEI_F": "2039",
                "SHOKUIN_SU_KEI": "3359",
                "SHOKUIN_SU_KEITO": [
                  // 専門系統別、男女別の内訳
                  {
                    "SHOKUIN_SU": "623",
                    "SHOKUIN_TYPE": "本務", // ここでは全て本務 or 兼務
                    "SHOKUIN_KEITO": "事務系", // 職員系統。「事務系」「技術技能系」「医療系」「教務系」「その他」のいずれか。
                    "SHOKUIN_SHOKUSHU": "", // 職種。通常は空白（""）。ここが「看護師」となっている場合、その項目は全体に対する「職員系統が医療系のうち、看護師として従事している職員の内数」。次の看護タイプでさらに細分化される。
                    "SHOKUIN_KANGO_TYPE": "", // 看護タイプ。職種が看護師となっている場合のみ、「附属病院」「学生の健康管理」のいずれかの値を取る。それ以外は空白（""）。
                    "SHOKUIN_SEX": "女", // 男女。ただし看護タイプに値が入っている場合、「学生の健康管理」→「男」、「附属病院」→「女」と固定値を取る（看護師の看護タイプ別内数は男女別の集計をとっていない）
                  },
                  // ...
                ],
              },
              // ... （もう1項目、兼務者についての一式オブジェクト）
            ],
            "GAKKO_KIHON": { "GAKKO_CHOSA_CD": "0000", "SHOZAICHI_CD": "00" },
          },
        },
      ],
    },
  },
}
```

### `getCollegeUndergraduateStudentsDetail(accessKey, year, orgId)`

学部学生内訳票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `orgId`      | `String` | 学部・研究科等組織 ID           |

#### 戻り値

`Object`: `JSON.parse()`された学部学生内訳票 API の出力。

##### 例

```javascript
// 組織IDとして「0000-01-01-1G00-00-1」が存在すると仮定すると
Portraits.getCollegeUndergraduateStudentsDetail(
  accessKey,
  2021,
  '0000-01-01-1G00-00-1',
);
```

戻り値は次のような形式となっている：

```jsonc
{
  "GET_STATUS_LIST": {
    "RESULT": {
      "STATUS": "0",
      "ERROR_MSG": "正常に終了しました。",
      "DATE": "2022/09/16 00:03:58",
    },
    "PARAMETER": {
      "YEAR": "2021年度",
      "QUE_NAME": "学部学生内訳票",
      "ORG_ID": "0000-01-01-1G00-00-1",
    },
    "DATALIST_INF": {
      "NUMBER": "1",
      "DATA_INF": [
        {
          "UPDATE_DATE": "2021/08/27 10:33:25",
          "CONTENT": {
            "GAKKO": { "GAKKO_MEI": "○○大学" },
            "GAKUBU": {
              "GAKUBU_MEI": "○○学部",
              "GAKUBU_CHUYA_KBN": "1",
              "GAKUBU_YUBIN": "000-0000",
              "GAKUBU_ADDR": "○○市○○１－１",
            },
            "GAKKA_GAKUSEI_SU": [
              // 当該学部内での、学科別学生数を配列で格納
              {
                "GAKKA": {
                  "GAKKA_MEI": "○○工", // 学科名。配列の末尾には学科名が「計」のオブジェクトがあり、この学部内の合計値が格納されている。
                  "GAKKA_MEI_FUGO": "J000",
                  "GAKUSEI_SU_KEI_M": "487",
                  "GAKUSEI_SU_KEI_F": "57",
                  "GAKUSEI_SU": [
                    // 年次別・男女別の学生数内訳を配列で格納
                    {
                      "GAKUSEI_SU": "125",
                      "GAKUSEI_NENJI": "1年次", // 1〜6年次（4年制の学科では5・6年次の学生数が空白「""」）
                      "GAKUSEI_SEX": "男", // 男女
                    },
                    // ...
                  ],
                  "NYUGAKU_SHIGANSHA_SU": [
                    // この学科の当該年度における入学志願者数を男女別で格納
                    {
                      "NYUGAKU_GAKKA_NYUGAKU_SHIGANSHA_SU": "405",
                      "NYUGAKU_SEX": "女", // 男女
                    },
                    // ...
                  ],
                  "NYUGAKUSHA_SU": [
                    // この学科の当該年度における入学者数を男女別で格納
                    {
                      "NYUGAKUSHA_GAKKA_NYUGAKUSHA_SU": "115",
                      "NYUGAKUSHA_SEX": "男", // 男女
                    },
                    // ...
                  ],
                },
              },
              // ...
            ],
            "GAKKA_KYUGAKUSHA_SU": {
              // 休学者数（GAKKA_GAKUSEI_SUの内数。ここは学科別ではなく、学部全体での合計値）
              "GAKUSEI_SU_KEI_M": "24",
              "GAKUSEI_SU_KEI_F": "4",
              "GAKUSEI_SU": [
                // 年次別・男女別の休学者数内訳を配列で格納
                {
                  "GAKUSEI_SU": "", // 該当者がいない場合は空白文字列「""」、いる場合はString型の数字「"3"」
                  "GAKUSEI_NENJI": "1年次", // 1〜6年次
                  "GAKUSEI_SEX": "女", // 男女
                },
                // ...
              ],
            },
            "MIN_NENGEN_CHOKA_GAKUSEI_SU": {
              // 最低在学年限超過学生数（GAKKA_GAKUSEI_SUの内数。ここも学科別ではなく、学部全体での合計値）
              "GAKUSEI_SU_KEI_M": "78",
              "GAKUSEI_SU_KEI_F": "4",
              "GAKUSEI_SU_KEI": "82",
              "GAKUSEI_SU": [
                // 入学年度別・男女別の最低在学年限超過学生数内訳を配列で格納
                {
                  "GAKUSEI_SU": "58",
                  "GAKUSEI_NENDO": "2017", // 入学年度（配列は、年度が降順）。公式ドキュメントでは「入学年度(相対)を返却する」とあるが、実際に返ってくるのは西暦4桁の絶対値
                  "GAKUSEI_SEX": "男", // 男女
                },
                // ...
              ],
            },
            "SHUSSHIN_KOKO_ADDR_KEN_NYUGAKUSHA_SU": {
              // 出身高校の所在地県別入学者数
              "NYUGAKUSHA_SU_KEI_M": "342",
              "NYUGAKUSHA_SU_KEI_F": "67",
              "NYUGAKUSHA_SU": [
                // 都道府県別・男女別の入学者数内訳を配列で格納
                {
                  "NYUGAKUSHA_SU": "8",
                  "NYUGAKUSHA_TODOFUKEN": "北海道", // 47都道府県名および「その他」。都府県名末尾に「都」「府」「県」はつかない（例：青森県→「青森」）
                  "NYUGAKUSHA_SEX": "女", // 男女
                },
                // ...
              ],
            },
            "NENREIBETSU_NYUGAKUSHA_SU": {
              // 年齢別入学者数
              "NYUGAKUSHA_SU_KEI_M": "342",
              "NYUGAKUSHA_SU_KEI_F": "67",
              "NYUGAKUSHA_SU": [
                // 年齢区分別・男女別の入学者数内訳を配列で格納
                {
                  "NYUGAKUSHA_SU": "",
                  "NYUGAKUSHA_NENREI_KBN": "17歳以下", // 「17歳以下」「18歳」「19歳」...「29歳」「30～34歳」「35～39歳」...「65歳以上」
                  "NYUGAKUSHA_SEX": "男", // 男女
                },
                // ...
              ],
              "NYUGAKUSHA_SU_UCHI": [
                // 出身高校の所在地県が「その他」の入学者の学歴別・男女別内訳
                // SHUSSHIN_KOKO_ADDR_KEN_NYUGAKUSHA_SU.NYUGAKUSHA_SU.filter((enrollees) => enrollees.NYUGAKUSHA_TODOFUKEN === "その他")
                {
                  "NYUGAKUSHA_SU_UCHI": "19",
                  "NYUGAKUSHA_GAKUREKI_TYPE": "外国の学校卒", // 「外国の学校卒」「専修学校高等課程卒」「その他(高卒認定等)」のいずれか
                  "NYUGAKUSHA_SEX": "女", // 男女
                },
                // ...
              ],
              "NYUGAKUSHA_SU_RYUGAKUSEI_SU": [
                // 入学者数のうち留学生数
                { "NYUGAKUSHA_RYUGAKUSEI_SU": "19", "NYUGAKUSHA_SEX": "男" }, // 男女
                // ... 男女で同様のオブジェクトがもう1点
              ],
            },
            "SENKOKA_KAMOKU_RISHUSEI_GAKUSEI_SU": {
              // 専攻科・別科及び科目等履修生等の学生数
              "GAKUSEI_SU_KEI_M": "6",
              "GAKUSEI_SU_KEI_F": "0",
              "GAKUSEI_SU_KEI": "6",
              "GAKUSEI_SU": [
                {
                  "GAKUSEI_SU": "",
                  "GAKUSEI_TYPE": "専攻科", // 学生種別「専攻科」「別科」「学部卒以上」「左記以外」
                  "GAKUSEI_SEX": "女", // 男女
                },
                // ...
              ],
            },
            "TANKI_KOTO_SENSHU_SENKOKA_HENNYU_GAKUSHA_SU": {
              // 短期大学・高等専門学校・専修学校(専門課程)・高等学校等専攻科からの編入学者数
              "GAKUSEI_SU_KEI_M": "17",
              "GAKUSEI_SU_KEI_F": "0",
              "GAKUSEI_SU_KEI": "17",
              "GAKUSEI_SU": [
                {
                  "GAKUSEI_SU": "",
                  "GAKUSEI_ZENREKI": "1", // 前歴コード 1〜6（各コードの意味は公式の仕様書を参照のこと）
                  "GAKUSEI_NYUGAKU_NENJI": "2年次", // 入学年次
                  "GAKUSEI_SEX": "男", // 男女
                },
                // ...
              ],
            },
            "GAKKO_KIHON_INFO": {
              "GAKKO_CHOSA_CD": "0000",
              "GAKKO_GAKUBU_CD": "1G00",
              "GAKKO_ADDR_CD": "01",
            },
          },
        },
      ],
    },
  },
}
```

### `getGraduateStudentsDetail(accessKey, year, orgId)`

大学院学生内訳票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `orgId`      | `String` | 学部・研究科等組織 ID           |

#### 戻り値

`Object`: `JSON.parse()`された大学院学生内訳票 API の出力。

##### 例

```javascript
// 組織IDとして「0000-01-01-1G00-00-1」が存在すると仮定すると
Portraits.getGraduateStudentsDetail(accessKey, 2021, '0000-01-01-1G00-00-1');
```

戻り値は次のような形式となっている：

```jsonc
{
  "GET_STATUS_LIST": {
    "RESULT": {
      "STATUS": "0",
      "ERROR_MSG": "正常に終了しました。",
      "DATE": "2022/09/16 00:24:22",
    },
    "PARAMETER": {
      "YEAR": "2021年度",
      "QUE_NAME": "大学院学生内訳票",
      "ORG_ID": "0000-01-01-1M00-01-1",
    },
    "DATALIST_INF": {
      "NUMBER": "1",
      "DATA_INF": [
        {
          "UPDATE_DATE": "2021/09/01 13:28:58",
          "CONTENT": {
            "GAKKO": { "GAKKO_MEI": "○○大学" },
            "KENKYUKA": {
              "KENKYUKA_MEI": "○○研究科",
              "KENKYUKA_CHUYA_KBN": "1",
              "KENKYUKA_KATEI_KBN": "1",
              "KENKYUKA_YUBIN": "000-0000",
              "KENKYUKA_ADDR": "○○市○○５丁目",
            },
            "SENKO_GAKUSEI_SU": {
              "SENKOBETSU": [
                // 専攻別学生数
                {
                  "SENKOBETSU_MEI": "○○専攻", // 専攻名。配列の末尾には専攻名が「計」のオブジェクトがあり、この研究科内の合計値が格納されている。
                  "SENKOBETSU_MEI_FUGO": "M000",
                  "GAKUSEI_SU_KEI_M": "23",
                  "GAKUSEI_SU_KEI_F": "22",
                  "GAKUSEI_SU_KEI": "45",
                  "SHAKAIJIN_GAKUSEI_SU_KEI": "11",
                  "GAKUSEI_SU": [
                    // 年次別・男女別の学生数内訳を配列で格納
                    {
                      "GAKUSEI_SU": "13",
                      "GAKUSEI_NENJI": "1年次", // 1〜5年次（該当なしの場合は学生数が空白「""」）
                      "GAKUSEI_SEX": "男", // 男女
                    },
                    // ...
                  ],
                  "SHAKAIJIN_GAKUSEI_SU": [
                    // 社会人学生数（男女別）
                    { "SHAKAIJIN_GAKUSEI_SU": "6", "SHAKAIJIN_SEX": "女" }, // 男女
                    // ...
                  ],
                },
                // ...
              ],
            },
            "SENKO_GAKUSEI_KYUGAKUSHA_SU": {
              // 専攻別学生のうち休学者数
              "GAKUSEI_SU_KEI_M": "1",
              "GAKUSEI_SU_KEI_F": "0",
              "GAKUSEI_SU_KEI": "1",
              "GAKUSEI_SU": [
                {
                  "GAKUSEI_SU": "",
                  "GAKUSEI_NENJI": "1年次", // 1〜5年次（該当なしの場合は学生数が空白「""」）
                  "GAKUSEI_SEX": "男", // 男女
                },
                // ...
              ],
            },
            "MIN_NENGEN_CHOKA_GAKUSEI_SU": {
              // 最低在学年限超過学生数
              "GAKUSEI_SU_KEI_M": "3",
              "GAKUSEI_SU_KEI_F": "0",
              "GAKUSEI_SU_KEI": "3",
              "GAKUSEI_SU": [
                // 入学年度別・男女別の最低在学年限超過学生数内訳を配列で格納
                {
                  "GAKUSEI_SU": "3",
                  "GAKUSEI_NENDO": "2019", // 入学年度（配列は、年度が降順）。公式ドキュメントでは「入学年度(相対)を返却する」とあるが、実際に返ってくるのは西暦4桁の絶対値
                  "GAKUSEI_SEX": "女", // 男女
                },
                // ...
              ],
            },
            "NYUGAKU_JOKYO": {
              // 入学状況
              "SENKO": [
                {
                  "SENKO_MEI": "○○専攻", // 専攻名。配列の末尾には専攻名が「計」のオブジェクトがあり、この研究科内の合計値が格納されている。
                  "SENKO_MEI_FUGO": "M000",
                  "NYUGAKU_SHIGANSHA_SU_KEI_M": "13",
                  "NYUGAKU_SHIGANSHA_SU_KEI_F": "10",
                  "NYUGAKUSHA_SU_KEI_M": "11",
                  "NYUGAKUSHA_SU_KEI_F": "10",
                  "NYUGAKU_SHIGANSHA_SU": [
                    // 出身学校の種別・男女別の入学志願者数内訳
                    {
                      "NYUGAKU_SHIGANSHA_SU": "9",
                      "NYUGAKU_SHUSSHIN_GAKKO": "当該大学出身者", // 出身学校の種類「当該大学出身者」「国立」「公立」「私立」「外国の学校卒」「その他」
                      "NYUGAKU_SEX": "男", // 男女
                    },
                    // ...
                  ],
                  "NYUGAKUSHA_SU": [
                    // 出身学校の種別・男女別の入学者数内訳
                    {
                      "NYUGAKUSHA_SU": "5",
                      "NYUGAKUSHA_SHUSSHIN_GAKKO": "当該大学出身者", // 出身学校の種類「当該大学出身者」「国立」「公立」「私立」「外国の学校卒」「その他」
                      "NYUGAKUSHA_SEX": "女", // 男女
                    },
                    // ...
                  ],
                },
                // ...
              ],
            },
            "NENREIBETSU_NYUGAKUSHA_SU": {
              // 年齢別入学者数
              "NYUGAKUSHA_SU_KEI_M": "11",
              "NYUGAKUSHA_SU_KEI_F": "10",
              "NYUGAKUSHA_SU": [
                {
                  "NYUGAKUSHA_SU": "",
                  "NYUGAKUSHA_NENREI": "21歳以下", // 「21歳以下」「22歳」「23歳」...「29歳」「30～34歳」「35～39歳」...「60～64歳」「65歳以上」のいずれか
                  "NYUGAKUSHA_ZENREKI": "",
                  "NYUGAKUSHA_SEX": "男", // 男女
                },
                // ...
              ],
              "NYUGAKUSHA_SHAKAIJIN_GAKUSEI_SU": [
                // 入学者数のうち社会人学生数（男女）
                {
                  "NYUGAKUSHA_SHAKAIJIN_GAKUSEI_SU": "2",
                  "NYUGAKUSHA_SEX": "女", // 男女
                },
                // ...
              ],
              "NYUGAKUSHA_SU_RYUGAKUSEI_SU": [
                // 入学者数のうち留学生数（男女）
                { "NYUGAKUSHA_SU_RYUGAKUSEI_SU": "", "NYUGAKUSHA_SEX": "男" }, // 男女
                // ...
              ],
            },
            "KAMOKUTO_RISHUSEI_GAKUSEI_SU": {
              // 科目等履修生の学生数
              "NYUGAKUSHA_SU_KEI_M": "0",
              "NYUGAKUSHA_SU_KEI_F": "0",
              "NYUGAKUSHA_SU_KEI": "0",
              "NYUGAKUSHA_SU": [
                {
                  "NYUGAKUSHA_SU": "",
                  "NYUGAKUSHA_NENREI_KBN": "学部卒以上", // 「学部卒以上」「左 記 以 外」
                  "NYUGAKUSHA_SEX": "男", // 男女
                },
                // ...
              ],
            },
            "KIHON_INFO": {
              "KIHON_GAKKO_CHOSA_CD": "0000",
              "KIHON_KENKYUKA_CD": "1M00",
              "KIHON_ADDR_CD": "01",
            },
          },
        },
      ],
    },
  },
}
```

### `getJuniorCollegeUndergraduateStudentsDetail(accessKey, year, univId)`

本科学生内訳票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `univId`     | `String` | 4 桁の大学 ID                   |

#### 戻り値

`Object`: `JSON.parse()`された本科学生内訳票 API の出力。

##### 例

```javascript
// 大学IDとして「4000」が存在すると仮定すると
Portraits.getJuniorCollegeUndergraduateStudentsDetail(accessKey, 2021, '4000');
```

戻り値は次のような形式となっている：

```jsonc
{
  "GET_STATUS_LIST": {
    "RESULT": {
      "STATUS": "0",
      "ERROR_MSG": "正常に終了しました。",
      "DATE": "2022/09/16 00:37:32",
    },
    "PARAMETER": {
      "YEAR": "2021年度",
      "QUE_NAME": "本科学生内訳票",
      "ORG_ID": "4000",
    },
    "DATALIST_INF": {
      "NUMBER": "1",
      "DATA_INF": [
        {
          "UPDATE_DATE": "2021/08/27 17:02:59",
          "CONTENT": {
            "GAKKO": {
              "GAKKO_MEI": "○○短期大学", // （短期）大学名
              "GAKKO_YUBIN": "000-0000",
              "GAKKO_ADDR": "○○市○○１－１５－１",
            },
            "CHUYA_KBN_HIRU": {
              // 昼間の課程
              "CHUYA_MEI": "昼間",
              "GAKKA": [
                {
                  "GAKKA_MEI": "○○", // 学科名。配列の末尾には学科名が「計」のオブジェクトがあり、この学部内の合計値が格納されている。
                  "GAKKA_MEI_FUGO": "A000",
                  "GAKUSEI_SU_KEI_M": "0",
                  "GAKUSEI_SU_KEI_F": "103",
                  "GAKUSEI_SU": [
                    // 年次別・男女別の学生数（昼間）内訳を配列で格納
                    {
                      "GAKUSEI_SU": "50",
                      "GAKUSEI_NENJI": "1年次", // 1〜3年次
                      "GAKUSEI_SEX": "女", // 男女
                    },
                    // ...
                  ],
                  "NYUGAKU_SHIGANSHA_SU": [
                    // 入学志願者数
                    { "NYUGAKU_SHIGANSHA_SU": "79", "NYUGAKU_SEX": "女" }, // 男女
                    // ...
                  ],
                  "NYUGAKUSHA_SU": [
                    // 入学者数
                    { "NYUGAKUSHA_SU": "", "NYUGAKUSHA_SEX": "男" }, // 男女
                    // ...
                  ],
                },
                // ...
              ],
              "GAKKA_GAKUSEI_KYUGAKUSHA_SU": [
                // 学生のうち休学者数
                {
                  "GAKUSEI_SU_KEI_M": "0",
                  "GAKUSEI_SU_KEI_F": "5",
                  "GAKUSEI_SU": [
                    // 年次別・男女別の休学者数内訳を配列で格納
                    {
                      "GAKUSEI_SU": "",
                      "GAKUSEI_NENJI": "1年次", // 1〜3年次
                      "GAKUSEI_SEX": "女", // 男女
                    },
                    // ...
                  ],
                },
              ],
            },
            "CHUYA_KBN_YAKAN": {
              // 夜間の課程
              // ... 昼間　(CHUYA_KBN_HIRU) と同じデータ構造
            },
            "SHUSSHIN_KOKO_ADDR_KEN_NYUGAKUSHA_SU": [
              // 出身高校の所在地県別入学者数
              {
                "NYUGAKUSHA_SU_KEI_M": "0",
                "NYUGAKUSHA_SU_KEI_F": "246",
                "NYUGAKUSHA_SU": [
                  // 都道府県別・男女別の入学者数内訳を配列で格納
                  {
                    "NYUGAKUSHA_SU": "",
                    "NYUGAKUSHA_TODOFUKEN": "北海道", // 47都道府県名および「その他」。都府県名末尾に「都」「府」「県」はつかない（例：青森県→「青森」）
                    "NYUGAKUSHA_SEX": "男", // 男女
                  },
                  // ...
                ],
              },
            ],
            "NENREI_NYUGAKUSHA_SU_HIRUMA": {
              // 年齢別入学者数（昼間）
              "NYUGAKUSHA_SU_KEI_M": "0",
              "NYUGAKUSHA_SU_KEI_F": "246",
              "NYUGAKUSHA_SU": [
                {
                  "NYUGAKUSHA_SU": "",
                  "NYUGAKUSHA_NENREI_KBN": "17歳以下", // 「17歳以下」「18歳」「19歳」...「29歳」「30～34歳」「35～39歳」...「65歳以上」
                  "NYUGAKUSHA_SEX": "女", // 男女
                },
                // ...
              ],
              "NYUGAKUSHA_SU_UCHI": [
                // 出身高校の所在地県が「その他」の入学者の学歴別・男女別内訳
                // SHUSSHIN_KOKO_ADDR_KEN_NYUGAKUSHA_SU.NYUGAKUSHA_SU.filter((enrollees) => enrollees.NYUGAKUSHA_TODOFUKEN === "その他")
                {
                  "NYUGAKUSHA_SU_UCHI": "",
                  "NYUGAKUSHA_GAKUREKI_TYPE": "外国の学校卒", // 「外国の学校卒」「専修学校高等課程卒」「その他(高卒認定等)」の3パターン
                  "NYUGAKUSHA_SEX": "男", // 男女
                },
                // ...
              ],
              "NYUGAKUSHA_RYUGAKUSEI_SU": [
                // 入学者数のうち留学生数
                { "NYUGAKUSHA_SU_RYUGAKUSEI_SU": "", "NYUGAKUSHA_SEX": "女" }, // 男女
                // ...
              ],
            },
            "NENREI_NYUGAKUSHA_SU_YAKAN": {
              // 年齢別入学者数（夜間）
              // ... 年齢別入学者数（昼間）(NENREI_NYUGAKUSHA_SU_HIRUMA) と同じデータ構造
            },
            "SENKOKA_KAMOKU_RISHUSEI_GAKUSEI_SU": {
              // 専攻科・別科及び科目等履修生等の学生数
              "CHUYA_KBN_HIRU": {
                // 昼間の課程
                "CHUYA_MEI": "昼間",
                "GAKUSEI_SU_KEI_M": "1",
                "GAKUSEI_SU_KEI_F": "1",
                "GAKUSEI_SU_KEI": "2",
                "GAKUSEI_SU": [
                  {
                    "GAKUSEI_SU": "",
                    "GAKUSEI_TYPE": "専攻科", // 学生種別「専攻科」「別科」「学部卒以上」「左記以外」
                    "GAKUSEI_SEX": "男", // 男女
                  },
                  // ...
                ],
              },
              "CHUYA_KBN_YAKAN": {
                // ... 昼間　(CHUYA_KBN_HIRU) と同じデータ構造
              },
            },
            "KOTO_SENKOKA_HENNYUGAKUSHA_SU": {
              // 高等学校等専攻科からの編入学者数
              "CHUYA_KBN_HIRU": [
                // 昼間の課程
                {
                  "SENKOKA": "高等学校（専攻科）", // 「高等学校（専攻科）」「中等教育学校（専攻科）」「特別支援学校（専攻科）」
                  "CHUYA_MEI": "昼間",
                  "GAKUSEI_SU_KEI_M": "0",
                  "GAKUSEI_SU_KEI_F": "0",
                  "GAKUSEI_SU_KEI": "0",
                  "GAKUSEI_SU": [
                    {
                      "GAKUSEI_SU": "",
                      "GAKUSEI_NENJI": "2年次", // 入学年次（2年次または3年次）
                      "GAKUSEI_SEX": "女", // 男女
                    },
                    // ...
                  ],
                },
                // ...
              ],
              "CHUYA_KBN_YAKAN": [
                // ... 昼間　(CHUYA_KBN_HIRU) と同じデータ構造
              ],
            },
            "GAKKO_KIHON_INFO": {
              "GAKKO_CHOSA_CD": "4000",
              "GAKKO_ADDR_CD": "01",
            },
          },
        },
      ],
    },
  },
}
```

### `getForeignStudent(accessKey, year, foreignId)`

外国人学生調査票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                                                             |
| ------------ | -------- | ---------------------------------------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー                                  |
| `year`       | `Number` | 対象年度の西暦 4 桁                                              |
| `foreignId`  | `String` | 外国人学生用組織 ID（`<大学ID>`-`<所属課程分類ID>`の組み合わせ） |

#### 戻り値

`Object`: `JSON.parse()`された外国人学生調査票 API の出力。

##### 例

```javascript
// 外国人用組織IDとして「0000-1Z11」が存在すると仮定すると
Portraits.getForeignStudent(accessKey, 2021, '0000-1Z11');
```

戻り値は次のような形式となっている：

```jsonc
{
  "GET_STATUS_LIST": {
    "RESULT": {
      "STATUS": "0",
      "ERROR_MSG": "正常に終了しました。",
      "DATE": "2022/09/18 00:47:25",
    },
    "PARAMETER": {
      "YEAR": "2021年度",
      "QUE_NAME": "外国人学生調査票",
      "ORG_ID": "0000-1Z11", // 「1Z11」は大学学部または短期大学本科を指す。他の外国人用組織IDでもデータ構造は同じ。
    },
    "DATALIST_INF": {
      "NUMBER": "1",
      "DATA_INF": [
        {
          "UPDATE_DATE": "2022/02/28 14:34:45",
          "CONTENT": {
            "GAKKO": {
              "GAKKO_MEI": "○○大学",
              "GAKKO_KATEI_TYPE": "1", // 学校課程種別コード。1: 大学、2: 短期だ区外、3: 修士課程、4: 博士課程、5: 専門職学位課程、6: 高等専門学校
              "GAKKO_YUBIN": "000-0000",
              "GAKKO_ADDR": "○○市○○１－１－１",
            },
            "RYUGAKUSEI": [
              // 留学区分（国費etc.）別の留学生数
              {
                "RYUGAKUSEI_MEI": "国費留学生", // 留学区分。「国費留学生」「私費留学生」「留学生以外の外国人学生」
                "GAKUMON_KOKUBETSU": {
                  // 当該留学区分内での、学問分野別・国別・男女別の留学生数
                  "GAKUMON_MEI": "課程別国籍別外国人学生数", // 固定値「課程別国籍別外国人学生数」
                  "CHIIKI": [
                    // 国ごとにまとまったオブジェクトの配列
                    {
                      "CHIIKI_MEI": "", // 公式仕様書には「地域名を返却」とあるが、空白...？
                      "KUNI_GAKUSEI_SU_KEI_M": "13",
                      "KUNI_GAKUSEI_SU_KEI_F": "1",
                      "KUNI": [
                        // この配列内のオブジェクトの国名（KUNI_MEI）と国名符号（KUNI_MEI_FUGO）はすべて同一
                        // 配列の最後の要素は国名「計」で、他の項目の合計値を示す要素となっている。
                        {
                          "KUNI_MEI": "インドネシア", // ここで初めて、このオブジェクトの国名がわかる。
                          "KUNI_MEI_FUGO": "1A10", // 国名及び国名符号については文科省の学校基本調査に準じる https://www.mext.go.jp/b_menu/toukei/chousa01/kihon/1267995.htm
                          "KUNI_GAKUSEI_SU": "",
                          "KUNI_GAKUMON_BUNYA": "人文科学", // 文科省の学校基本調査における学科系統分類。大学・大学院であれば「人文科学」「社会科学」「理学」「工学」「農学」「保健(医･歯学)」「保健(医･歯学を除く)」「商船」「家政」「教育」「芸術」「その他」
                          "KUNI_GAKUSEI_TYPE": "", // 学生区分名。本科所属であれば空白「""」、そうでなければ「専攻科・別科」「聴講生・選科生・研究生」のいずれか
                          "KUNI_HONKA_IGAI": "", // 学生区分名が本科以外であれば「本科以外」、本科であれば空白「""」
                          "KUNI_SEX": "男", // 男女
                        },
                        // ...
                      ],
                    },
                    // ...
                  ],
                },
                "GAKUMON_KOKUBETSU_BEKKEI2": {
                  "GAKUMON_MEI": "課程別本科以外外国人学生数", // 固定値「課程別本科以外外国人学生数」
                  "KUNI": [
                    {
                      "KUNI_MEI": "別掲2_専攻科・別科の学生", // 「別掲2_専攻科・別科の学生」「別掲2_科目等履修生・聴講生・研究生」
                      "KUNI_MEI_FUGO": "1910",
                      "GAKUSEI_SU_KEI_M": "0",
                      "GAKUSEI_SU_KEI_F": "0",
                      "GAKUSEI_SU": [
                        {
                          "GAKUSEI_SU": "",
                          "GAKUSEI_TYPE": "専攻科・別科", // 国名（KUNI_MEI）が「別掲2_専攻科・別科の学生」であれば「専攻科・別科」、「別掲2_科目等履修生・聴講生・研究生」であれば「聴講生・選科生・研究生」
                          "GAKUSEI_GAKUMON_BUNYA": "人文科学", // GAKUMON_KOKUBETSUにおけるKUNI_GAKUMON_BUNYAと同じ分類
                          "GAKUSEI_SEX": "女", // 男女
                        },
                        // ...
                      ],
                    },
                    // ... KUNI_MEI「別掲2_科目等履修生・聴講生・研究生」の同様のオブジェクトがもう1式
                  ],
                },
              },
              // ... RYUGAKUSEI_MEIが「私費留学生」及び「留学生以外の外国人学生」の同様のオブジェクトが各1式
            ],
            "GAKKO_KIHON_INFO": {
              "GAKKO_CHOSA_CD": "0000",
              "GAKKO_ADDR_CD": "00",
            },
          },
        },
      ],
    },
  },
}
```

### `getStatusAfterGraduationGraduates(accessKey, year, orgId)`

卒業後の状況調査票(2-1) API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `orgId`      | `String` | 学部・研究科等組織 ID           |

#### 戻り値

`Object`: `JSON.parse()`された卒業後の状況調査票(2-1) API の出力。

##### 例

```javascript
// 組織IDとして「0000-00-00-1C00-00-1」が存在すると仮定すると
Portraits.getStatusAfterGraduationGraduates(
  accessKey,
  2021,
  '0000-00-00-1C00-00-1',
);
```

戻り値は次のような形式となっている：

```jsonc
{
  "GET_STATUS_LIST": {
    "RESULT": {
      "STATUS": "0",
      "ERROR_MSG": "正常に終了しました。",
      "DATE": "2022/09/18 00:56:56",
    },
    "PARAMETER": {
      "YEAR": "2021年度",
      "QUE_NAME": "卒業後の状況調査票(2-1)",
      "ORG_ID": "0000-00-00-1C00-00-1",
    },
    "DATALIST_INF": {
      "NUMBER": "1",
      "DATA_INF": [
        {
          "UPDATE_DATE": "2021/08/27 15:16:54",
          "CONTENT": {
            "GAKKO": { "GAKKO_MEI": "○○大学", "GAKKO_TYPE": "1" },
            "GAKUBU_KENKYUKA": {
              "GAKUBU_MEI": "○○学部",
              "GAKUBU_KATEI_KBN": "",
              "GAKUBU_CHUYA_KBN": "1",
              "GAKUBU_YUBIN": "000-0000",
              "GAKUBU_ADDR": "○○都○○７－３－１",
            },
            "GAKKA_SENKO": [
              // 学科・専攻ごとの状況別卒業者数
              {
                "GAKKA_MEI": "○○学", // 学科名
                "GAKKA_MEI_FUGO": "C000",
                "JOKYO_SOTSUGYOSHA_SU": [
                  // 状況別卒業者数（length = 1 の配列）
                  {
                    "SOTSUGYOSHA_SU_KEI_M": "90",
                    "SOTSUGYOSHA_SU_KEI_F": "21",
                    "SOTSUGYOSHA_SU": [
                      // 進路分類別・男女別の卒業者数
                      {
                        "SOTSUGYOSHA_SU": "14",
                        "SOTSUGYOSHA_SHINRO_BUNRUI": "A大学院研究科", // 進路分類。学校基本調査「卒業後の状況調査票2-1」の様式にある分類に準じる（※1）
                        "SOTSUGYOSHA_SEX": "男", // 男女
                      },
                      // ...
                    ],
                  },
                ],
                "DAIGAKUIN_HAKASE_KATEI_UCHI": [
                  // 大学院博士課程内訳（博士課程の状況別卒業者数の内数として満期退学者等の数を再掲）
                  {
                    "SHURYOSHA_SU": {
                      "SHURYOSHA_SU": "",
                      "SHURYOSHA_HAKASE_KATEI_BUNRUI": "満期退学者", // 「満期退学者」「ポストドクター等（満期退学者を含む）／Hのうち」「ポストドクター等（満期退学者を含む）／Iのうち」「ポストドクター等（満期退学者を含む）／Jのうち」
                      "SHURYOSHA_SEX": "女", // 男女
                    },
                  },
                  // ...
                ],
                "NYUGAKU_NENDO_SOTSUGYOSHA_SU": [
                  // 入学年度別卒業者数
                  {
                    "SOTSUGYOSHA_SU_KEI_M": "90",
                    "SOTSUGYOSHA_SU_KEI_F": "21",
                    "SOTSUGYOSHA_SU": [
                      // 入学年度別・男女別卒業者数
                      {
                        "SOTSUGYOSHA_SU": "69",
                        "SOTSUGYOSHA_NENDO": "2017", // 入学年度。
                        "SOTSUGYOSHA_SEX": "男", // 男女
                      },
                      // ...
                    ],
                  },
                ],
              },
              // ... 他学科についても同様
            ],
            "KIHON_INFO": {
              "KIHON_GAKKO_CHOSA_CD": "0000",
              "KIHON_GAKUBU_KENKYUKA_CD": "1C00",
              "KIHON_ADDR_CD": "00",
            },
          },
        },
      ],
    },
  },
}
```

詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

###### ※1: 進路分類（SOTSUGYOSHA_SHINRO_BUNRUI）

とりうる値は以下のとおり（2022 年 9 月 18 日現在）。
詳細は[文部科学省の学校基本調査ページ](https://www.mext.go.jp/b_menu/toukei/chousa01/kihon/sonota/1355787_00001.htm)で閲覧できる最新の「卒業後の状況調査票（2-1）」様式を参照のこと。

<!-- prettier-ignore -->
> - A大学院研究科
> - B大学学部
> - C短期大学本科
> - D専攻科
> - E別科
> - F自営業主等
> - G無期雇用労働者
> - H有期雇用労働者(雇用契約期間が一か月以上のもの)
> - I臨時労働者
> - 臨床研修医(予定者を含む)
> - 専修学校・外国の学校等入学者
> - J左記以外の者／進学準備中の者
> - J左記以外の者／就職準備中の者
> - J左記以外の者／その他
> - 不詳・死亡の者
> - 自営業主等無期雇用労働者，
> - 雇用契約期間が1年以上かつフルタイム勤務相当の者，
> - 左記H有期雇用労働者のうち雇用契約期間が一年以上かつフルタイム勤務相当の者

様式（進路分類）の変更に対応するために、過年度の調査票にあって、最新の調査票では廃止されている分類`自営業主等無期雇用労働者，`や`雇用契約期間が1年以上かつフルタイム勤務相当の者，`も含まれていることに注目。今後も、文科省が分類を変更した場合は新規項目の追加として扱われると想定できる。

### `getStatusAfterGraduationJobs(accessKey, year, orgId)`

卒業後の状況調査票(2-2) API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `orgId`      | `String` | 学部・研究科等組織 ID           |

#### 戻り値

`Object`: `JSON.parse()`された卒業後の状況調査票(2-2) API の出力。

##### 例

```javascript
// 組織IDとして「0000-00-00-1C00-00-1」が存在すると仮定すると
Portraits.getStatusAfterGraduationJobs(accessKey, 2021, '0000-00-00-1C00-00-1');
```

戻り値は次のような形式となっている：

```jsonc
{
  "GET_STATUS_LIST": {
    "RESULT": {
      "STATUS": "0",
      "ERROR_MSG": "正常に終了しました。",
      "DATE": "2022/09/18 00:58:08",
    },
    "PARAMETER": {
      "YEAR": "2021年度",
      "QUE_NAME": "卒業後の状況調査票(2-2)",
      "ORG_ID": "0000-00-00-1C00-00-1",
    },
    "DATALIST_INF": {
      "NUMBER": "1",
      "DATA_INF": [
        {
          "UPDATE_DATE": "2021/08/27 15:16:54",
          "CONTENT": {
            "GAKKO": { "GAKKO_MEI": "○○大学", "GAKKO_TYPE": "1" },
            "GAKUBU_KENKYUKA": {
              "GAKUBU_MEI": "○○学部",
              "GAKUBU_KATEI_KBN": "",
              "GAKUBU_CHUYA_KBN": "1",
              "GAKUBU_YUBIN": "000-0000",
              "GAKUBU_ADDR": "○○県○○７－３－１",
            },
            "GAKKA_SENKO": [
              {
                "GAKKA_MEI": "○○学科",
                "GAKKA_MEI_FUGO": "C000",
                "SHOKUGYO_SHUSHOKUSHA_SU": {
                  // 職業別就職者数
                  "SHUSHOKUSHA_SU_KEI_M": "68",
                  "SHUSHOKUSHA_SU_KEI_F": "14",
                  "SHUSHOKUSHA_SU": [
                    // 職業分類別・男女別の就職者数
                    {
                      "SHUSHOKUSHA_SU": "1",
                      "SHUSHOKUSHA_SHOKUGYO_BUNRUI": "b 専門的・技術的職業従事者／1 研究者", // 職業分類。学校基本調査「卒業後の状況調査票2-2」の様式にある分類に準じる（※2）
                      "SHUSHOKUSHA_SEX": "男", // 男女
                    },
                    // ...
                  ],
                },
                "SANGYO_SHUSHOKUSHA_SU": {
                  // 産業別就職者数
                  "SHUSHOKUSHA_SU_KEI_M": "68",
                  "SHUSHOKUSHA_SU_KEI_F": "14",
                  "SHUSHOKUSHA_SU": [
                    // 産業分類別・男女別の就職者数
                    {
                      "SHUSHOKUSHA_SU": "",
                      "SHUSHOKUSHA_SANGYO_BUNRUI": "A 農業，林業", // 産業分類。学校基本調査「卒業後の状況調査票2-2」の様式にある分類に準じる（※3）
                      "SHUSHOKUSHA_SEX": "女", // 男女
                    },
                    // ...
                  ],
                },
              },
              // ...
            ],
            "KIHON_INFO": {
              "KIHON_GAKKO_CHOSA_CD": "0000",
              "KIHON_GAKUBU_KENKYUKA_CD": "1C00",
              "KIHON_ADDR_CD": "00",
            },
          },
        },
      ],
    },
  },
}
```

詳細は公式ドキュメントを参照: https://api-portal.portraits.niad.ac.jp/api-info.html

###### ※2: 職業分類（SHUSHOKUSHA_SHOKUGYO_BUNRUI）

とりうる値は以下のとおり（2022 年 9 月 18 日現在）。
詳細は[文部科学省の学校基本調査ページ](https://www.mext.go.jp/b_menu/toukei/chousa01/kihon/sonota/1355787_00001.htm)で閲覧できる最新の「卒業後の状況調査票（2-2）」様式を参照のこと。

<!-- prettier-ignore -->
> - a 管理的職業従事者
> - b 専門的・技術的職業従事者／1 研究者
> - b 専門的・技術的職業従事者／2 農林水産技術者
> - b 専門的・技術的職業従事者／3 製造技術者(開発)／機械
> - b 専門的・技術的職業従事者／3 製造技術者(開発)／電気
> - b 専門的・技術的職業従事者／3 製造技術者(開発)／化学
> - b 専門的・技術的職業従事者／3 製造技術者(開発)／その他
> - b 専門的・技術的職業従事者／4 製造技術者(開発除く)／機械
> - b 専門的・技術的職業従事者／4 製造技術者(開発除く)／電気
> - b 専門的・技術的職業従事者／4 製造技術者(開発除く)／化学
> - b 専門的・技術的職業従事者／4 製造技術者(開発除く)／その他
> - b 専門的・技術的職業従事者／5 建築・土木・測量技術者
> - b 専門的・技術的職業従事者／6 情報処理・通信技術者
> - b 専門的・技術的職業従事者／7 その他の技術者
> - b 専門的・技術的職業従事者／8 教員／幼稚園
> - b 専門的・技術的職業従事者／8 教員／小学校
> - b 専門的・技術的職業従事者／8 教員／中学校
> - b 専門的・技術的職業従事者／8 教員／高等学校
> - b 専門的・技術的職業従事者／8 教員／中等教育学校
> - b 専門的・技術的職業従事者／8 教員／高等専門学校
> - b 専門的・技術的職業従事者／8 教員／短期大学
> - b 専門的・技術的職業従事者／8 教員／大学
> - b 専門的・技術的職業従事者／8 教員／特別支援学校
> - b 専門的・技術的職業従事者／8 教員／その他
> - b 専門的・技術的職業従事者／9 医師，歯科医師，獣医師，薬剤師／医師，歯科医師
> - b 専門的・技術的職業従事者／9 医師，歯科医師，獣医師，薬剤師／獣医師
> - b 専門的・技術的職業従事者／9 医師，歯科医師，獣医師，薬剤師／薬剤師
> - b 専門的・技術的職業従事者／10 保健師，助産師，看護師
> - b 専門的・技術的職業従事者／11 医療技術者
> - b 専門的・技術的職業従事者／12 その他の保健医療従事者／1 栄養士
> - b 専門的・技術的職業従事者／12 その他の保健医療従事者／2 その他
> - b 専門的・技術的職業従事者／13 美術・写真・デザイナー・音楽・舞台
> - b 専門的・技術的職業従事者／14 その他
> - c 事務従事者
> - d 販売従事者
> - e サービス職業従事者
> - f 保安職業従事者
> - g 農林漁業従事者／1 農林業従事者
> - g 農林漁業従事者／2 漁業従事者
> - h 生産工程従事者
> - i 輸送・機械運転従事者
> - j 建設・採掘従事者
> - k 運搬・清掃等従事者
> - 左記以外

###### ※3: 産業分類（SHUSHOKUSHA_SANGYO_BUNRUI）

とりうる値は以下のとおり（2022 年 9 月 18 日現在）。
詳細は[文部科学省の学校基本調査ページ](https://www.mext.go.jp/b_menu/toukei/chousa01/kihon/sonota/1355787_00001.htm)で閲覧できる最新の「卒業後の状況調査票（2-2）」様式を参照のこと。

<!-- prettier-ignore -->
> - A 農業，林業
> - B 漁業
> - C 鉱業，採石業，砂利採取業
> - D 建設業
> - E 製造業／1 食料品・飲料・たばこ・飼料製造業
> - E 製造業／2 繊維工業
> - E 製造業／3 印刷・同関連業
> - E 製造業／4 化学工業，石油製品・石炭製品製造業
> - E 製造業／5 鉄鋼業，非鉄金属・金属製品製造業
> - E 製造業／6 はん用・生産用・業務用機械器具製造業
> - E 製造業／7 電子部品・デバイス・電子回路製造業
> - E 製造業／8 電気・情報通信機械器具製造業
> - E 製造業／9 輸送用機械器具製造業
> - E 製造業／10 その他の製造業
> - F 電気・ガス・熱供給・水道業
> - G 情報通信業
> - H 運輸業，郵便業
> - I 卸売業，小売業／1 卸売業
> - I 卸売業，小売業／2 小売業
> - J 金融業，保険業／1 金融業
> - J 金融業，保険業／2 保険業
> - K 不動産業，物品賃貸業／1 不動取引・賃貸・管理業
> - K 不動産業，物品賃貸業／2 物品賃貸業
> - L 学術研究，専門・技術サービス業／1 学術・開発研究機関
> - L 学術研究，専門・技術サービス業／2 法務
> - L 学術研究，専門・技術サービス業／3 その他の専門・技術サービス業
> - M 宿泊業，飲食サービス業 （←**末尾に半角スペースがあることに注意**）
> - N 生活関連サービス業，娯楽業 （←**末尾に半角スペースがあることに注意**）
> - O 教育，学習支援業／1 学校教育
> - O 教育，学習支援業／2 その他の教育，学習支援業
> - P 医療，福祉／1 医療業，保険衛生
> - P 医療，福祉／2 社会保険・社会福祉・介護事業
> - Q 複合サービス事業
> - R サービス業(他に分類されないもの)／1 宗教
> - R サービス業(他に分類されないもの)／2 その他のサービス業
> - S 公務(他に分類されるのもを除く)／1 国家公務
> - S 公務(他に分類されるのもを除く)／2 地方公務
> - 左記以外

### `getSchoolFacilities(accessKey, year, univId)`

学校施設調査票 API 情報取得

#### パラメータ

| パラメータ名 | データ型 | 解説                            |
| ------------ | -------- | ------------------------------- |
| `accessKey`  | `String` | ポートレート API のアクセスキー |
| `year`       | `Number` | 対象年度の西暦 4 桁             |
| `univId`     | `String` | 4 桁の大学 ID                   |

#### 戻り値

`Object`: `JSON.parse()`された学校施設調査票 API の出力。

##### 例

```javascript
// 大学IDとして「0000」が存在すると仮定すると
Portraits.getSchoolFacilities(accessKey, 2021, '0000');
```

戻り値は次のような形式となっている：

```jsonc
{
  "GET_STATUS_LIST": {
    "RESULT": {
      "STATUS": "0",
      "ERROR_MSG": "正常に終了しました。",
      "DATE": "2022/09/18 00:59:52",
    },
    "PARAMETER": {
      "YEAR": "2021年度",
      "QUE_NAME": "学校施設調査票",
      "ORG_ID": "0000",
    },
    "DATALIST_INF": {
      "NUMBER": "1",
      "DATA_INF": [
        {
          "UPDATE_DATE": "2021/09/06 15:26:10",
          "CONTENT": {
            "GAKKO": {
              "GAKKO_MEI": "○○大学",
              "GAKKO_YUBIN": "000-0000",
              "GAKKO_ADDR": "○○市○○１－２－３",
            },
            "GAKKO_TOCHI_YOTO_AREA": [
              // 学校土地の用途別面積
              {
                "AREA_KEI": "50507132",
                "AREA": [
                  {
                    "AREA": "894580", // 面積
                    "AREA_YOTO": "校舎・講堂・体育施設敷地", // 用途。「校舎・講堂・体育施設敷地」「屋外運動場敷地」「附属病院敷地」「附置研究所敷地」「附属研究施設敷地」「寄宿舎施設」「その他」
                    "AREA_TANI": "㎡", // 面積の単位。固定値「㎡」（平方メートル）
                  },
                  // ...
                ],
              },
            ],
            "GAKKO_TATEMONO_YOTO_AREA": [
              // 学校建物の用途別面積
              {
                "AREA_KEI": "0",
                "AREA": [
                  {
                    "AREA": "", // 面積
                    "AREA_YOTO": "校舎／講義室・演習室", // 用途。「校舎／講義室・演習室」「校舎／実験室・実習室」「校舎／研究室」「校舎／図書館」「校舎／管理関係・その他」「講堂」「体育施設」「附属病院」「附置研究所」「附置研究施設」「寄宿舎」「その他」「学校建物の用途別面積のうち厚生補導施設（再掲）」
                    "AREA_TANI": "㎡", // 面積の単位。固定値「㎡」（平方メートル）
                  },
                  // ...
                ],
              },
            ],
            "GAKKO_TATEMONO_KOZO_AREA": [
              // 学校建物の構造別面積
              {
                "AREA_KEI": "0",
                "AREA": [
                  {
                    "AREA": "", // 面積
                    "AREA_SHOYU_SHAKUYO": "設置者所有", // 「設置者所有」「借用」
                    "AREA_KOZO": "木造", // 「木造」「鉄筋コンクリート造」「鉄骨造」「その他」
                    "AREA_TANI": "㎡", // 面積の単位。固定値「㎡」（平方メートル）
                  },
                  // ...
                ],
              },
            ],
            "GAKKO_TATEMONO_SHINCHIKU_ZOKA_AREA": [
              // 学校建物の新築増加の面積
              {
                "AREA_KEI": "0",
                "AREA": [
                  {
                    "AREA": "", // 面積
                    "AREA_ZOKA_RIYU": "新改築", // 増加理由。「新改築」「購入又は寄付」「用途変更等による増」
                    "AREA_NENDO": "（2020年5月2日～2021年5月1日）", // 年度「（yyyy-1年5月2日～yyyy年5月1日）」（yyyyがデータ取得で指定した西暦4桁の年度）
                    "AREA_TANI": "㎡", // 面積の単位。固定値「㎡」（平方メートル）
                  },
                  // ...
                ],
              },
            ],
            "GAKKO_TATEMONO_HIGAITO_GENSHO_AREA": [
              // 学校建物の被害等減少の面積
              {
                "AREA_KEI": "0",
                "AREA": [
                  {
                    "AREA": "", // 面積
                    "AREA_GENSHO_RIYU": "全壊", // 減少理由。「全壊」「半壊」「改築、用途変更又は用途廃止等による減」
                    "AREA_NENDO": "（2020年5月2日～2021年5月1日）", // 年度「（yyyy-1年5月2日～yyyy年5月1日）」（yyyyがデータ取得で指定した西暦4桁の年度）
                    "AREA_TANI": "㎡", // 面積の単位。固定値「㎡」（平方メートル）
                  },
                  // ...
                ],
              },
            ],
            "ZENNENDO_GAKKO_TATEMONO_AREA": {
              // 前年度の学校建物の面積
              "ZENNENDO_AREA": "", // 面積
              "ZENNENDO_TANI": "㎡", // 面積の単位。固定値「㎡」（平方メートル）
            },
            "SHOKUIN_SHUKUSHA_YOTO_TOCHI_AREA": [
              // 職員宿舎の用途別土地面積
              {
                "AREA": {
                  "AREA": "59845", // 面積
                  "AREA_SHIKICHIMEI": "職員住宅敷地", // 敷地名。「職員住宅敷地」「看護師宿舎敷地」
                  "AREA_TANI": "㎡", // 面積の単位。固定値「㎡」（平方メートル）
                },
              },
              // ...
            ],
            "SHOKUIN_SHUKUSHA_YOTO_TATEMONO_AREA": [
              // 職員宿舎の用途別建物面積
              {
                "AREA": {
                  "AREA": "", // 面積
                  "AREA_TATEMONOMEI": "職員住宅", // 建物名。「職員住宅」「看護師宿舎」
                  "AREA_TANI": "㎡", // 面積の単位。固定値「㎡」（平方メートル）
                },
              },
              // ...
            ],
            "GAKKO_KIHON_INFO": { "GAKKO_CHOSA_CD": "0000" },
          },
        },
      ],
    },
  },
}
```

## API 呼び出しに必要な組織 ID を参照する

### `getAllIds()`

全ての種類の組織 ID 一覧を取得

#### 戻り値

`Object`: 全ての組織 ID のオブジェクト

```jsonc
{
  "univIds": [
    { "UNIV_ID": "0000", "UNIV_NAME": "○○大学", "AY2021": "○", "AY2022": "○" },
    // ...
  ],
  "intlIdSuffixes": [
    {
      "INTL_ID_SUFFIX": "-1Z11",
      "INTL_CATEGORY": "大学学部、短期大学本科（外国人学生調査票用）",
    },
    // ...
  ],
  "organizationIds": {
    "2021": {
      "○○大学": [
        {
          "OID": "0100-01-01-1K08-00-1", // 学部・研究科等組織ID
          "DEP": "○○学部", // 学部・研究科名
          "LOC": "○○", // 所在地
          "CTG": "", // 分類
          "DN": "昼間", // 昼間 or 夜間
        },
        {
          "OID": "0100-01-01-1Y68-01-1",
          "DEP": "○○研究科",
          "LOC": "○○",
          "CTG": "修士課程",
          "DN": "昼間",
        },
        // ...
      ],
      // ...
    },
    // ...
  },
}
```

[README の「全ての組織 ID を一度に取得する」](README.md#全ての組織-id-を一度に取得する)に関連記載あり。

### `getAllUnivIds()`

全ての大学 ID 一覧を取得

#### 戻り値

`Array`: 大学名（`UNIV_NAME`）と大学 ID（`UNIV_ID`）及び各年度（`AYxxxx`; `xxxx`は西暦 4 桁）の対応状況がセットになったオブジェクトの配列

```jsonc
[
  {
    "UNIV_ID": "0000", // 大学ID
    "UNIV_NAME": "○○大学", // 大学名
    "AY2021": "○", // ○がついていればこの大学のこの年度は対応している。
    "AY2022": "○",
    // ...
  },
  // ...
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

`Array`: 指定した大学名について、大学名（`UNIV_NAME`）と大学 ID（`UNIV_ID`）及び各年度（`AYxxxx`; `xxxx`は西暦 4 桁）の対応状況がセットになったオブジェクトの配列

```jsonc
[
  {
    "UNIV_ID": "0000", // 大学ID
    "UNIV_NAME": "○○大学", // 大学名
    "AY2021": "○", // ○がついていればこの大学のこの年度は対応している。
    "AY2022": "○",
    // ...
  },
]
```

[README の「大学 ID の参照」](README.md#大学-id-の参照)に関連記載あり。

### `getAllIntlIdSuffixes()`

外国人用組織 ID 用の所属課程分類 ID 一覧を取得。外国人用組織 ID は `<大学ID>-<所属課程分類ID>` という文字列となっている。ここではハイフンを含めた所属課程分類 ID とその課程分類がオブジェクトの配列として返ってくる。

#### 戻り値

`Array`

```jsonc
[
  {
    "INTL_ID_SUFFIX": "-1Z11",
    "INTL_CATEGORY": "大学学部、短期大学本科（外国人学生調査票用）",
  },
  {
    "INTL_ID_SUFFIX": "-1Z33",
    "INTL_CATEGORY": "修士課程、博士前期課程、一貫制博士課程の1～2年次（外国人学生調査票用）",
  },
  {
    "INTL_ID_SUFFIX": "-1Z44",
    "INTL_CATEGORY": "博士後期課程、一貫制博士課程の3～5年次、\n医歯学・薬学・獣医学関係の一貫制博士課程（外国人学生調査票用）",
  },
  {
    "INTL_ID_SUFFIX": "-1Z55",
    "INTL_CATEGORY": "専門職学位課程（外国人学生調査票用）",
  },
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

```jsonc
[
  ["0000-1Z11", "0000-1Z33", "0000-1Z44", "0000-1Z55"], // 大学ID「0000」の外国人用組織ID一式
  ["1111-1Z11", "1111-1Z33", "1111-1Z44", "1111-1Z55"], // 大学ID「1111」の外国人用組織ID一式
]
```

上の例は `Portraits.getIntlIds(['0000', '1111'])` に対する出力の例。[README の「外国人用組織 ID の参照」](README.md#外国人用組織-id-の参照) に関連記載あり。

### `getAllOrganizationIds()`

全ての年の学部・研究科等組織 ID 一覧を取得

#### 戻り値

`Object`

```jsonc
{
  "2021": {
    "○○大学": [
      {
        "OID": "0100-01-01-1K08-00-1", // 学部・研究科等組織ID
        "DEP": "○○学部", // 学部・研究科名
        "LOC": "○○", // 所在地
        "CTG": "", // 分類
        "DN": "昼間", // 昼間 or 夜間
      },
      {
        "OID": "0100-01-01-1Y68-01-1",
        "DEP": "○○研究科",
        "LOC": "○○",
        "CTG": "修士課程",
        "DN": "昼間",
      },
      // ...
    ],
    // ...
  },
  // ...
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

```jsonc
{
  "○○大学": [
    {
      "OID": "0100-01-01-1K08-00-1", // 学部・研究科等組織ID
      "DEP": "○○学部", // 学部・研究科名
      "LOC": "○○", // 所在地
      "CTG": "", // 分類
      "DN": "昼間", // 昼間 or 夜間
    },
    // ...
  ],
  // ...
}
```

[README の「学部・研究科等組織 ID の参照」](README.md#学部研究科等組織-id-の参照) に関連記載あり。
