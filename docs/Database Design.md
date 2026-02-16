### People

| Id  | Short Name | Full Name        | Email            | Phone        |
| --- | ---------- | ---------------- | ---------------- | ------------ |
| 1   | Eva        | Eva J Herzog     | fake@sample.mail | 444-333-1111 |
| 2   | Jake       | Jake Patterson   | jake@sample.mail | 555-666-2222 |
| 3   | Forest     | Henry F Garfield |                  |              |
| 4   | Mary       | Maria Elizabeth  |                  |              |

### Events

| Id     | Title               | Start       | End         | Location   | Address   | Description | Image URL |
| ------ | ------------------- | ----------- | ----------- | ---------- | --------- | ----------- | --------- |
| ABCDEF | 40th Birthday Party | {timestamp} | {timestamp} | McKenzie's | Somewhere | Lorem       | {url}     |

### Hosts

| Id  | Event  | Host |
| --- | ------ | ---- |
| 1   | ABCDEF | 1    |
| 1   | ABCDEF | 4    |

### RSVPs

| Id   | Respondent Id | Guest Id | Event Id | Response | Comments                                 |
| ---- | ------------- | -------- | -------- | -------- | ---------------------------------------- |
| WXYZ | 2             | 2        | ABCDEF   | Y        | Lorem ipsum                              |
| LMNO | 2             | 3        | ABCDEF   | N        | Nihil vel doloribus culpa iusto quaerat. |
| DEFG | 2             | 4        | ABCDEF   | Y        |

### Pronouns

| Id  | Subject | Object | Possessive | Determiner | Reflexive | Nickname  | Custom |
| --- | ------- | ------ | ---------- | ---------- | --------- | --------- | ------ |
| 1   | they    | them   | their      | theirs     | themself  | they/them | N      |
| 2   | she     | her    | her        | hers       | herself   | she/her   | N      |
| 3   | he      | him    | his        | his        | himself   | he/him    | N      |
| 4   | ze      | zir    | zir        | zirs       | zirself   | ze/zir    | N      |
| 5   |         |        |            |            |           | any       | N      |
| 6   |         |        |            |            |           | purple    | Y      |

### PersonalPronouns

| Id  | Person Id | Pronoun Id |
| --- | --------- | ---------- |
| 1   | 1         | 1          |
| 2   | 1         | 2          |
| 3   | 2         | 3          |
| 4   | 2         | 2          |
| 5   | 3         | 4          |
| 6   | 4         | 5          |

### Diets

| Id  | Type    | Details      | Custom? |
| --- | ------- | ------------ | ------- |
| 1   | Allergy | Strawberries | Y       |
| 2   | Diet    | Vegan        | N       |
| 3   | Allergy | Tree Nuts    | N       |

### PersonalDiets

| Id  | Person Id | Diet Id |
| --- | --------- | ------- |
| 1   | 2         | 3       |
| 2   | 2         | 1       |
| 3   | 4         | 2       |
