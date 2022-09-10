# Portraits-GAS

大学ポートレート Web-API https://api-portal.portraits.niad.ac.jp/ （以下「ポートレート API」）を Google Apps Script (GAS) で使うためのライブラリです。

GAS のスクリプトサンプルを交えながら、ライブラリの使い方をご紹介します。

> ## 目次
>
> - [ライブラリを自分のスクリプトに追加する](#ライブラリを自分のスクリプトに追加する)
>   - [一般的な方法](#一般的な方法)
>   - [`appsscript.json` に追記する方法](#appsscriptjson-に追記する方法)
> - [使い方](#使い方)
>   - [API 呼び出しに必要な組織 ID の参照](#api-呼び出しに必要な組織-id-の参照)
>     - [大学 ID の参照](#大学-id-の参照)
>     - [学部・研究科等組織 ID の参照](#学部研究科等組織-id-の参照)
>     - [外国人用組織 ID の参照](#外国人用組織-id-の参照)
>     - [全ての組織 ID を一度に取得する](#全ての組織-id-を一度に取得する)
>   - [該当データが存在しない場合](#該当データが存在しない場合)
> - [告知](#告知)

## ライブラリを自分のスクリプトに追加する

### 一般的な方法

1. GAS スクリプトエディターの編集画面左側にある「ライブラリ」の「＋」をクリック。
2. スクリプト ID `1463IXI3rMb1b76Iwbm-jhuAiondvoDESz0FRPrOvi817HuKNnNJcfYhg` を入力して「検索」
3. 最新のバージョンを選んで「追加」。ここでデフォルトで `Portraits` となっている ID が、スクリプト内でライブラリ呼び出しに使うものです。任意の文字列でいいですが、以下の説明は `Portraits` としてあります。

### `appsscript.json` に追記する方法

```json
{
  ...
  "dependencies": {
    "libraries": [
      {
        "userSymbol": "Portraits",
        "version": "5", // ここでバージョンを指定する。
        "libraryId": "1463IXI3rMb1b76Iwbm-jhuAiondvoDESz0FRPrOvi817HuKNnNJcfYhg",
        "developmentMode": false
      }
    ]
  },
  ...
}
```

## 使い方

[API の仕様](https://api-portal.portraits.niad.ac.jp/api-info.html)で定められた各エンドポイントが、そのままメソッドとして使えるようになっています。

```javascript
// 大学IDが「0000」の大学について、2021年度の学生教員等状況票情報をsfとして取得する例
const sf = Portraits.getStudentFacultyStatus(accessKey, 2021, '0000');
```

下表で、本ライブラリにおいて API 呼び出し関連で使えるメソッド一覧です。URL 欄 は`https://edit.portraits.niad.ac.jp/api/v1/SchoolBasicSurvey/`に続く文字列を指します。（使用できるメソッドの網羅的なリストはレファレンスをご覧ください。）

| エンドポイント名                    | URL                                                          | 本ライブラリでのメソッド                                               |
| ----------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 学生教員等状況票 API 情報取得       | `getStudentFacultyStatus?<パラメータ群>`                     | `getStudentFacultyStatus(accessKey, year, univId)`                     |
| 学部学生内訳票 API 情報取得         | `getCollegeUndergraduateStudentsDetail?<パラメータ群>`       | `getCollegeUndergraduateStudentsDetail(accessKey, year, orgId)`        |
| 大学院学生内訳票 API 情報取得       | `getGraduateStudentsDetail?<パラメータ群>`                   | `getGraduateStudentsDetail(accessKey, year, orgId)`                    |
| 本科学生内訳票 API 情報取得         | `getJuniorCollegeUndergraduateStudentsDetail?<パラメータ群>` | `getJuniorCollegeUndergraduateStudentsDetail(accessKey, year, univId)` |
| 外国人学生調査票 API 情報取得       | `getForeignStudent?<パラメータ群>`                           | `getForeignStudent(accessKey, year, foreignId)`                        |
| 卒業後の状況調査票(2-1)API 情報取得 | `getStatusAfterGraduationGraduates?<パラメータ群>`           | `getStatusAfterGraduationGraduates(accessKey, year, orgId)`            |
| 卒業後の状況調査票(2-2)API 情報取得 | `getStatusAfterGraduationJobs?<パラメータ群>`                | `getStatusAfterGraduationJobs(accessKey, year, orgId)`                 |
| 学校施設調査票 API 情報取得         | `getSchoolFacilities?<パラメータ群>`                         | `getSchoolFacilities(accessKey, year, univId)`                         |

### API 呼び出しに必要な組織 ID の参照

[API の公式ページ](https://api-portal.portraits.niad.ac.jp/api-info.html)から参照できる仕様書にあるとおり、API を通じて情報を参照するには呼び出しごとに組織 ID（大学 ID または学部・研究科等組織 ID）を指定する必要があります。

その組織 ID 自体は API からは直接参照できず、[公式ページ](https://api-portal.portraits.niad.ac.jp/api-info.html)から Excel ファイルをダウンロードなどする必要がありますが、本ライブラリではその一覧を取得できるようになっています。

#### 大学 ID の参照

大学 ID は `getAllUnivIds()` や `getUnivIds(targetUnivNames: string[])` で参照できます。

```javascript
const targetUnivName = '○○大学';
const targetUnivId = Portraits.getUnivIds([targetUnivName])[0].UNIV_ID; // getUnivIds()が受け取るのは大学名の配列
console.log(
  JSON.stringify(
    Portraits.getStudentFacultyStatus(ACCESS_KEY, 2021, targetUnivId)
  )
);
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

#### 学部・研究科等組織 ID の参照

学部・研究科等組織 ID は `getAllOrganizationIds()` や `getOrganizationIdsbyUniv(targetYear: number, targetUnivNames: string[])` で参照でき、学部・研究科ごとに取りまとめられているデータの取得に使います。

```javascript
const oids = Portraits.getOrganizationIdsbyUniv(2021, ['○○大学', '▲▲大学']);
Object.keys(oids).forEach((univ) => {
  oids[univ].forEach((org) => {
    console.log(
      JSON.stringify(
        Portraits.getCollegeUndergraduateStudentsDetail(ACCESS_KEY, 2021, org.OID) // 学部学生内訳票の取得
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

#### 外国人用組織 ID の参照

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
Portraits.getIntlIds(['0000', '1111']);
```

の出力は

```json
[
  ["0000-1Z11", "0000-1Z33", "0000-1Z44", "0000-1Z55"], // 大学ID「0000」の外国人用組織ID一式
  ["1111-1Z11", "1111-1Z33", "1111-1Z44", "1111-1Z55"] // 大学ID「1111」の外国人用組織ID一式
]
```

#### 全ての組織 ID を一度に取得する

全ての種類の組織 ID を一度に取得する場合は `getAllIds()` を使います：

```javascript
Portraits.getAllIds();
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

### 該当データが存在しない場合

[公式ドキュメント](https://api-portal.portraits.niad.ac.jp/api-info.html)では明記されていませんが、API に対してリクエストを送ったときに、そのリクエストに該当するデータが存在しない場合、戻り値は次のようになります。

```json
{
  "GET_STATUS_LIST": {
    "RESULT": {
      "STATUS": "1", // 該当データがあった場合は"0"
      "ERROR_MSG": "正常に終了しましたが、該当データはありませんでした。", // 該当データがあった場合は"正常に終了しました。"
      "DATE": "2022/09/04 14:40:20"
    },
    "PARAMETER": {
      "YEAR": "2019年度",
      "QUE_NAME": "学生教職員等状況票",
      "ORG_ID": "0000"
    },
    "DATALIST_INF": {
      "NUMBER": "0",
      "DATA_INF": [{ "UPDATE_DATE": "", "CONTENT": null }]
    }
  }
}
```

該当データがない、というのは具体的には

- 年度が API でリクエスト可能な範囲外（2022 年 8 月 25 日の API リリース時点では 2021 年度のデータのみが利用可能）
- 組織 ID（大学 ID など）が不正

といったケースが想定されます。`GET_STATUS_LIST.RESULT.STATUS` の値に注目することで条件分岐を作ることもできます：

```javascript
const targetYears = [2019, 2020, 2021, 2022];
const univId = '0000';

targetYears.forEach((year) => {
  const response = Portraits.getStudentFacultyStatus(ACCESS_KEY, year, univId);
  if (response.GET_STATUS_LIST.RESULT.STATUS === '0') {
    // 該当データが存在する場合の処理
  } else {
    // 該当データが存在しない場合の処理
  }
});
```

## 告知

この GAS ライブラリは、[googleworkspace/apps-script-oauth2](https://github.com/googleworkspace/apps-script-oauth2)から枠組みを引用したもので、[大学ポートレートの Web-API 機能](https://api-portal.portraits.niad.ac.jp/index.html)のライブラリとして使用するために改変してあります。独立行政法人大学改革支援・学位授与機構（NIAD）が運用する大学ポートレートの Web-API 機能を使用していますが、本ライブラリの開発は、NIAD と関係のない[Taro Tsukagoshi](https://github.com/ttsukagoshi)によって管理・更新されています。[大学ポートレートの Web-API 機能利用規約](https://api-portal.portraits.niad.ac.jp/agreement.html)および[本ライブラリのライセンス](https://github.com/ttsukagoshi/portraits-gas/blob/main/LICENSE)に同意した上で利用してください。
