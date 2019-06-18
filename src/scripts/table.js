import get from 'lodash.get';
import dayjs from 'dayjs';

const DATE_FORMAT = 'DD-MM-YYYY hh:mmA';
const TABLE_FIELDS = [
  {
    FIELD_NAME: 'name',
    HEADER_NAME: 'Customer Name'
  },
  {
    FIELD_NAME: 'contact.phone',
    HEADER_NAME: 'Phone'
  },
  {
    FIELD_NAME: 'contact.email',
    HEADER_NAME: 'Email'
  },
  {
    FIELD_NAME: 'status',
    HEADER_NAME: 'Status'
  },
  {
    FIELD_NAME: 'createDate',
    HEADER_NAME: 'Create On',
    FIELD_TYPE: 'Date'
  }
];

const SORT_CONST = {
  UP: {
    icon: 'fa-sort-up',
    desc: false
  },
  DOWN: {
    icon: 'fa-sort-down',
    desc: true
  },
  NORMAL: {
    icon: 'fa-sort',
    desc: false
  }
};

/**
 * map table display data from database data
 * @param {*} id
 * @param {*} dbData
 */
const mapTableData = (id, dbData) => {
  const row = { id: id };
  for (let field of TABLE_FIELDS) {
    if ('Date' === field.FIELD_TYPE) {
      //convert date:
      const time = dbData[(dbData, field.FIELD_NAME)];
      if (time) {
        row[field.FIELD_NAME] = dayjs(time.toDate()).format(DATE_FORMAT);
      }
    } else {
      row[field.FIELD_NAME] = get(dbData, field.FIELD_NAME) || '';
    }
  }

  return row;
};

/**
 * Generate table String with table data
 * @param {*} tableData table data array
 * @param {*} param param
 */

const generateTable = (tableData, param) => {
  //const table = document.createElement('table');
  //generate header
  const thRow = `<tr class="table-secondary">${TABLE_FIELDS.map(
    field =>
      `<th id="th_${field.FIELD_NAME}" scope="col">${
        field.HEADER_NAME
      } <i class="fas fa-sort"></i></th>`
  ).join('')}<th></th></tr>`;
  const tbody = generateTBody(tableData, param);
  return `<table class="table table-bordered table-sm table-striped"><thead>${thRow}</thead><tbody>${tbody}</tbody></table>`;
};
/**
 * generate TBody only
 * @param {*} tableData
 * @param {*} param
 */
const generateTBody = (tableData, param) => {
  //generate body
  const tbody = tableData
    ? tableData
        .map(row => {
          return `<tr id="${row.id}" cope="row" data-toggle="modal" data-target="#detailModal">${TABLE_FIELDS.map(
            field => `<td>${row[field.FIELD_NAME]}</td>`
          ).join('')} <td class="notes "><i class="fas fa-sticky-note text-secondary" data-toggle="tooltip" trigger="hover" title="${row['note']||'Add Note'}"></i></td></tr>`;
        })
        .join('')
    : '';
  return tbody;
};

/**
 * filter table data, it will check all the fields in a row
 * @param {*} tableData table data to be filtered 
 * @param {*} filterStr filter string
 */
const filterTableData = (tableData, filterStr) => {
  if (tableData) {
    return tableData.filter(item => {
      for (let field of TABLE_FIELDS) {
        // if any of the fields include filter, return true;
        const fieldVal = item[field.FIELD_NAME];
        if (fieldVal && fieldVal.toLowerCase().includes(filterStr.toLowerCase())) {
          return true;
        }
      }
    });
  } else {
    return [];
  }
};

/**
 * sort table data with string sequence
 * @param {*} tableData 
 * @param {*} sortParam field : sort field name , desc: is Desc sequence
 */

const sortTableData = (tableData, sortParam) => {
  if (tableData && tableData.length > 0) {
    tableData.sort((a, b) => {
      const field = sortParam.field;
      let result = a[field] > b[field] ? 1 : -1;
      result = sortParam.desc ? -1 * result : result;
      return result;
    });
  }
};

export { mapTableData, generateTable, generateTBody, filterTableData, sortTableData };
