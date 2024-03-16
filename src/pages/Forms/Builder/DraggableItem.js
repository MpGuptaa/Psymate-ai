import { ListGroupItem } from "reactstrap";
import { generateRandomId, inputValueChange } from "../../../helpers/Helper";
import Tools from "./Tools";
import axios from "axios";
import { toast } from "react-toastify";

const DraggableItem = ({ id, callback, parentId, setData, data }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", ""); // Set data to enable dragging in some browsers
  };

  const handleDragEnd = () => {
    const newData = [...data];
    // const draggedItem = newData.splice(0, 1)[0];

    // Create a new item object based on the dragged item
    // const newItem = { ...draggedItem, id: generateRandomId("number", 3) };
    const idNumber = generateRandomId("number", 10);
    const newItem = {
      label: "",
      type: id,
      width: "",
      tag: "",
      items: "",
      element: id,
      options: "",
      name: "",
      required: false,
      colCssClasses: "",
      description: "",
      disabled: false,
      title: "",
      placeholder: "",
      id: idNumber,
    };
    if (id === "number") newItem.max = "";
    if (id === "number" || id === "text") {
      newItem.readOnly = false;
      newItem.icon = "";
      newItem.rounded = false;
      newItem.size = "";
    }
    if (id === "select" || id === "api" || id === "basicSelect") {
      newItem.rounded = false;
      newItem.size = "";
      newItem.variants = "";
    }
    if (id === "checkbox") {
      newItem.size = "";
      newItem.color = "";
    }
    if (id === "picker") {
      newItem.enableTime = true;
      newItem.noCalendar = false;
      newItem.dateFormat = "H:i";
      newItem.time_24hr = true;
      newItem.mode = "";
      newItem.weekNumbers = false;
    }
    if (id === "range") {
      newItem.min = "";
      newItem.max = "";
    }
    if (id === "multiple") {
      newItem.multipleFields = "";
    }
    //
    // Append the new item to the end of the list
    newData.push(newItem);
    axios
      .post("/api/tools/inputs", {
        _id: parentId,
        item: newItem,
      })
      .then((res) => {
        toast.success("Added");
        callback(parentId);
      });
    setData(newData);
  };

  return (
    <ListGroupItem
      className="nested-2"
      draggable
      title="Drag this item and drop it in the add items list to add this element"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mt-3">
        <Tools
          inputValueChange={inputValueChange}
          inputs={[
            {
              element: id,
              items: "option,true,false",
              label: id?.toString()?.toUpperCase(),
              name: id?.toString()?.toLowerCase(),
            },
          ]}
        />
      </div>
    </ListGroupItem>
  );
};
export default DraggableItem;
