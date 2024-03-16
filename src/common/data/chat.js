// import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar10 from "../../assets/images/users/avatar-10.jpg";

import userImage from "../../assets/images/users/multi-user.jpg";

const direactContact = [
  {
    id: 1,
    roomId: 1,
    status: "offline",
    name: "Lisa Parker",
    image: avatar2,
    number: "+(256) 2451 8974",
    email: "lisaparker@gmail.com",
    location: "California, USA",
  },
  {
    id: 2,
    roomId: 2,
    status: "offline",
    name: "Frank Thomas",
    image: avatar3,
    number: "+(256) 2451 8974",
    email: "lisaparker@gmail.com",
    location: "California, USA",
    badge: 8,
  },
  {
    id: 3,
    roomId: 3,
    status: "offline",
    name: "Clifford Taylor",
    bgColor: "danger",
    number: "+(256) 2451 8974",
    email: "lisaparker@gmail.com",
    location: "California, USA",
  },
  {
    id: 4,
    roomId: 4,
    status: "offline",
    name: "Janette Caster",
    image: avatar4,
    number: "+(256) 2451 8974",
    email: "lisaparker@gmail.com",
    location: "California, USA",
  },
  {
    id: 5,
    roomId: 5,
    status: "offline",
    name: "Sarah Beattie",
    image: avatar5,
    number: "+(256) 2451 8974",
    email: "lisaparker@gmail.com",
    location: "California, USA",
    badge: 5,
  },
  {
    id: 6,
    roomId: 6,
    status: "offline",
    name: "Nellie Cornett",
    image: avatar6,
    number: "+(256) 2451 8974",
    email: "lisaparker@gmail.com",
    location: "California, USA",
    badge: 2,
  },
  {
    id: 7,
    roomId: 7,
    status: "offline",
    name: "Chris Kiernan",
    bgColor: "warning",
    number: "+(256) 2451 8974",
    email: "lisaparker@gmail.com",
    location: "California, USA",
  },
  {
    id: 8,
    roomId: 8,
    status: "offline",
    name: "Edith Evans",
    bgColor: "info",
    number: "+(256) 2451 8974",
    email: "lisaparker@gmail.com",
    location: "California, USA",
  },
  {
    id: 9,
    roomId: 9,
    status: "offline",
    name: "Joseph Siegel",
    image: avatar7,
    number: "+(256) 2451 8974",
    email: "lisaparker@gmail.com",
    location: "California, USA",
  },
];

const channelsList = [
  {
    id: 1,
    name: "Landing Design",
    unReadMessage: 7,
    image: userImage,
  },
  {
    id: 2,
    name: "General",
    image: userImage,
  },
  {
    id: 3,
    name: "Project Tasks",
    unReadMessage: 3,
    image: userImage,
  },
  {
    id: 4,
    name: "Meeting",
    image: userImage,
  },
  {
    id: 5,
    name: "Reporting",
    image: userImage,
  },
];

const messages = [];

const attachements = [
  {
    id: 1,
    foldericon: "ri-folder-zip-line",
    foldername: "App pages.zip",
    foldersize: "2.2MB",
  },
  {
    id: 2,
    foldericon: "ri-file-ppt-2-line",
    foldername: "Psymate admin.ppt",
    foldersize: "2.4MB",
  },
  {
    id: 3,
    foldericon: "ri-folder-zip-line",
    foldername: "Images.zip",
    foldersize: "1.2MB",
  },
  {
    id: 4,
    foldericon: "ri-image-2-line",
    foldername: "bg-pattern.png",
    foldersize: "1.1MB",
  },
];

const chatContactData = [
  {
    title: "A",
    contacts: [
      {
        id: 1,
        name: "Alice Cruickshank",
        status: "offline",
        roomId: 5,
      },
    ],
  },
  {
    title: "B",
    contacts: [
      {
        id: 1,
        name: "Barrett Brown",
        status: "offline",
        roomId: 1,
        image: avatar4,
      },
    ],
  },
  {
    title: "C",
    contacts: [
      {
        id: 1,
        name: "Chris Kiernan",
        status: "offline",
        roomId: 3,
      },
      {
        id: 2,
        name: "Clifford Taylor",
        status: "offline",
        roomId: 4,
      },
    ],
  },
  {
    title: "E",
    contacts: [
      {
        id: 1,
        name: "Edith Evans",
        status: "offline",
        roomId: 5,
      },
    ],
  },
  {
    title: "F",
    contacts: [
      {
        id: 1,
        name: "Frank Thomas",
        status: "offline",
        roomId: 6,
        image: avatar3,
      },
    ],
  },
  {
    title: "G",
    contacts: [
      {
        id: 1,
        name: "Gilbert Beer",
        status: "offline",
        roomId: 7,
      },
    ],
  },
  {
    title: "J",
    contacts: [
      {
        id: 1,
        name: "Janette Caster",
        status: "offline",
        roomId: 8,
        image: avatar4,
      },
      {
        id: 2,
        name: "Joseph Siegel",
        status: "offline",
        roomId: 9,
        image: avatar7,
      },
      {
        id: 3,
        name: "Justyn Wisoky",
        status: "offline",
        roomId: 2,
        image: avatar1,
      },
    ],
  },
  {
    title: "K",
    contacts: [
      {
        id: 1,
        name: "Keaton King",
        status: "offline",
        roomId: 11,
        image: avatar5,
      },
    ],
  },
  {
    title: "L",
    contacts: [
      {
        id: 1,
        name: "Lisa Parker",
        status: "offline",
        roomId: 1,
        image: avatar2,
      },
    ],
  },
  {
    title: "M",
    contacts: [
      {
        id: 1,
        name: "Marian Moen",
        status: "offline",
        roomId: 3,
      },
    ],
  },
  {
    title: "N",
    contacts: [
      {
        id: 1,
        name: "Nellie Cornett",
        status: "offline",
        roomId: 4,
        image: avatar6,
      },
    ],
  },
  {
    title: "R",
    contacts: [
      {
        id: 1,
        name: "Ronald Downey",
        status: "offline",
        roomId: 5,
      },
    ],
  },
  {
    title: "S",
    contacts: [
      {
        id: 1,
        name: "Sarah Beattie",
        status: "offline",
        roomId: 6,
        image: avatar5,
      },
    ],
  },
  {
    title: "V",
    contacts: [
      {
        id: 1,
        name: "Victor Beahan",
        status: "offline",
        roomId: 7,
        image: avatar10,
      },
    ],
  },
  {
    title: "W",
    contacts: [
      {
        id: 1,
        name: "Wayne Runte",
        status: "offline",
        roomId: 8,
        image: avatar2,
      },
    ],
  },
];

export {
  direactContact,
  channelsList,
  messages,
  attachements,
  chatContactData,
};
