import { Fragment, useEffect, useState, useMemo, useRef, forwardRef } from "react";

import { useTable, usePagination, useRowSelect, useGlobalFilter, useAsyncDebounce } from "react-table";

import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

import searchIcon from "../../assets/images/icons/search.svg";
// import Select from "react-select";

import { ToastContainer, toast } from "react-toastify";

import imgProfile from "../../assets/images/add_image.png";

const MyRecipes = () => {
  const token = localStorage.getItem("token");

  const [productSeller, setProductSeller] = useState([]);

  const [updateProductSeller, setUpdateProductSeller] = useState([]);

  const [dataCategory, setDataCategory] = useState([]);

  const [showListProduct, setShowListProduct] = useState(true);

  const [conditionNew, setConditionNew] = useState();
  const [conditionUsed, setConditionUsed] = useState();

  const [statusEnable, setStatusEnable] = useState();
  const [statusDisable, setStatusDisable] = useState();

  const [showModalDeleteSelected, setShowModalDeleteSelected] = useState(false);
  const handleCloseModalDeleteSelected = () => setShowModalDeleteSelected(false);
  const handleShowModalDeleteSelected = () => setShowModalDeleteSelected(true);

  const [showModalDelete, setShowModalDelete] = useState(false);
  const handleCloseModalDelete = () => setShowModalDelete(false);
  const handleShowModalDelete = () => setShowModalDelete(true);

  const [preview, setPreview] = useState();

  const [newPhoto, setNewPhoto] = useState(null);

  const [tags, setTags] = useState();

  const [diplayButton, setDisplayButton] = useState(true);

  const options = dataCategory;

  // console.log(tags)

  const handleDisplay = () => {
    setDisplayButton(!diplayButton);
  };

  const dataTable = productSeller;

  // Define a default UI for filtering
  function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
    const [value, setValue] = useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined);
    }, 200);

    return (
      <Fragment>
        <div className="col-12 d-flex justify-content-between">
          <div className="col-10 d-flex border border-1 rounded-pill ">
            <input
              className="form-control rounded-pill border-0 "
              value={value || ""}
              onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              placeholder={`Search Product`}
              style={{
                fontSize: "1.1rem",
                border: "0",
              }}
            ></input>

            <img className="ico-search" src={searchIcon} alt="" />
          </div>

          <div className="col-2" style={{ display: dataCheckList.length === 0 ? "none" : "block" }}>
            <button className="btn btn-danger mx-3 rounded-pill" onClick={handleShowModalDeleteSelected}>
              Delete
            </button>
            <Modal show={showModalDeleteSelected} onHide={handleCloseModalDeleteSelected} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>Delete</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are sure want to delete selected product ?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalDeleteSelected}>
                  Close
                </Button>
                <Button variant="danger" onClick={handleDeleteSelected}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </Fragment>
    );
  }

  const columns = useMemo(
    () => [
      {
        Header: "Recipes Name",
        accessor: "name",
        Cell: (item) => {
          return (
            <Fragment>
              {/* <img className="img-thumbnails" crossOrigin="anonymous" src={item.row.original.photo} alt="" /> */}
              <h6 className="text-dark fw-bold title-product-table ">{item.row.original.name}</h6>
            </Fragment>
          );
        },
        // accessor is the "key" in the data
      },
      {
        Header: "Stock",
        accessor: "stock",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: (item) => {
          return <div>$ {item.row.original.price}</div>;
        },
      },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: (item) => {
          return (
            <div>
              <img className="img-thumbnails" crossOrigin="anonymous" src={item.row.original.photo} alt="" />
            </div>
          );
        },
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (item) => {
          return (
            <div className="d-flex justify-content-center">
              <button
                className="btn btn btn-danger rounded-pill"
                onClick={(e) => {
                  const getDetailProduct = async () => {
                    await axios
                      .get(process.env.REACT_APP_API_BACKEND + "product/" + item.row.original.id)
                      .then((res) => {
                        setUpdateProductSeller(res.data.data[0]);

                        setTags(res.data.data[0].category_id);

                        setConditionNew(res.data.data[0].condition.toString() === "new" ? true : false);
                        setConditionUsed(res.data.data[0].condition.toString() === "used" ? true : false);

                        setStatusEnable(res.data.data[0].status.toString() === "enable" ? true : false);
                        setStatusDisable(res.data.data[0].status.toString() === "disable" ? true : false);

                        // setPreview(URL.createObjectURL(res.data.data[0].photo.toString()));

                        // console.log(res.data.data[0].condition.toString())
                        // console.log(tags)
                        // console.log(updateProductSeller.status)
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  };

                  getDetailProduct();
                  // console.log(item.row.original.id)
                  setShowListProduct(false);
                }}
                // style={{ marginRight: "10px" }}
              >
                {"Detail"}
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} onChange={(e) => handleDisplay} checked={diplayButton} {...rest} />
      </>
    );
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { globalFilter },
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: dataTable,
    },

    useGlobalFilter,
    usePagination,
    useRowSelect, // useGlobalFilter!
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "id",

          Header: ({ getToggleAllPageRowsSelectedProps, row }) => (
            <div>
              <IndeterminateCheckbox
                {...getToggleAllPageRowsSelectedProps({
                  // onChange: () => {
                  //    const selected = row.isSelected; // get selected status of current row.
                  //    toggleAllRowsSelected(false); // deselect all.
                  //    row.toggleRowSelected(!selected); // reverse selected status of current row.
                  //    console.log(row.original.id)
                  //  }
                })}
              />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps({
                  //  onChange: (e) => {
                  // const selected = row.isSelected; // get selected status of current row.
                  //   // toggleAllRowsSelected(false); // deselect all.
                  // row.toggleRowSelected(!selected); // reverse selected status of current row.
                  // console.log(row.original.id)
                  // selected ? console.log("unchek") : console.log("check")
                  // },
                })}
              />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const dataCheckList = selectedFlatRows.map((d) => `'${d.original.id}'`);
  // console.log(dataCheckList.toString());
  // dataCheckList.length === 0 ? console.log("kosong") : console.log("ada isi");

  const handleDeleteSelected = () => {
    const handleDeleteSelect = async () => {
      await axios
        .delete(process.env.REACT_APP_API_BACKEND + "product/selected/" + dataCheckList, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // alert("delete success");
          toast.success("Delete Selected Success", { autoClose: 2500 });
          setShowModalDeleteSelected(false);
          // getAllProduct();
        })
        .catch((err) => {
          // alert("delete failed");
          toast.success(err, { autoClose: 2500 });
          setShowModalDeleteSelected(false);
        });
    };
    handleDeleteSelect();
  };

  const handleDelete = () => {
    const handleDeleted = async () => {
      await axios
        .delete(process.env.REACT_APP_API_BACKEND + "product/" + updateProductSeller.id, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // alert("delete success");
          toast.success("Delete Selected Success", { autoClose: 2500 });
          setShowModalDelete(false);
          // getAllProduct();
        })
        .catch((err) => {
          // alert("delete failed");
          toast.success(err, { autoClose: 2500 });
          setShowModalDelete(false);
        });
    };
    handleDeleted();
  };

  return (
    <Fragment>
      <div className="my-recipes-page">
        <div className="container vh-100">
          <Table responsive striped bordered hover {...getTableProps()}>
            <thead>
              <tr>
                <th colSpan={visibleColumns.length}>
                  <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                </th>
              </tr>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {/* </table> */}

          <div className=" d-xl-flex d-lg-flex d-md-grid d-sm-grid pagination ">
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 d-flex justify-content-between align-items-center my-2">
              <button className="btn btn-danger rounded-pill" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {"<<"}
              </button>{" "}
              <button className="btn btn-danger rounded-pill px-3" onClick={() => previousPage()} disabled={!canPreviousPage}>
                {"<"}
              </button>{" "}
              <button className="btn btn-danger rounded-pill px-3" onClick={() => nextPage()} disabled={!canNextPage}>
                {">"}
              </button>{" "}
              <button className="btn btn-danger rounded-pill" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {">>"}
              </button>{" "}
            </div>
            <div className="col-xl-1 col-lg-1"></div>
            <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 d-flex justify-content-between align-items-center my-2">
              <span>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{" "}
              </span>
              <span>
                | Go to page:{" "}
                <input
                  type="number"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    gotoPage(page);
                  }}
                  style={{ width: "100px" }}
                />
              </span>{" "}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MyRecipes;