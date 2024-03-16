import React, { ChangeEvent } from "react";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { Button } from "reactstrap";

const UploadCSVExportData = ({ state, setState, onSubmit }) => {
  const handleUploadCSV = (e) => {
    const stateFile = e.target.files && e.target.files[0];
    if (stateFile && stateFile.name.split(".").pop() === "csv") {
      Papa.parse(stateFile, {
        header: true,
        download: true,
        skipEmptyLines: true,
        complete: validateCsv,
      });
    } else {
      toast.error(`Please Upload a valid document`);
    }
  };

  const validateCsv = (result) => {
    const isValid = validateRawCsv(result);
    toast.success(`CSV IS VALID`);
    if (isValid.status) {
      setState(isValid.validatedJson);
    } else {
      toast.error(`Please Upload a valid document`);
    }
  };

  const validateRawCsv = (csvData) => {
    let titlesError = false;
    let columnsNotFound = [];
    const fields = csvData.meta.fields.map((v) =>
      v.toString().replace(/ /g, "_")
    );
    if (titlesError) {
      return {
        status: false,
        message: `Invalid Csv : Column(s) not found (${columnsNotFound.join(
          ","
        )})`,
      };
    } else {
      let validatedJson = [];
      for (let csvindex = 0; csvindex < csvData.data.length; csvindex++) {
        const newelement = csvData.data[csvindex];
        for (var i in newelement) {
          newelement[i.toString().replace(/ /g, "_")] = newelement[i];
          if (i !== i.toString().replace(/ /g, "_")) {
            delete newelement[i];
          }
        }
        let allFieldsEmpty = false;
        if (!allFieldsEmpty) {
          validatedJson.push(newelement);
        }
      }
      return {
        status: true,
        message: "Valid Csv",
        validatedJson: validatedJson,
      };
    }
  };

  const keys = state.length !== 0 && Object.keys(state[0]);
  const headCells =
    keys &&
    keys.map((i, key) => {
      let element;
      for (let index = 0; index < keys.length; index++) {
        element = {
          id: key,
          label: i.toString().replace(/ /g, "_"),
        };
      }
      return element;
    });

  return (
    <form className="d-flex h-8 w-25">
      <Button>
        <input
          required
          id="upload_csv"
          type="file"
          accept=".csv"
          onChange={handleUploadCSV}
          placeholder="Upload CSV"
        />
      </Button>
      {state.length > 0 && (
        <Button
          color="success"
          onClick={(e) => {
            e.preventDefault();
            onSubmit && onSubmit();
          }}
        >
          Upload
        </Button>
      )}
    </form>
  );
};

export default UploadCSVExportData;
