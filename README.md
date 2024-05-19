# Hrnet Table

 A customizable React component library for rendering sortable and paginated tables, designed for ease of integration and extensive customization.

## Installation

To install the library, you can use:

```code
npm i hrnet-ts-table
```

## Imports

To use the library, you must make two imports:

```code
import Table, { type ColumnHeader } from "hrnet-ts-table";
import "hrnet-ts-table/dist/index.css";
```

## Usage

After the imports, at the table header level, here is what must be provided with the possible options:

```code
 const columns:Array<ColumnHeader> = [
        { sortKey: "firstName", title: "First Name",  },
        { sortKey: "lastName", title: "Last Name" },
        { sortKey: "startDate", title: "Start Date", type: "date", sort:filterDate },
        { sortKey: "department", title: "Department" },
        { sortKey: "dateOfBirth", title: "Date of Birth",type: "date",sort:filterDate  },
        { sortKey: "street", title: "Street", sort:filterStreet,  },
        { sortKey: "city", title: "City", enableSort: false},
        { sortKey: "state", title: "State" },
        { sortKey: "zipCode", title: "Zip Code", type: "number" },
    ]
```

| Props | value |
| ------ | ------ |
| sortKey | column name linked object key |
| title | column name   |
| type | type of data provided, by default it is of type string |
| sort | allows you to provide a sort function, by default there is a sort function on the string type |
| enableSort | by default allows sorting but possible to set false to prevent sorting |

Afterwards for the component you must provide it:

```code
 <Table columns={columns} entries={dataList} pagesCutCount={20} enablePagination={true}  />
```

It is not mandatory to provide pagesCutCount and enablePagination, it will use the default values

| Props | value |
| ------ | ------ |
| columns | allows you to set up the number of columns defined above |
| entries | provided the data   |
| pagesCutCount | allows you to know how many elements appear per page if enablePagination is equal to true |
| enablePagination | allows you to have pagination or not on the table, by default it is true |

## Example

Here is an example data

```code
[{"firstName":"Lorinda","lastName":"Bairstow","startDate":"22/09/2023","department":"Training","dateOfBirth":"18/12/1974","street":"016 Pierstorff Point","city":"Nouméa","zipCode":"98800"},
{"firstName":"Selig","lastName":"Bailess","startDate":"07/11/2023","department":"Accounting","dateOfBirth":"10/07/1979","street":"10 Morning Junction","city":"Kampinos","zipCode":"05-085"},
{"firstName":"Eugine","lastName":"Duffit","startDate":"15/04/2024","department":"Sales","dateOfBirth":"22/08/1978","street":"6020 Bowman Alley","city":"Tillabéri"},
{"firstName":"Irene","lastName":"Muspratt","startDate":"08/05/2023","department":"Marketing","dateOfBirth":"12/06/1986","street":"9698 Anthes Road","city":"Järfälla","state":"Stockholm","zipCode":"177 57"},
{"firstName":"Penelopa","lastName":"Sirman","startDate":"25/05/2023","department":"Accounting","dateOfBirth":"15/04/1992","street":"1 Heffernan Point","city":"El Ángel"},
{"firstName":"Steffen","lastName":"Clayworth","startDate":"12/10/2023","department":"Sales","dateOfBirth":"08/08/1993","street":"106 Pankratz Center","city":"Rufino","zipCode":"6100"},
{"firstName":"Kerwin","lastName":"MacLeod","startDate":"21/06/2023","department":"Training","dateOfBirth":"01/02/1991","street":"94 Farragut Pass","city":"Jiaoqi"},
{"firstName":"Erik","lastName":"Medina","startDate":"26/08/2023","department":"Services","dateOfBirth":"20/02/1991","street":"8 Oneill Street","city":"Tvrdonice","zipCode":"691 53"}]
```

Here is an example functions and columns header:

```code
const filterStreet = (a: string, b: string) => {
        const streetA = a.split(' ');
        const streetB = b.split(' ');
      
        const numberA = Number.parseInt(streetA[0]);
        const numberB = Number.parseInt(streetB[0]);
      
        const nameA = streetA.slice(1).join(' ').toLowerCase();
        const nameB = streetB.slice(1).join(' ').toLowerCase();
      
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        if (nameA === nameB) {
          return numberA - numberB;
        }
        return 0;
      }
    const filterDate = (a: string,b: string) => {
        const dateA = new Date(a.split('/').reverse().join('/'))
        const dateB = new Date(b.split('/').reverse().join('/'))
        return dateA.getTime() - dateB.getTime()
    }

    const columns:Array<ColumnHeader> = [
        { sortKey: "firstName", title: "First Name",  },
        { sortKey: "lastName", title: "Last Name" },
        { sortKey: "startDate", title: "Start Date", type: "date", sort:filterDate },
        { sortKey: "department", title: "Department" },
        { sortKey: "dateOfBirth", title: "Date of Birth",type: "date",sort:filterDate  },
        { sortKey: "street", title: "Street", sort:filterStreet,  },
        { sortKey: "city", title: "City", enableSort: false},
        { sortKey: "state", title: "State" },
        { sortKey: "zipCode", title: "Zip Code", type: "number" },
    ]
```

and add to component:

```code
 <Table columns={columns} entries={dataList} />
```

## Github

You can find the source code and contribute to the development of this library at our [GitHub repository](https://github.com/Msabbadini/hrnet-package).

Feel free to fork, star, and contribute! If you find any issues or have suggestions, please open an issue on the GitHub page.
