import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useRowSelect,
} from "react-table";
import { Table, Row, Col, Button, Input, CardBody } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import {
  ProductsGlobalFilter,
  CustomersGlobalFilter,
  OrderGlobalFilter,
  ContactsGlobalFilter,
  CompaniesGlobalFilter,
  LeadsGlobalFilter,
  CryptoOrdersGlobalFilter,
  InvoiceListGlobalSearch,
  TicketsListGlobalFilter,
  NFTRankingGlobalFilter,
  TaskListGlobalFilter,
} from "../../Components/Common/GlobalSearchFilter";
import CallBoxWidget from "../../Components/Common/CallBoxWidget";
import { Link, useLocation } from "react-router-dom";
// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isCustomerFilter,
  isOrderFilter,
  isContactsFilter,
  isCompaniesFilter,
  isCryptoOrdersFilter,
  isInvoiceListFilter,
  isTicketsListFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  isProductsFilter,
  isLeadsFilter,
  SearchPlaceholder,
  isCallBoxEnabled,
  onChangeFunction,
  collectionName,
  collection,
  add,
  data,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    onChangeFunction(1, value, "displayName");
    setGlobalFilter(value || undefined);
  }, 200);

  const location = useLocation();

  return (
    <React.Fragment>
      <CardBody className="border border-dashed border-end-0 border-start-0">
        <form>
          <Row className="g-3">
            <Col className="d-flex justify-content-between">
              <div
                className={
                  isProductsFilter || isContactsFilter || isCompaniesFilter || isNFTRankingFilter
                    ? "search-box me-2 mb-2 d-inline-block"
                    : "search-box me-2 mb-2 d-inline-block col-7"
                }
              >
                <input
                  onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                  }}
                  id="search-bar-0"
                  type="text"
                  className="form-control search /"
                  placeholder={SearchPlaceholder}
                  value={value || ""}
                />
                <i className="bx bx-search-alt search-icon"></i>
              </div>
              <div>
                {location.pathname == "/apps-academy-courses" && (
                  <Link to="/apps-new-academy-add-course">
                    <Button className="col-12">Add Course</Button>
                  </Link>
                )}

                {add && (
                  <Link to={`/data/add?collectionName=${collectionName}&collection=${collection}`}>
                    <Button className="col-12">Add {collectionName}</Button>
                  </Link>
                )}
              </div>
            </Col>
            {isProductsFilter && <ProductsGlobalFilter />}
            {isCustomerFilter && <CustomersGlobalFilter />}
            {isOrderFilter && <OrderGlobalFilter />}
            {isContactsFilter && <ContactsGlobalFilter />}
            {isCompaniesFilter && <CompaniesGlobalFilter />}
            {isLeadsFilter && <LeadsGlobalFilter />}
            {isCryptoOrdersFilter && <CryptoOrdersGlobalFilter />}
            {isInvoiceListFilter && <InvoiceListGlobalSearch />}
            {isTicketsListFilter && <TicketsListGlobalFilter />}
            {isNFTRankingFilter && <NFTRankingGlobalFilter />}
            {isTaskListFilter && <TaskListGlobalFilter />}
            {isCallBoxEnabled && <CallBoxWidget />}
          </Row>
        </form>
      </CardBody>
    </React.Fragment>
  );
}

const TableContainer = ({
  columns,
  data,
  name,
  totalPages,
  onChangeFunction,
  isGlobalSearch,
  isGlobalFilter,
  isProductsFilter,
  isCustomerFilter,
  isOrderFilter,
  isContactsFilter,
  isCompaniesFilter,
  isLeadsFilter,
  isCryptoOrdersFilter,
  isInvoiceListFilter,
  isTicketsListFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
  isCallBoxEnabled,
  collectionName,
  collection,
  add,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      manualPagination: true,
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        selectedRowIds: 0,
        // sortBy: [
        //   {
        //     desc: false,
        //   },
        // ],
      },
    },
    useGlobalFilter,
    useFilters,
    // useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
  );
  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " " : "") : "";
  };
  const [page, setPage] = React.useState(1);

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };
  const onChangeInInput = (event) => {
    const page = Number(event.target.value);
    if (page > 0 && page <= totalPages) {
      console.log("yes", page, totalPages);
      setPage(page);
      onChangeFunction(page);
    }
  };
  const location = useLocation();

  let isPageVisible = location.pathname !== "/apps-crm-leads" && location.pathname !== "/apps-projects-overview";

  return (
    <Fragment>
      <Row className="mb-3">
        {isGlobalSearch && (
          <Col md={1}>
            <select className="form-select" value={pageSize} onChange={onChangeInSelect}>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        )}
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            // globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            isProductsFilter={isProductsFilter}
            isCustomerFilter={isCustomerFilter}
            isOrderFilter={isOrderFilter}
            isContactsFilter={isContactsFilter}
            onChangeFunction={onChangeFunction}
            isCompaniesFilter={isCompaniesFilter}
            isLeadsFilter={isLeadsFilter}
            isCryptoOrdersFilter={isCryptoOrdersFilter}
            isInvoiceListFilter={isInvoiceListFilter}
            isTicketsListFilter={isTicketsListFilter}
            isNFTRankingFilter={isNFTRankingFilter}
            isTaskListFilter={isTaskListFilter}
            SearchPlaceholder={SearchPlaceholder}
            isCallBoxEnabled={isCallBoxEnabled}
            collectionName={collectionName}
            collection={collection}
            add={add}
            data={data}
          />
        )}
        {isAddOptions && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button type="button" color="success" className="btn-rounded  mb-2 me-2" onClick={handleOrderClicks}>
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {isAddUserList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button type="button" color="primary" className="btn mb-2 me-2" onClick={handleUserClick}>
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button type="button" color="success" className="btn-rounded mb-2 me-2" onClick={handleCustomerClick}>
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </Row>

      {data.length > 0 ? (
        <div className={divClass}>
          <Table hover {...getTableProps()} className={tableClass}>
            <thead className={theadClass}>
              {headerGroups.map((headerGroup) => (
                <tr className={trClass} key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.id}
                      className={thClass}
                      // {...column.getSortByToggleProps()}
                    >
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                      {/* <Filter column={column} /> */}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell) => {
                        return (
                          <td key={cell.id} {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="py-4 text-center">
          <div>
            <lord-icon
              src="https://cdn.lordicon.com/msoeawqm.json"
              trigger="loop"
              colors="primary:#405189,secondary:#0ab39c"
              style={{ width: "72px", height: "72px" }}
            ></lord-icon>
          </div>
          <div className="mt-4">
            <h5>Sorry! No Result Found</h5>
          </div>
        </div>
      )}

      {data.length > 0 && isPageVisible && (
        <Row className="justify-content-md-end justify-content-center align-items-center p-2">
          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={() => {
                  setPage(page - 1);
                  onChangeFunction(page - 1);
                }}
                // disabled={!canPreviousPage}
              >
                Previous
              </Button>
            </div>
          </Col>
          <Col className="col-md-auto d-none d-md-block">
            Page{" "}
            <strong>
              {page} of {totalPages}
            </strong>
          </Col>
          <Col className="col-md-auto">
            <Input
              type="number"
              min={1}
              style={{ width: 70 }}
              max={totalPages}
              defaultValue={page}
              onChange={onChangeInInput}
            />
          </Col>

          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={() => {
                  setPage(page + 1);
                  onChangeFunction(page + 1);
                }}
                //  disabled={!canNextPage}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
