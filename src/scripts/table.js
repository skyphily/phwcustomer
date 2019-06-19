import get from 'lodash.get';
import dayjs from 'dayjs';

//Constant definition
const DATE_FORMAT = 'DD-MM-YYYY hh:mmA';

const CUSTOMER_FILEDS = [{
    FIELD_NAME: 'name',
    TABLE_HEADER_NAME: 'Customer Name',
    DETAIL_FIELD_NAME:'dtName'
  },
  {
    FIELD_NAME: 'contact.phone',
    TABLE_HEADER_NAME: 'Phone',
    DETAIL_FIELD_NAME:'dtPhone'
  },
  {
    FIELD_NAME: 'contact.email',
    TABLE_HEADER_NAME: 'Email',
    DETAIL_FIELD_NAME:'dtEmail'
  },
  {
    FIELD_NAME: 'status',
    TABLE_HEADER_NAME: 'Status',
    DETAIL_FIELD_NAME:'dtStatus'
  },
  {
    FIELD_NAME: 'createDate',
    TABLE_HEADER_NAME: 'Create On',
    FIELD_TYPE: 'DATE',
    DETAIL_FIELD_NAME:'dtCreationDate'
  },
  {
    FIELD_NAME: 'note',
    TABLE_HEADER_NAME: '',
    FIELD_TYPE: 'NOTE',
    DETAIL_FIELD_NAME:'dtNote'
  }
];

/**
 * map table display data from database data
 * @param {*} id
 * @param {*} dbData
 */
const mapTableData = (id, dbData) => {
  const row = {
    id: id
  };
  for (let field of CUSTOMER_FILEDS) {
    if ('DATE' === field.FIELD_TYPE) {
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
 * @param {*} param param (not used yet)
 */

const generateTable = (tableData, param) => {
  //const table = document.createElement('table');
  //generate header
  const thRow = `<tr class="table-secondary">${CUSTOMER_FILEDS.map(
    field =>
      field.FIELD_TYPE!=='NOTE'?
      `<th id="th_${field.FIELD_NAME}" scope="col">${
        field.TABLE_HEADER_NAME
      } <i class="fas fa-sort"></i></th>`:''
  ).join('')} <th></th></tr>`;
  //generate tbody
  const tbody = generateTBody(tableData, param);
  //generate whole table
  return `<table class="table table-bordered table-sm table-striped"><thead>${thRow}</thead><tbody>${tbody}</tbody></table>`;
};
/**
 * generate TBody only, can be called and update separately
 * @param {*} tableData table data array
 * @param {*} param param (not used yet)
 */
const generateTBody = (tableData, param) => {
  //generate body
  const tbody = tableData ?
    tableData
    .map(row => {
      return `<tr id="${row.id}" cope="row" data-toggle="modal" data-target="#detailModal">${CUSTOMER_FILEDS.map(
            field => (field.FIELD_TYPE!=='NOTE')?`<td>${row[field.FIELD_NAME]}</td>`:''
        ).join('')} ${row['note']?`<td class="notes "><i class="fas fa-sticky-note text-secondary" data-toggle="tooltip" trigger="hover" title="${row['note']}"></i></td></tr>`:'<td></td>'}`;
    })
    .join('') :
    '';
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
      for (let field of CUSTOMER_FILEDS) {
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
  if (sortParam.field && tableData && tableData.length > 0) {
    tableData.sort((a, b) => {
      const field = sortParam.field;
      let result = a[field] > b[field] ? 1 : -1;
      result = sortParam.desc ? -1 * result : result;
      return result;
    });
  }
};

export {
  mapTableData,
  generateTable,
  generateTBody,
  filterTableData,
  sortTableData,
  CUSTOMER_FILEDS
};