import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isApps, setIsApps] = useState(false);
  const [Communication, setCommunication] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isBaseUi, setIsBaseUi] = useState(false);
  const [isAdvanceUi, setIsAdvanceUi] = useState(false);
  const [isForms, setIsForms] = useState(false);
  const [isTables, setIsTables] = useState(false);
  const [isCharts, setIsCharts] = useState(false);
  const [isIcons, setIsIcons] = useState(false);
  const [isMaps, setIsMaps] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);
  const [isAcademy, setIsAcademy] = useState(false);

  // Apps
  const [isEmail, setEmail] = useState(false);
  const [isSubEmail, setSubEmail] = useState(false);
  const [isEcommerce, setIsEcommerce] = useState(false);
  const [isProjects, setIsProjects] = useState(false);
  const [isTasks, setIsTasks] = useState(false);
  const [isCRM, setIsCRM] = useState(false);
  const [isCrypto, setIsCrypto] = useState(false);
  const [isInvoices, setIsInvoices] = useState(false);
  const [isSupportTickets, setIsSupportTickets] = useState(false);
  const [isNFTMarketplace, setIsNFTMarketplace] = useState(false);
  const [isJobs, setIsJobs] = useState(false);
  const [isJobList, setIsJobList] = useState(false);
  const [isCandidateList, setIsCandidateList] = useState(false);
  const [isTools, setIsTools] = useState(false);
  const [isSideApps, setIsSideApps] = useState(false);

  // Authentication
  const [isSignIn, setIsSignIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isPasswordCreate, setIsPasswordCreate] = useState(false);
  const [isLockScreen, setIsLockScreen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [isError, setIsError] = useState(false);

  // Pages
  const [isProfile, setIsProfile] = useState(false);
  const [isLanding, setIsLanding] = useState(false);

  // Charts
  const [isApex, setIsApex] = useState(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id)) document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Apps") {
      setIsApps(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "Pages") {
      setIsPages(false);
    }
    if (iscurrentState !== "BaseUi") {
      setIsBaseUi(false);
    }
    if (iscurrentState !== "AdvanceUi") {
      setIsAdvanceUi(false);
    }
    if (iscurrentState !== "Forms") {
      setIsForms(false);
    }
    if (iscurrentState !== "Tables") {
      setIsTables(false);
    }
    if (iscurrentState !== "Charts") {
      setIsCharts(false);
    }
    if (iscurrentState !== "Icons") {
      setIsIcons(false);
    }
    if (iscurrentState !== "Maps") {
      setIsMaps(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState !== "Landing") {
      setIsLanding(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isAuth,
    isPages,
    isBaseUi,
    isAdvanceUi,
    isForms,
    isTables,
    isCharts,
    isIcons,
    isMaps,
    isMultiLevel,
  ]);
  const user = JSON.parse(sessionStorage.getItem("authUser"));

  const menuItems = [
    // {
    //   label: "Menu",
    //   isHeader: true,
    // },
    {
      id: "crm",
      label: "CRM",
      icon: "las la-atom",
      role: ["superAdmin", "crm", "leads", "users", "dashboard", "addUser"],
      link: "/#",
      isChildItem: true,
      click: function (e) {
        e.preventDefault();
        setIsCRM(!isCRM);
      },
      stateVariables: isCRM,
      subItems: [
        {
          id: 1,
          label: "Leads",
          icon: "las la-atom",
          link: "/apps-crm-leads",
          role: ["superAdmin", "leads"],
          parentId: "crm",
        },
        {
          id: 2,
          label: "Users",
          icon: "las la-id-card-alt",
          link: "/pages-team",
          role: ["superAdmin", "users"],
          parentId: "crm",
        },
        {
          id: 3,
          label: "Dashboard",
          icon: "las la-id-card-alt",
          link: "/#",
          role: ["superAdmin", "dashboard"],
          parentId: "crm",
        },
        {
          id: 4,
          label: "Clinic-Dashboard",
          icon: "las la-id-card-alt",
          link: "/dashboard-clinic",
          role: ["superAdmin", "dashboard"],
          parentId: "crm",
        },
        {
          id: 5,
          label: "Add User",
          icon: "las la-id-card-alt",
          link: `/layout/tabs/top?id=${user._id}&formId=65bf466b28261e8891c8b813`,
          role: ["superAdmin", "addUser"],
          parentId: "crm",
        },
      ],
    },

    {
      id: "calender",
      label: "Calender",
      icon: "las la-calendar",
      link: "/apps-calendar",
      role: ["superAdmin", "calendar"],
      click: function (e) {
        e.preventDefault();
      },
    },
    // {
    //   id: "users",
    //   label: "Users",
    //   icon: "lar la-user-circle",
    //   link: "/pages-team",
    //   role: ["superAdmin", "users"],
    //   click: function (e) {
    //     e.preventDefault();
    //   },
    // },

    // {
    //   id: "lab",
    //   label: "Lab",
    //   icon: "las la-flask",
    //   link: "/#",
    //   role: ["superAdmin", "users"],
    //   click: function (e) {
    //     e.preventDefault();
    //   },
    // },
    {
      id: "appsecommerce",
      label: "Pharmacy",
      icon: "las la-pills",
      role: ["superAdmin", "products", "service", "orders", "addGenericMedicines", "viewOrderDetails", "assessments"],
      link: "/#",
      isChildItem: true,
      click: function (e) {
        e.preventDefault();
        setIsEcommerce(!isEcommerce);
      },
      stateVariables: isEcommerce,
      subItems: [
        {
          id: 1,
          label: "Assessments",
          link: "/apps-lab-assessments",
          parentId: "appsecommerce",
          role: ["superAdmin", "viewAssessments"],
        },
        {
          id: 1,
          label: "Products",
          link: "/apps-ecommerce-products",
          parentId: "appsecommerce",
          role: ["superAdmin", "viewProducts"],
        },
        {
          id: 2,
          label: "Add Product",
          link: "/apps-ecommerce-add-product",
          role: ["superAdmin", "addProduct"],
          parentId: "appsecommerce",
        },
        {
          id: 1,
          label: "Salts",
          link: "/apps-ecommerce-salts",
          parentId: "appsecommerce",
          role: ["superAdmin", "viewSalt"],
        },
        {
          id: 3,
          label: "Add Salt",
          link: "/apps-ecommerce-add-salt",
          parentId: "appsecommerce",
          role: ["superAdmin", "addSalt"],
        },
        {
          id: 11,
          label: "Generic Medicines",
          link: "/generic",
          role: ["superAdmin", "addGenericMedicines"],
          parentId: "appsecommerce",
        },
        // {
        //   id: 4,
        //   label: "Orders",
        //   link: "/apps-ecommerce-orders",
        //   role: ["superAdmin", "viewAllOrders"],
        //   parentId: "appsecommerce",
        // },
        // {
        //   id: 5,
        //   label: "Order Details",
        //   role: ["superAdmin", "viewOrderDetails"],
        //   link: "/apps-ecommerce-order-details",
        //   parentId: "appsecommerce",
        // },
        {
          id: 9,
          label: "Manufacturers",
          link: "/manufacturers",
          parentId: "appsecommerce",
          role: ["superAdmin", "manufacturers"],
        },
        // {
        //   id: 10,
        //   label: "Manufacturer Details",
        //   link: "/apps-ecommerce-manufacturer-details",
        //   parentId: "appsecommerce",
        //   role: ["superAdmin", "users"],
        // },
      ],
    },
    {
      id: "financials",
      label: "Financials",
      role: ["superAdmin", "financials", "financialsList", "financialDetails"],
      icon: "las la-rupee-sign",
      link: "/#",
      isChildItem: true,
      click: function (e) {
        e.preventDefault();
        setIsInvoices(!isInvoices);
      },
      stateVariables: isInvoices,
      subItems: [
        {
          id: 1,
          parentId: "financials",
          label: "List View",
          role: ["superAdmin", "financialsList"],
          icon: "las la-rupee-sign",
          link: "/apps-invoices-list",
        },
        {
          id: 2,
          parentId: "financials",
          label: "Details",
          icon: "las la-rupee-sign",
          role: ["superAdmin", "financialDetails"],
          link: "/apps-invoices-details",
        },
      ],
    },
    {
      id: "times",
      label: "OutReach",
      role: ["superAdmin", "outreach", "times", "article", "blog", "video", "podcast"],
      icon: "las la-newspaper",
      link: "/#",
      isChildItem: true,
      click: function (e) {
        e.preventDefault();
        setIsSideApps(!isSideApps);
      },
      stateVariables: isSideApps,
      subItems: [
        {
          id: 1,
          parentId: "times",
          label: "Article",
          icon: "las la-rupee-sign",
          role: ["superAdmin", "article", "outreach"],
          link: "/data?collectionName=articles&collection=65bcd5f9cbe5218c9bfff532",
        },
        {
          id: 2,
          parentId: "times",
          label: "Blog",
          role: ["superAdmin", "blog", "outreach"],
          icon: "las la-rupee-sign",
          link: "/data?collectionName=blog&collection=65be1a4641782fe553b79389",
        },
        {
          id: 3,
          parentId: "times",
          label: "Videos",
          role: ["superAdmin", "video", "outreach"],
          icon: "las la-rupee-sign",
          link: "/data?collectionName=video&collection=65be24b941782fe553b79430",
        },
        {
          id: 4,
          parentId: "times",
          label: "Podcast",
          role: ["superAdmin", "podcast", "outreach"],
          icon: "las la-rupee-sign",
          link: "/data?collectionName=podcast&collection=65be2a3641782fe553b79493",
        },
      ],
    },
    {
      id: "apps",
      label: "Apps",
      role: ["superAdmin", "apps"],
      icon: "las la-box",
      link: "/#",
      isChildItem: true,
      click: function (e) {
        e.preventDefault();
        setIsSideApps(!isSideApps);
      },
      stateVariables: isSideApps,
      subItems: [
        // {
        //   id: 1,
        //   parentId: "apps",
        //   label: "Pharmacy",
        //   role: ["superAdmin", "pharmacy"],
        //   icon: "las la-rupee-sign",
        //   link: "/#",
        // },
        // {
        //   id: 2,
        //   parentId: "apps",
        //   label: "Academy",
        //   icon: "las la-rupee-sign",
        //   role: ["superAdmin", "academy"],
        //   link: "/#",
        // },
        {
          id: 3,
          parentId: "apps",
          label: "Studio",
          role: ["superAdmin", "studio"],
          icon: "las la-rupee-sign",
          link: "/#",
        },

        {
          id: 6,
          parentId: "apps",
          label: "Academy",
          role: ["superAdmin", "times"],
          icon: "las la-rupee-sign",
          link: "/data?collection=65dc35b040bbb7927620a401&collectionName=courses",
        },
      ],
    },
    {
      id: "admin",
      label: "Admin",
      icon: "las la-user",
      role: ["superAdmin", "admin", "formBuilder", "disorders"],
      link: "/#",
      isChildItem: true,
      click: function (e) {
        e.preventDefault();
        setIsAcademy(!isAcademy);
      },
      stateVariables: isAcademy,
      subItems: [
        {
          id: 1,
          label: "Team",
          link: "/pages-team-doc",
          role: ["superAdmin", "establishments"],
          parentId: "admin",
        },
        {
          id: 1,
          label: "Disorders",
          link: "/disorders",
          role: ["superAdmin", "disorders"],
          parentId: "admin",
        },
        {
          id: 2,
          label: "Establishments",
          link: "/establishments",
          role: ["superAdmin", "establishments"],
          parentId: "admin",
        },
        {
          id: 4,
          label: "Combo",
          role: ["superAdmin", "combo"],
          icon: "las la-rupee-sign",
          link: "/combo/create",
        },
        {
          id: 4,
          label: "Add Role",
          role: ["superAdmin", "roles-permissions"],
          icon: "las la-rupee-sign",
          link: "/data?collectionName=roles&collection=65be53b47f2e97f2008eb1cf",
        },
        {
          id: 5,
          label: "Product ",
          role: ["superAdmin", "product-services"],
          icon: "las la-rupee-sign",
          link: "/#",
        },
        {
          id: 5,
          label: "Services ",
          role: ["superAdmin", "product-services"],
          icon: "las la-rupee-sign",
          link: "/#",
        },
        {
          id: "6",
          label: "Form Builder",
          link: "/form-builder",
          role: ["superAdmin", "formBuilder"],
          click: function (e) {
            e.preventDefault();
          },
        },
        {
          id: 7,
          label: "Appointment Templates",
          icon: "las la-rupee-sign",
          role: ["superAdmin", "appointment-template"],
          link: "/data?collectionName=appointmenttemplates&collection=65be586e10ae77e91588fd29",
        },
        {
          id: 8,
          label: "Jobs",
          icon: "las la-rupee-sign",
          role: ["superAdmin", "jobs"],
          link: "/apps-job-lists",
        },
        {
          id: 9,
          label: "Project",
          icon: "las la-rupee-sign",
          role: ["superAdmin", "Project"],
          link: "/apps-projects-list",
        },
        {
          id: 10,
          label: "Exotel",
          icon: "las la-rupee-sign",
          role: ["superAdmin", "exotel"],
          link: "/exotel",
        },
      ],
    },
    // {
    //   id: "documents",
    //   label: "Documents",
    //   icon: "las la-file-alt",
    //   link: "/apps-file-manager",
    //   role: ["superAdmin", "documents"],
    //   click: function (e) {
    //     e.preventDefault();
    //   },
    // },

    // {
    //   id: "calender",
    //   label: "CRM",
    //   icon: "lar la-user-circle",
    //   link: "/apps-calendar",
    //   click: function (e) {
    //     e.preventDefault();
    //   },
    // },
    // {
    //   id: "apps",
    //   label: "Communications",
    //   icon: "lab la-delicious",
    //   role: [
    //     "superAdmin",
    //     "exotel",
    //     "disorders",
    //     "users",
    //     "prescriptionList",
    //     "prescriptionDetails",
    //     "prescriptionCreate",
    //     "formBuilder",
    //     "feeds",
    //   ],
    //   link: "/#",
    //   click: function (e) {
    //     e.preventDefault();
    //     setCommunication(!Communication);
    //     setIscurrentState("Apps");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: Communication,
    //   subItems: [
    //     {
    //       id: "exotelApps",
    //       label: "Exotel",
    //       link: "/exotel",
    //       role: ["superAdmin", "exotel"],
    //       click: function (e) {
    //         e.preventDefault();
    //       },
    //       parentId: "apps",
    //       stateVariables: isCRM,
    //     },
    //     {
    //       id: "exotelApps",
    //       label: "Disorders",
    //       role: ["superAdmin", "disorders"],
    //       link: "/disorders",
    //       click: function (e) {
    //         e.preventDefault();
    //       },
    //       parentId: "apps",
    //       stateVariables: isCRM,
    //     },
    //     {
    //       id: "users",
    //       icon: "lar la-user-circle",
    //       label: "Users",
    //       link: "/pages-team",
    //       role: ["superAdmin", "users"],
    //       parentId: "apps",
    //       click: function (e) {
    //         e.preventDefault();
    //         setEmail(!isEmail);
    //       },
    //       stateVariables: isEmail,
    //     },
    //     {
    //       id: "prescriptions",
    //       label: "Prescriptions",
    //       role: [
    //         "superAdmin",
    //         "prescriptionList",
    //         "prescriptionDetails",
    //         "prescriptionCreate",
    //       ],
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsInvoices(!isInvoices);
    //       },
    //       parentId: "apps",
    //       stateVariables: isInvoices,
    //       childItems: [
    //         {
    //           id: 1,
    //           label: "List View",
    //           link: "/apps-prescriptions-list",
    //           role: ["superAdmin", "prescriptionList"],
    //         },
    //         {
    //           id: 2,
    //           label: "Details",
    //           link: "/apps-prescriptions-details",
    //           role: ["superAdmin", "prescriptionDetails"],
    //         },
    //         {
    //           id: 3,
    //           label: "Create Prescription",
    //           link: "/apps-prescriptions-create",
    //           role: ["superAdmin", "prescriptionCreate"],
    //         },
    //       ],
    //     },

    //     {
    //       id: "feeds",
    //       label: "Manage Feeds",
    //       role: ["superAdmin", "feeds"],
    //       link: "/feeds",
    //       click: function (e) {
    //         e.preventDefault();
    //       },
    //       parentId: "apps",
    //     },
    //   ],
    // },

    // {
    //   id: "tools",
    //   label: "Tools",
    //   role: ["superAdmin", "tools"],
    //   icon: "las la-tools",
    //   link: "/#",
    //   isChildItem: true,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsTools(!isTools);
    //   },
    //   stateVariables: isTools,
    //   subItems: [
    //     {
    //       id: 1,
    //       parentId: "tools",
    //       label: "Calender",
    //       role: ["superAdmin", "calender"],
    //       icon: "las la-rupee-sign",
    //       link: "/#",
    //     },
    //   ],
    // },

    {
      id: "apps",
      label: "Apps",
      icon: "lab la-delicious",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
      subItems: [
        {
          id: "calendar",
          label: "Calendar",
          link: "/apps-calendar",
          parentId: "apps",
        },
        {
          id: "chat",
          label: "Chat",
          link: "/apps-chat",
          parentId: "apps",
        },
        {
          id: "mailbox",
          label: "Email",
          link: "/#",
          parentId: "apps",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setEmail(!isEmail);
          },
          stateVariables: isEmail,
          childItems: [
            {
              id: 1,
              label: "Mailbox",
              link: "/apps-mailbox",
              parentId: "apps",
            },
            {
              id: 2,
              label: "Email Templates",
              link: "/#",
              parentId: "apps",
              isChildItem: true,
              stateVariables: isSubEmail,
              click: function (e) {
                e.preventDefault();
                setSubEmail(!isSubEmail);
              },
              childItems: [
                {
                  id: 2,
                  label: "Basic Action",
                  link: "/apps-email-basic",
                  parentId: "apps",
                },
                {
                  id: 3,
                  label: "Ecommerce Action",
                  link: "/apps-email-ecommerce",
                  parentId: "apps",
                },
              ],
            },
          ],
        },
        {
          id: "appsecommerce",
          label: "Ecommerce",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsEcommerce(!isEcommerce);
          },
          parentId: "apps",
          stateVariables: isEcommerce,
          childItems: [
            {
              id: 1,
              label: "Products",
              link: "/apps-ecommerce-products",
              parentId: "apps",
            },
            // {
            //   id: 2,
            //   label: "Product Details",
            //   link: "/apps-ecommerce-product-details",
            //   parentId: "apps",
            // },
            {
              id: 2,
              label: "Add Salt",
              link: "/apps-ecommerce-add-salt",
              parentId: "apps",
            },
            {
              id: 3,
              label: "Add Product",
              link: "/apps-ecommerce-add-product",
              parentId: "apps",
            },

            {
              id: 4,
              label: "Orders",
              link: "/apps-ecommerce-orders",
              parentId: "apps",
            },
            {
              id: 5,
              label: "Order Details",
              link: "/apps-ecommerce-order-details",
              parentId: "apps",
            },
            {
              id: 6,
              label: "Customers",
              link: "/apps-ecommerce-customers",
              parentId: "apps",
            },
            {
              id: 7,
              label: "Shopping Cart",
              link: "/apps-ecommerce-cart",
              parentId: "apps",
            },
            {
              id: 8,
              label: "Checkout",
              link: "/apps-ecommerce-checkout",
              parentId: "apps",
            },
            {
              id: 9,
              label: "Manufacturers",
              link: "/manufacturers",
              parentId: "apps",
            },
            {
              id: 10,
              label: "Manufacturer Details",
              link: "/apps-ecommerce-manufacturer-details",
              parentId: "apps",
            },
          ],
        },
        {
          id: "appsprojects",
          label: "Projects",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsProjects(!isProjects);
          },
          parentId: "apps",
          stateVariables: isProjects,
          childItems: [
            {
              id: 1,
              label: "List",
              link: "/apps-projects-list",
              parentId: "apps",
            },
            {
              id: 2,
              label: "Overview",
              link: "/apps-projects-overview",
              parentId: "apps",
            },
            {
              id: 3,
              label: "Create Project",
              link: "/apps-projects-create",
              parentId: "apps",
            },
          ],
        },
        {
          id: "tasks",
          label: "Tasks",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsTasks(!isTasks);
          },
          parentId: "apps",
          stateVariables: isTasks,
          childItems: [
            {
              id: 1,
              label: "List View",
              link: "/apps-tasks-list-view",
              parentId: "apps",
            },
            {
              id: 2,
              label: "Task Details",
              link: "/apps-tasks-details",
              parentId: "apps",
            },
          ],
        },
        {
          id: "appscrm",
          label: "CRM",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsCRM(!isCRM);
          },
          parentId: "apps",
          stateVariables: isCRM,
          childItems: [
            { id: 1, label: "Contacts", link: "/apps-crm-contacts" },
            { id: 2, label: "Companies", link: "/apps-crm-companies" },
            { id: 3, label: "Deals", link: "/apps-crm-deals" },
            { id: 4, label: "Leads", link: "/apps-crm-leads" },
          ],
        },
        {
          id: "appscrypto",
          label: "Crypto",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsCrypto(!isCrypto);
          },
          parentId: "apps",
          stateVariables: isCrypto,
          childItems: [
            { id: 1, label: "Transactions", link: "/apps-crypto-transactions" },
            { id: 2, label: "Buy & Sell", link: "/apps-crypto-buy-sell" },
            { id: 3, label: "Orders", link: "/apps-crypto-orders" },
            { id: 4, label: "My Wallet", link: "/apps-crypto-wallet" },
            { id: 5, label: "ICO List", link: "/apps-crypto-ico" },
            { id: 6, label: "KYC Application", link: "/apps-crypto-kyc" },
          ],
        },
        {
          id: "invoices",
          label: "Invoices",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsInvoices(!isInvoices);
          },
          parentId: "apps",
          stateVariables: isInvoices,
          childItems: [
            { id: 1, label: "List View", link: "/apps-invoices-list" },
            { id: 2, label: "Details", link: "/apps-invoices-details" },
            { id: 3, label: "Create Invoice", link: "/apps-invoices-create" },
          ],
        },
        {
          id: "supportTickets",
          label: "Support Tickets",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsSupportTickets(!isSupportTickets);
          },
          parentId: "apps",
          stateVariables: isSupportTickets,
          childItems: [
            { id: 1, label: "List View", link: "/apps-tickets-list" },
            { id: 2, label: "Ticket Details", link: "/apps-tickets-details" },
          ],
        },
        {
          id: "NFTMarketplace",
          label: "NFT Marketplace",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsNFTMarketplace(!isNFTMarketplace);
          },
          parentId: "apps",
          stateVariables: isNFTMarketplace,
          childItems: [
            { id: 1, label: "Marketplace", link: "/apps-nft-marketplace" },
            { id: 2, label: "Explore Now", link: "/apps-nft-explore" },
            { id: 3, label: "Live Auction", link: "/apps-nft-auction" },
            { id: 4, label: "Item Details", link: "/apps-nft-item-details" },
            { id: 5, label: "Collections", link: "/apps-nft-collections" },
            { id: 6, label: "Creators", link: "/apps-nft-creators" },
            { id: 7, label: "Ranking", link: "/apps-nft-ranking" },
            { id: 8, label: "Wallet Connect", link: "/apps-nft-wallet" },
            { id: 9, label: "Create NFT", link: "/apps-nft-create" },
          ],
        },
        {
          id: "filemanager",
          label: "File Manager",
          link: "/apps-file-manager",
          parentId: "apps",
        },
        {
          id: "todo",
          label: "To Do",
          link: "/apps-todo",
          parentId: "apps",
        },
        {
          id: "job",
          label: "Jobs",
          link: "/#",
          isChildItem: true,
          parentId: "apps",
          badgeName: "New",
          badgeColor: "success",
          click: function (e) {
            e.preventDefault();
            setIsJobs(!isJobs);
          },
          stateVariables: isJobs,
          childItems: [
            {
              id: 1,
              label: "Statistics",
              link: "/apps-job-statistics",
              parentId: "apps",
            },
            {
              id: 2,
              label: "Job Lists",
              link: "/#",
              parentId: "apps",
              isChildItem: true,
              stateVariables: isJobList,
              click: function (e) {
                e.preventDefault();
                setIsJobList(!isJobList);
              },
              childItems: [
                {
                  id: 1,
                  label: "List",
                  link: "/apps-job-lists",
                  parentId: "apps",
                },
                {
                  id: 2,
                  label: "Grid",
                  link: "/apps-job-grid-lists",
                  parentId: "apps",
                },
                {
                  id: 3,
                  label: "Overview",
                  link: "/apps-job-details",
                  parentId: "apps",
                },
              ],
            },
            {
              id: 3,
              label: "Candidate Lists",
              link: "/#",
              parentId: "apps",
              isChildItem: true,
              stateVariables: isCandidateList,
              click: function (e) {
                e.preventDefault();
                setIsCandidateList(!isCandidateList);
              },
              childItems: [
                {
                  id: 1,
                  label: "List View",
                  link: "/apps-job-candidate-lists",
                  parentId: "apps",
                },
                {
                  id: 2,
                  label: "Grid View",
                  link: "/apps-job-candidate-grid",
                  parentId: "apps",
                },
              ],
            },
            {
              id: 4,
              label: "Application",
              link: "/apps-job-application",
              parentId: "apps",
            },
            {
              id: 5,
              label: "New Job",
              link: "/apps-job-new",
              parentId: "apps",
            },
            {
              id: 6,
              label: "Companies List",
              link: "/apps-job-companies-lists",
              parentId: "apps",
            },
            {
              id: 7,
              label: "Job Categories",
              link: "/apps-job-categories",
              parentId: "apps",
            },
          ],
        },
        {
          id: "apikey",
          label: "API Key",
          link: "/apps-api-key",
          parentId: "apps",
          badgeName: "New",
          badgeColor: "success",
        },
      ],
    },
    {
      label: "Pages",
      isHeader: true,
    },
    {
      id: "authentication",
      label: "Authentication",
      icon: "lar la-user-circle",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsAuth(!isAuth);
        setIscurrentState("Auth");
        updateIconSidebar(e);
      },
      stateVariables: isAuth,
      subItems: [
        {
          id: "signIn",
          label: "Sign In",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsSignIn(!isSignIn);
          },
          parentId: "authentication",
          stateVariables: isSignIn,
          childItems: [
            { id: 1, label: "Basic", link: "/auth-signin-basic" },
            { id: 2, label: "Cover", link: "/auth-signin-cover" },
          ],
        },
        {
          id: "signUp",
          label: "Sign Up",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsSignUp(!isSignUp);
          },
          parentId: "authentication",
          stateVariables: isSignUp,
          childItems: [
            { id: 1, label: "Basic", link: "/auth-signup-basic" },
            { id: 2, label: "Cover", link: "/auth-signup-cover" },
          ],
        },
        {
          id: "passwordReset",
          label: "Password Reset",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsPasswordReset(!isPasswordReset);
          },
          parentId: "authentication",
          stateVariables: isPasswordReset,
          childItems: [
            { id: 1, label: "Basic", link: "/auth-pass-reset-basic" },
            { id: 2, label: "Cover", link: "/auth-pass-reset-cover" },
          ],
        },
        {
          id: "passwordCreate",
          label: "Password Create",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsPasswordCreate(!isPasswordCreate);
          },
          parentId: "authentication",
          stateVariables: isPasswordCreate,
          childItems: [
            { id: 1, label: "Basic", link: "/auth-pass-change-basic" },
            { id: 2, label: "Cover", link: "/auth-pass-change-cover" },
          ],
        },
        {
          id: "lockScreen",
          label: "Lock Screen",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsLockScreen(!isLockScreen);
          },
          parentId: "authentication",
          stateVariables: isLockScreen,
          childItems: [
            { id: 1, label: "Basic", link: "/auth-lockscreen-basic" },
            { id: 2, label: "Cover", link: "/auth-lockscreen-cover" },
          ],
        },
        {
          id: "logout",
          label: "Logout",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsLogout(!isLogout);
          },
          parentId: "authentication",
          stateVariables: isLogout,
          childItems: [
            { id: 1, label: "Basic", link: "/auth-logout-basic" },
            { id: 2, label: "Cover", link: "/auth-logout-cover" },
          ],
        },
        {
          id: "successMessage",
          label: "Success Message",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsSuccessMessage(!isSuccessMessage);
          },
          parentId: "authentication",
          stateVariables: isSuccessMessage,
          childItems: [
            { id: 1, label: "Basic", link: "/auth-success-msg-basic" },
            { id: 2, label: "Cover", link: "/auth-success-msg-cover" },
          ],
        },
        {
          id: "twoStepVerification",
          label: "Two Step Verification",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsVerification(!isVerification);
          },
          parentId: "authentication",
          stateVariables: isVerification,
          childItems: [
            { id: 1, label: "Basic", link: "/auth-twostep-basic" },
            { id: 2, label: "Cover", link: "/auth-twostep-cover" },
          ],
        },
        {
          id: "errors",
          label: "Errors",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsError(!isError);
          },
          parentId: "authentication",
          stateVariables: isError,
          childItems: [
            { id: 1, label: "404 Basic", link: "/auth-404-basic" },
            { id: 2, label: "404 Cover", link: "/auth-404-cover" },
            { id: 3, label: "404 Alt", link: "/auth-404-alt" },
            { id: 4, label: "500", link: "/auth-500" },
            { id: 5, label: "Offline Page", link: "/auth-offline" },
          ],
        },
      ],
    },
    {
      id: "pages",
      label: "Pages",
      icon: "las la-pager",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsPages(!isPages);
        setIscurrentState("Pages");
        updateIconSidebar(e);
      },
      stateVariables: isPages,
      subItems: [
        {
          id: "starter",
          label: "Starter",
          link: "/pages-starter",
          parentId: "pages",
        },
        {
          id: "profile",
          label: "Profile",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsProfile(!isProfile);
          },
          parentId: "pages",
          stateVariables: isProfile,
          childItems: [
            {
              id: 1,
              label: "Simple Page",
              link: "/pages-profile",
              parentId: "pages",
            },
            {
              id: 2,
              label: "Settings",
              link: "/pages-profile-settings",
              parentId: "pages",
            },
          ],
        },
        { id: "team", label: "Team", link: "/pages-team", parentId: "pages" },
        {
          id: "timeline",
          label: "Timeline",
          link: "/pages-timeline",
          parentId: "pages",
        },
        { id: "faqs", label: "FAQs", link: "/pages-faqs", parentId: "pages" },
        {
          id: "pricing",
          label: "Pricing",
          link: "/pages-pricing",
          parentId: "pages",
        },
        {
          id: "gallery",
          label: "Gallery",
          link: "/pages-gallery",
          parentId: "pages",
        },
        {
          id: "maintenance",
          label: "Maintenance",
          link: "/pages-maintenance",
          parentId: "pages",
        },
        {
          id: "comingSoon",
          label: "Coming Soon",
          link: "/pages-coming-soon",
          parentId: "pages",
        },
        {
          id: "sitemap",
          label: "Sitemap",
          link: "/pages-sitemap",
          parentId: "pages",
        },
        {
          id: "searchResults",
          label: "Search Results",
          link: "/pages-search-results",
          parentId: "pages",
        },
        {
          id: "PrivecyPolicy",
          label: "Privecy Policy",
          link: "/pages-privecy-policy",
          parentId: "pages",
          badgeName: "New",
          badgeColor: "success",
        },
        {
          id: "TermsCondition",
          label: "Terms Condition",
          link: "/pages-terms-condition",
          parentId: "pages",
          badgeName: "New",
          badgeColor: "success",
        },
      ],
    },
    {
      id: "landing",
      label: "Landing",
      icon: "ri-rocket-line",
      link: "/#",
      stateVariables: isLanding,
      click: function (e) {
        e.preventDefault();
        setIsLanding(!isLanding);
        setIscurrentState("Landing");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "onePage",
          label: "One Page",
          link: "/landing",
          parentId: "landing",
        },
        {
          id: "nftLanding",
          label: "NFT Landing",
          link: "/nft-landing",
          parentId: "landing",
        },
        {
          id: "jobLanding",
          label: "Job",
          link: "/job-landing",
          parentId: "landing",
          badgeName: "New",
          badgeColor: "success",
        },
      ],
    },
    {
      label: "Components",
      isHeader: true,
    },
    {
      id: "baseUi",
      label: "Base UI",
      icon: "las la-pencil-ruler",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsBaseUi(!isBaseUi);
        setIscurrentState("BaseUi");
        updateIconSidebar(e);
      },
      stateVariables: isBaseUi,
      subItems: [
        {
          id: "alerts",
          label: "Alerts",
          link: "/ui-alerts",
          parentId: "baseUi",
        },
        {
          id: "badges",
          label: "Badges",
          link: "/ui-badges",
          parentId: "baseUi",
        },
        {
          id: "buttons",
          label: "Buttons",
          link: "/ui-buttons",
          parentId: "baseUi",
        },
        {
          id: "colors",
          label: "Colors",
          link: "/ui-colors",
          parentId: "baseUi",
        },
        { id: "cards", label: "Cards", link: "/ui-cards", parentId: "baseUi" },
        {
          id: "carousel",
          label: "Carousel",
          link: "/ui-carousel",
          parentId: "baseUi",
        },
        {
          id: "dropdowns",
          label: "Dropdowns",
          link: "/ui-dropdowns",
          parentId: "baseUi",
        },
        { id: "grid", label: "Grid", link: "/ui-grid", parentId: "baseUi" },
        {
          id: "images",
          label: "Images",
          link: "/ui-images",
          parentId: "baseUi",
        },
        { id: "tabs", label: "Tabs", link: "/ui-tabs", parentId: "baseUi" },
        {
          id: "accordions",
          label: "Accordion & Collapse",
          link: "/ui-accordions",
          parentId: "baseUi",
        },
        {
          id: "modals",
          label: "Modals",
          link: "/ui-modals",
          parentId: "baseUi",
        },
        {
          id: "offcanvas",
          label: "Offcanvas",
          link: "/ui-offcanvas",
          parentId: "baseUi",
        },
        {
          id: "placeholders",
          label: "Placeholders",
          link: "/ui-placeholders",
          parentId: "baseUi",
        },
        {
          id: "progress",
          label: "Progress",
          link: "/ui-progress",
          parentId: "baseUi",
        },
        {
          id: "notifications",
          label: "Notifications",
          link: "/ui-notifications",
          parentId: "baseUi",
        },
        {
          id: "media",
          label: "Media object",
          link: "/ui-media",
          parentId: "baseUi",
        },
        {
          id: "embedvideo",
          label: "Embed Video",
          link: "/ui-embed-video",
          parentId: "baseUi",
        },
        {
          id: "typography",
          label: "Typography",
          link: "/ui-typography",
          parentId: "baseUi",
        },
        { id: "lists", label: "Lists", link: "/ui-lists", parentId: "baseUi" },
        {
          id: "general",
          label: "General",
          link: "/ui-general",
          parentId: "baseUi",
        },
        {
          id: "ribbons",
          label: "Ribbons",
          link: "/ui-ribbons",
          parentId: "baseUi",
        },
        {
          id: "utilities",
          label: "Utilities",
          link: "/ui-utilities",
          parentId: "baseUi",
        },
      ],
    },
    {
      id: "advanceUi",
      label: "Advance UI",
      icon: "las la-briefcase",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsAdvanceUi(!isAdvanceUi);
        setIscurrentState("AdvanceUi");
        updateIconSidebar(e);
      },
      stateVariables: isAdvanceUi,
      subItems: [
        {
          id: "nestablelist",
          label: "Nestable List",
          link: "/advance-ui-nestable",
          parentId: "advanceUi",
        },
        {
          id: "scrollbar",
          label: "Scrollbar",
          link: "/advance-ui-scrollbar",
          parentId: "advanceUi",
        },
        {
          id: "animation",
          label: "Animation",
          link: "/advance-ui-animation",
          parentId: "advanceUi",
        },
        {
          id: "tour",
          label: "Tour",
          link: "/advance-ui-tour",
          parentId: "advanceUi",
        },
        {
          id: "swiperslider",
          label: "Swiper Slider",
          link: "/advance-ui-swiper",
          parentId: "advanceUi",
        },
        {
          id: "ratings",
          label: "Ratings",
          link: "/advance-ui-ratings",
          parentId: "advanceUi",
        },
        {
          id: "highlight",
          label: "Highlight",
          link: "/advance-ui-highlight",
          parentId: "advanceUi",
        },
      ],
    },
    {
      id: "widgets",
      label: "Widgets",
      icon: "las la-flask",
      link: "/widgets",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Widgets");
      },
    },
    // {
    //   id: "forms",
    //   label: "Forms",
    //   icon: "lar la-newspaper",
    //   role: ["superAdmin", "forms"],
    //   link: "/#",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsForms(!isForms);
    //     setIscurrentState("Forms");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isForms,
    //   subItems: [
    //     {
    //       id: "basicelements",
    //       label: "Basic Elements",
    //       link: "/forms-elements",
    //       role: ["superAdmin", "forms"],
    //       parentId: "forms",
    //     },
    //     {
    //       id: "formselect",
    //       label: "Form Select",
    //       link: "/forms-select",
    //       role: ["superAdmin", "forms"],
    //       parentId: "forms",
    //     },
    //     {
    //       id: "checkboxsradios",
    //       label: "Checkboxs & Radios",
    //       link: "/forms-checkboxes-radios",
    //       role: ["superAdmin", "forms"],
    //       parentId: "forms",
    //     },
    //     {
    //       id: "pickers",
    //       label: "Pickers",
    //       link: "/forms-pickers",
    //       role: ["superAdmin", "forms"],
    //       parentId: "forms",
    //     },
    //     {
    //       id: "inputmasks",
    //       label: "Input Masks",
    //       role: ["superAdmin", "forms"],
    //       link: "/forms-masks",
    //       parentId: "forms",
    //     },
    //     {
    //       id: "advanced",
    //       label: "Advanced",
    //       link: "/forms-advanced",
    //       parentId: "forms",
    //       role: ["superAdmin", "forms"],
    //     },
    //     {
    //       id: "rangeslider",
    //       label: "Range Slider",
    //       link: "/forms-range-sliders",
    //       parentId: "forms",
    //       role: ["superAdmin", "forms"],
    //     },
    //     {
    //       id: "validation",
    //       label: "Validation",
    //       link: "/forms-validation",
    //       role: ["superAdmin", "forms"],
    //       parentId: "forms",
    //     },
    //     {
    //       id: "wizard",
    //       label: "Wizard",
    //       link: "/forms-wizard",
    //       role: ["superAdmin", "forms"],
    //       parentId: "forms",
    //     },
    //     {
    //       id: "editors",
    //       label: "Editors",
    //       link: "/forms-editors",
    //       role: ["superAdmin", "forms"],
    //       parentId: "forms",
    //     },
    //     {
    //       id: "fileuploads",
    //       label: "File Uploads",
    //       link: "/forms-file-uploads",
    //       role: ["superAdmin", "forms"],
    //       parentId: "forms",
    //     },
    //     {
    //       id: "formlayouts",
    //       label: "Form Layouts",
    //       link: "/forms-layouts",
    //       role: ["superAdmin", "forms"],
    //       parentId: "forms",
    //     },
    //     {
    //       id: "select2",
    //       label: "Select2",
    //       link: "/forms-select2",
    //       role: ["superAdmin", "forms"],
    //       parentId: "forms",
    //     },
    //   ],
    // },
    {
      id: "tables",
      label: "Tables",
      icon: "las la-table",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsTables(!isTables);
        setIscurrentState("Tables");
        updateIconSidebar(e);
      },
      stateVariables: isTables,
      subItems: [
        {
          id: "basictables",
          label: "Basic Tables",
          link: "/tables-basic",
          parentId: "tables",
        },
        {
          id: "gridjs",
          label: "Grid Js",
          link: "/tables-gridjs",
          parentId: "tables",
        },
        {
          id: "listjs",
          label: "List Js",
          link: "/tables-listjs",
          parentId: "tables",
        },
        {
          id: "datatables",
          label: "Datatables",
          link: "/tables-datatables",
          parentId: "tables",
        },
        {
          id: "reactdatatables",
          label: "React Datatables",
          link: "/tables-react",
          parentId: "tables",
        },
      ],
    },
    {
      id: "charts",
      label: "Charts",
      icon: "las la-chart-pie",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsCharts(!isCharts);
        setIscurrentState("Charts");
        updateIconSidebar(e);
      },
      stateVariables: isCharts,
      subItems: [
        {
          id: "apexcharts",
          label: "Apexcharts",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsApex(!isApex);
          },
          stateVariables: isApex,
          childItems: [
            { id: 1, label: "Line", link: "/charts-apex-line" },
            { id: 2, label: "Area", link: "/charts-apex-area" },
            { id: 3, label: "Column", link: "/charts-apex-column" },
            { id: 4, label: "Bar", link: "/charts-apex-bar" },
            { id: 5, label: "Mixed", link: "/charts-apex-mixed" },
            { id: 6, label: "Timeline", link: "/charts-apex-timeline" },
            { id: 7, label: "Candlstick", link: "/charts-apex-candlestick" },
            { id: 8, label: "Boxplot", link: "/charts-apex-boxplot" },
            { id: 9, label: "Bubble", link: "/charts-apex-bubble" },
            { id: 10, label: "Scatter", link: "/charts-apex-scatter" },
            { id: 11, label: "Heatmap", link: "/charts-apex-heatmap" },
            { id: 12, label: "Treemap", link: "/charts-apex-treemap" },
            { id: 13, label: "Pie", link: "/charts-apex-pie" },
            { id: 14, label: "Radialbar", link: "/charts-apex-radialbar" },
            { id: 15, label: "Radar", link: "/charts-apex-radar" },
            { id: 16, label: "Polar Area", link: "/charts-apex-polar" },
          ],
        },
        {
          id: "chartjs",
          label: "Chartjs",
          link: "/charts-chartjs",
          parentId: "charts",
        },
        {
          id: "echarts",
          label: "Echarts",
          link: "/charts-echarts",
          parentId: "charts",
        },
      ],
    },
    {
      id: "icons",
      label: "Icons",
      icon: "lab la-fonticons",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsIcons(!isIcons);
        setIscurrentState("Icons");
        updateIconSidebar(e);
      },
      stateVariables: isIcons,
      subItems: [
        {
          id: "remix",
          label: "Remix",
          link: "/icons-remix",
          parentId: "icons",
        },
        {
          id: "boxicons",
          label: "Boxicons",
          link: "/icons-boxicons",
          parentId: "icons",
        },
        {
          id: "materialdesign",
          label: "Material Design",
          link: "/icons-materialdesign",
          parentId: "icons",
        },
        {
          id: "lineawesome",
          label: "Line Awesome",
          link: "/icons-lineawesome",
          parentId: "icons",
        },
        {
          id: "feather",
          label: "Feather",
          link: "/icons-feather",
          parentId: "icons",
        },
        {
          id: "crypto",
          label: "Crypto SVG",
          link: "/icons-crypto",
          parentId: "icons",
        },
      ],
    },
    {
      id: "maps",
      label: "Maps",
      icon: "las la-map",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsMaps(!isMaps);
        setIscurrentState("Maps");
        updateIconSidebar(e);
      },
      stateVariables: isMaps,
      subItems: [
        {
          id: "google",
          label: "Google",
          link: "/maps-google",
          parentId: "maps",
        },
        {
          id: "vector",
          label: "Vector",
          link: "/maps-vector",
          parentId: "maps",
        },
        {
          id: "leaflet",
          label: "Leaflet",
          link: "/maps-leaflet",
          parentId: "maps",
        },
      ],
    },
    {
      id: "multilevel",
      label: "Multi Level",
      icon: "las la-folder-plus",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsMultiLevel(!isMultiLevel);
        setIscurrentState("MuliLevel");
        updateIconSidebar(e);
      },
      stateVariables: isMultiLevel,
      subItems: [
        {
          id: "level1.1",
          label: "Level 1.1",
          link: "/#",
          parentId: "multilevel",
        },
        {
          id: "level1.2",
          label: "Level 1.2",
          link: "/#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsLevel1(!isLevel1);
          },
          stateVariables: isLevel1,
          childItems: [
            { id: 1, label: "Level 2.1", link: "/#" },
            {
              id: "level2.2",
              label: "Level 2.2",
              link: "/#",
              isChildItem: true,
              click: function (e) {
                e.preventDefault();
                setIsLevel2(!isLevel2);
              },
              stateVariables: isLevel2,
              childItems: [
                { id: 1, label: "Level 3.1", link: "/#" },
                { id: 2, label: "Level 3.2", link: "/#" },
              ],
            },
          ],
        },
      ],
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
