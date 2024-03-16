import React, { useState } from "react";
import Papa from "papaparse";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../config";
import { Button } from "reactstrap";

const UploadCSV = ({ id }) => {
  const [books, setbooks] = useState([]);
  const [state, setState] = useState([]);
  const handleUploadCSV = (e) => {
    e.preventDefault();
    const books = e.target.files[0];
    if (books.name.split(".").pop() === "csv") {
      Papa.parse(books, {
        header: true,
        download: true,
        skipEmptyLines: true,
        complete: validateCsv.bind(this),
      });
    }
  };

  const validateCsv = (result) => {
    let isValid = validateRawCsv(result);
    if (isValid.status) {
      setbooks(isValid.validatedJson);
    }
    //   else {
    //   setLoading(false);
    //   addToast(isValid.message, { appearance: "error" });
    // }
  };

  const resolveAfter20Sec = new Promise((resolve) =>
    setTimeout(resolve, 20000)
  );
  const validateRawCsv = (csvData) => {
    let titlesError = false;
    let columnsNotFound = [];
    if (titlesError) {
      return {
        status: false,
        message: `Invalid Csv : Column(s) not found (${columnsNotFound.join(
          ","
        )})`,
      };
    } else {
      // processing csv data
      let validatedJson = [];
      for (let csvindex = 0; csvindex < csvData.data.length; csvindex++) {
        const newelement = csvData.data[csvindex];
        // converting all csv column names to lower case
        for (var i in newelement) {
          newelement[i.toString().replace(/ /g, "_").toLowerCase()] =
            newelement[i];
          if (i !== i.toString().replace(/ /g, "_").toLowerCase()) {
            delete newelement[i];
          }
        }
        // removing rows having all fields empty
        let allFieldsEmpty = false;

        if (!allFieldsEmpty) {
          validatedJson.push(newelement);
        }
      }
      //   console.log(validatedJson);
      return {
        status: true,
        message: "Valid Csv",
        validatedJson: validatedJson,
      };
    }
  };
  // const keys = books.length !== 0 && Object.keys(books[0]);
  // const headCells =
  //   keys &&
  //   keys?.map((i, key) => {
  //     let element;
  //     for (let index = 0; index < keys.length; index++) {
  //       element = {
  //         id: key,
  //         label: i.toString().replace(/ /g, "_"),
  //       };
  //     }
  //     return element;
  //   });
  // const height = Object.keys(state);

  return (
    <form className="flex flex-row border pr-3 rounded-lg self-center mt-3 justify-between items-center">
      <input
        required
        id="upload_csv"
        type="file"
        accept=".csv"
        className="inline-flex justify-center mr-3 h-fit rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        onChange={handleUploadCSV}
        placeholder="Upload CSV"
      />
      <Button
        className="py-1 px-2 text-sm font-medium text-white focus:outline-none bg-green-500 rounded-lg border border-gray-200 hover:bg-black hover:text-green-500 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700     dark:hover:bg-gray-700"
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          toast.promise(resolveAfter20Sec, {
            pending: "Uploading...",
            success: "Upload Completed",
            error: "Upload Error",
          });
          books.map((book) => {
            axios
              .post(`${config.api.API_URL}/data/${id}`, book)
              .then((res) => {
                console.log(`${id} Data`, res.data);
              })
              .catch((err) => {
                console.log(`${id} Error`, err);
              });
          });
          // books.map((i) => {
          //   axiosinstance
          //     .post(`${API_BASE_URL}/${id}`, { data: i })
          //     .then((res) => {
          //       console.log(`${id} Data`, res.data);
          //       // getData();
          //     })
          //     .catch((err) => {
          //       console.log(`${id} Error`, err);
          //     });
          // });

          // setbooks([]);
        }}
      >
        Upload
      </Button>
    </form>
  );
};

export default UploadCSV;
