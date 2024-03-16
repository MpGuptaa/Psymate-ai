import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardAnalytics from "../pages/DashboardAnalytics";
import DashboardCrm from "../pages/DashboardCrm";
import DashboardEcommerce from "../pages/DashboardEcommerce";
import DashboardJobs from "../pages/DashboardJob";
import DashboardClinic from "../pages/DashboardClinic";
import DashboardCrypto from "../pages/DashboardCrypto";
import DashboardProject from "../pages/DashboardProject";
import DashboardNFT from "../pages/DashboardNFT";

//Calendar
// Email box
import MailInbox from "../pages/EmailInbox";
import BasicAction from "../pages/Email/EmailTemplates/BasicAction";
import EcommerceAction from "../pages/Email/EmailTemplates/EcommerceAction";

//Chat
import Chat from "../pages/Chat";
import Calendar from "../pages/Calendar";
import MultipleAppointments from "../pages/Calendar/MultipleAppointments";

// Project
import ProjectList from "../pages/Projects/ProjectList";
import ProjectOverview from "../pages/Projects/ProjectOverview";
import CreateProject from "../pages/Projects/CreateProject";

//Task
import TaskDetails from "../pages/Tasks/TaskDetails";
import TaskList from "../pages/Tasks/TaskList";

//Transactions
import Transactions from "../pages/Crypto/Transactions";
import BuySell from "../pages/Crypto/BuySell";
import CryproOrder from "../pages/Crypto/CryptoOrder";
import MyWallet from "../pages/Crypto/MyWallet";
import ICOList from "../pages/Crypto/ICOList";
import KYCVerification from "../pages/Crypto/KYCVerification";

//Crm Pages
import CrmCompanies from "../pages/Crm/CrmCompanies";
import CrmContacts from "../pages/Crm/CrmContacts";
import CrmDeals from "../pages/Crm/CrmDeals/index";
import CrmLeads from "../pages/Crm/CrmLeads/index";
import CrmDetails from "../pages/Crm/CrmDetails";

//Invoices
import InvoiceList from "../pages/Invoices/InvoiceList";
import InvoiceCreate from "../pages/Invoices/InvoiceCreate";
import InvoiceDetails from "../pages/Invoices/InvoiceDetails";

// Support Tickets
import ListView from "../pages/SupportTickets/ListView";
import TicketsDetails from "../pages/SupportTickets/TicketsDetails";

// //Ecommerce Pages
import EcommerceProducts from "../pages/Ecommerce/EcommerceProducts/index";
import EcommerceProductDetail from "../pages/Ecommerce/EcommerceProducts/EcommerceProductDetail";
import EcommerceAddProduct from "../pages/Ecommerce/EcommerceProducts/EcommerceAddProduct";
import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index";
import EcommerceOrderDetail from "../pages/Ecommerce/EcommerceOrders/EcommerceOrderDetail";
import EcommerceCustomers from "../pages/Ecommerce/EcommerceCustomers/index";
import EcommerceCart from "../pages/Ecommerce/EcommerceCart";
import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";
import EcommerceManufacturers from "../pages/Ecommerce/EcommerceManufacturers/index";
import EcommerceManufacturerDetail from "../pages/Ecommerce/EcommerceManufacturers/EcommerceManufacturerDetail";

// NFT Marketplace Pages
import Marketplace from "../pages/NFTMarketplace/Marketplace";
import Collections from "../pages/NFTMarketplace/Collections";
import CreateNFT from "../pages/NFTMarketplace/CreateNFT";
import Creators from "../pages/NFTMarketplace/Creators";
import ExploreNow from "../pages/NFTMarketplace/ExploreNow";
import ItemDetails from "../pages/NFTMarketplace/Itemdetails";
import LiveAuction from "../pages/NFTMarketplace/LiveAuction";
import Ranking from "../pages/NFTMarketplace/Ranking";
import WalletConnect from "../pages/NFTMarketplace/WalletConnect";

// Base Ui
import UiAlerts from "../pages/BaseUi/UiAlerts/UiAlerts";
import UiBadges from "../pages/BaseUi/UiBadges/UiBadges";
import UiButtons from "../pages/BaseUi/UiButtons/UiButtons";
import UiColors from "../pages/BaseUi/UiColors/UiColors";
import UiCards from "../pages/BaseUi/UiCards/UiCards";
import UiCarousel from "../pages/BaseUi/UiCarousel/UiCarousel";
import UiDropdowns from "../pages/BaseUi/UiDropdowns/UiDropdowns";
import UiGrid from "../pages/BaseUi/UiGrid/UiGrid";
import UiImages from "../pages/BaseUi/UiImages/UiImages";
import UiTabs from "../pages/BaseUi/UiTabs/UiTabs";
import UiAccordions from "../pages/BaseUi/UiAccordion&Collapse/UiAccordion&Collapse";
import UiModals from "../pages/BaseUi/UiModals/UiModals";
import UiOffcanvas from "../pages/BaseUi/UiOffcanvas/UiOffcanvas";
import UiPlaceholders from "../pages/BaseUi/UiPlaceholders/UiPlaceholders";
import UiProgress from "../pages/BaseUi/UiProgress/UiProgress";
import UiNotifications from "../pages/BaseUi/UiNotifications/UiNotifications";
import UiMediaobject from "../pages/BaseUi/UiMediaobject/UiMediaobject";
import UiEmbedVideo from "../pages/BaseUi/UiEmbedVideo/UiEmbedVideo";
import UiTypography from "../pages/BaseUi/UiTypography/UiTypography";
import UiList from "../pages/BaseUi/UiLists/UiLists";
import UiGeneral from "../pages/BaseUi/UiGeneral/UiGeneral";
import UiRibbons from "../pages/BaseUi/UiRibbons/UiRibbons";
import UiUtilities from "../pages/BaseUi/UiUtilities/UiUtilities";

// Advance Ui
import UiNestableList from "../pages/AdvanceUi/UiNestableList/UiNestableList";
import UiScrollbar from "../pages/AdvanceUi/UiScrollbar/UiScrollbar";
import UiAnimation from "../pages/AdvanceUi/UiAnimation/UiAnimation";
import UiTour from "../pages/AdvanceUi/UiTour/UiTour";
import UiSwiperSlider from "../pages/AdvanceUi/UiSwiperSlider/UiSwiperSlider";
import UiRatings from "../pages/AdvanceUi/UiRatings/UiRatings";
import UiHighlight from "../pages/AdvanceUi/UiHighlight/UiHighlight";

// Widgets
import Widgets from "../pages/Widgets/Index";

//Forms
import BasicElements from "../pages/Forms/BasicElements/BasicElements";
import FormSelect from "../pages/Forms/FormSelect/FormSelect";
import FormEditor from "../pages/Forms/FormEditor/FormEditor";
import CheckBoxAndRadio from "../pages/Forms/CheckboxAndRadio/CheckBoxAndRadio";
import Masks from "../pages/Forms/Masks/Masks";
import FileUpload from "../pages/Forms/FileUpload/FileUpload";
import FormPickers from "../pages/Forms/FormPickers/FormPickers";
import FormRangeSlider from "../pages/Forms/FormRangeSlider/FormRangeSlider";
import Formlayouts from "../pages/Forms/FormLayouts/Formlayouts";
import FormValidation from "../pages/Forms/FormValidation/FormValidation";
import FormWizard from "../pages/Forms/FormWizard/FormWizard";
import FormAdvanced from "../pages/Forms/FormAdvanced/FormAdvanced";
import Select2 from "../pages/Forms/Select2/Select2";

//Tables
import BasicTables from "../pages/Tables/BasicTables/BasicTables";
import GridTables from "../pages/Tables/GridTables/GridTables";
import ListTables from "../pages/Tables/ListTables/ListTables";
import DataTables from "../pages/Tables/DataTables/DataTables";
import ReactTable from "../pages/Tables/ReactTable";

//Icon pages
import RemixIcons from "../pages/Icons/RemixIcons/RemixIcons";
import BoxIcons from "../pages/Icons/BoxIcons/BoxIcons";
import MaterialDesign from "../pages/Icons/MaterialDesign/MaterialDesign";
import FeatherIcons from "../pages/Icons/FeatherIcons/FeatherIcons";
import LineAwesomeIcons from "../pages/Icons/LineAwesomeIcons/LineAwesomeIcons";
import CryptoIcons from "../pages/Icons/CryptoIcons/CryptoIcons";

//Maps
import GoogleMaps from "../pages/Maps/GoogleMaps/GoogleMaps";
import VectorMaps from "../pages/Maps/VectorMaps/VectorMaps";
import LeafletMaps from "../pages/Maps/LeafletMaps/LeafletMaps";

//AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";
import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";

//pages
import Starter from "../pages/Pages/Starter/Starter";
import SimplePage from "../pages/Pages/Profile/SimplePage/SimplePage";
import Settings from "../pages/Pages/Profile/Settings/Settings";
import Team from "../pages/Pages/Team/Team";
import Timeline from "../pages/Pages/Timeline/Timeline";
import Faqs from "../pages/Pages/Faqs/Faqs";
import Pricing from "../pages/Pages/Pricing/Pricing";
import Gallery from "../pages/Pages/Gallery/Gallery";
import Maintenance from "../pages/Pages/Maintenance/Maintenance";
import ComingSoon from "../pages/Pages/ComingSoon/ComingSoon";
import SiteMap from "../pages/Pages/SiteMap/SiteMap";
import SearchResults from "../pages/Pages/SearchResults/SearchResults";
import PrivecyPolicy from "../pages/Pages/PrivacyPolicy.js";
import TermsCondition from "../pages/Pages/TermsCondition";

import CoverPasswReset from "../pages/AuthenticationInner/PasswordReset/CoverPasswReset";
import BasicLockScreen from "../pages/AuthenticationInner/LockScreen/BasicLockScr";
import CoverLockScreen from "../pages/AuthenticationInner/LockScreen/CoverLockScr";
import BasicLogout from "../pages/AuthenticationInner/Logout/BasicLogout";
import CoverLogout from "../pages/AuthenticationInner/Logout/CoverLogout";
import BasicSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
import CoverSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg";
import BasicTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
import CoverTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify";
import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

//Charts
import LineCharts from "../pages/Charts/ApexCharts/LineCharts";
import AreaCharts from "../pages/Charts/ApexCharts/AreaCharts";
import ColumnCharts from "../pages/Charts/ApexCharts/ColumnCharts";
import BarCharts from "../pages/Charts/ApexCharts/BarCharts";
import MixedCharts from "../pages/Charts/ApexCharts/MixedCharts";
import TimelineCharts from "../pages/Charts/ApexCharts/TimelineCharts";
import CandlestickChart from "../pages/Charts/ApexCharts/CandlestickChart";
import BoxplotCharts from "../pages/Charts/ApexCharts/BoxplotCharts";
import BubbleChart from "../pages/Charts/ApexCharts/BubbleChart";
import ScatterCharts from "../pages/Charts/ApexCharts/ScatterCharts";
import HeatmapCharts from "../pages/Charts/ApexCharts/HeatmapCharts";
import TreemapCharts from "../pages/Charts/ApexCharts/TreemapCharts";
import PieCharts from "../pages/Charts/ApexCharts/PieCharts";
import RadialbarCharts from "../pages/Charts/ApexCharts/RadialbarCharts";
import RadarCharts from "../pages/Charts/ApexCharts/RadarCharts";
import PolarCharts from "../pages/Charts/ApexCharts/PolarCharts";

import ChartsJs from "../pages/Charts/ChartsJs/index";
import Echarts from "../pages/Charts/ECharts/index";

//Job pages
import Statistics from "../pages/Jobs/Statistics";
import JobList from "../pages/Jobs/JobList/List";
import JobGrid from "../pages/Jobs/JobList/Grid";
import JobOverview from "../pages/Jobs/JobList/Overview";
import CandidateList from "../pages/Jobs/CandidateList/ListView";
import CandidateGrid from "../pages/Jobs/CandidateList/GridView";
import NewJobs from "../pages/Jobs/NewJob";
import JobCategories from "../pages/Jobs/JobCategories";
import Application from "../pages/Jobs/Application";
import CompaniesList from "../pages/Jobs/CompaniesList";

import ApiKey from "../pages/APIKey/index";

// Landing Index
import OnePage from "../pages/Landing/OnePage";
import NFTLanding from "../pages/Landing/NFTLanding";
import JobLanding from "../pages/Landing/Job";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";

import FileManager from "../pages/FileManager";
import ToDoList from "../pages/ToDo";
import PrescriptionList from "../pages/Prescriptions/PrescriptionList";
import PrescriptionDetails from "../pages/Prescriptions/PrescriptionDetails";
import FormBuilder from "../pages/Forms/Builder";

// External Apps
import ExotelList from "../pages/ExternalApps/ExotelList";
import ManageCollections from "../pages/Ecommerce/EcommerceManufacturers/index";
import AcademyAddCourse from "../pages/Academy/EcommerceProducts/AcademyAddCourse";
import AcademyCourses from "../pages/Academy/EcommerceProducts";
import NewAddCourse from "../pages/Academy/EcommerceProducts/NewAddCourse.js";
import EcommerceAddSalt from "../pages/Ecommerce/EcommerceSalt/EcommerceAddSalt";
import EcommerceSaltDetail from "../pages/Ecommerce/EcommerceSalt/EcommerceSaltDetail.js";
import EcommerceSalts from "../pages/Ecommerce/EcommerceSalt/index.js";
import Article from "../pages/Times/Article/index.js";
import AddBlogs from "../pages/Times/Blogs/index.js";
import TeamDoc from "../pages/Pages/Team/TeamsDoc.js";
import Podcast from "../pages/Times/Podcasts/index.js";
import GetPodcast from "../pages/Times/Podcasts/getPodcast.js";
import VideoForm from "../pages/Times/video/videoForm.js";
import GetVideo from "../pages/Times/video/getVideo.js";
import AddArticle from "../pages/Times/AddArticle/index.js";
import GetBlogs from "../pages/Times/Blogs/getBlogs.js";
import AssessmentDetail from "../pages/Assessments/AssessmentsDetail.js";
import AddAssessment from "../pages/Assessments/AddAssessments.js";
import Assessments from "../pages/Assessments/index.js";
import TakeAssessment from "../pages/Pages/Profile/SimplePage/components/TakeAssessment.js";
import PersonalDetails from "../pages/PersonalDetails/index.js";
import Combo from "../pages/Prescriptions/Combo.js";
import TopTabsWithSubTags from "../pages/Layouts/TopTabsWithSubTags.js";
import AddData from "../pages/Data/AddData.js";
import Datas from "../pages/Data/index.js";
import TopTabs from "../pages/Layouts/TopTabs.js";
import RolesManagement from "../pages/Pages/RolesManagement/RolesManagement.js";


const authProtectedRoutes = [
  {
    exact: true,
    path: "/dashboard-analytics",
    component: <DashboardAnalytics />,
  },
  { exact: true, path: "/dashboard-crm", component: <DashboardCrm /> },
  { exact: true, path: "/dashboard", component: <DashboardEcommerce /> },
  { exact: true, path: "/index", component: <DashboardEcommerce /> },
  { exact: true, path: "/dashboard-clinic", component: <DashboardClinic /> },
  { exact: true, path: "/dashboard-crypto", component: <DashboardCrypto /> },
  { exact: true, path: "/dashboard-projects", component: <DashboardProject /> },
  { exact: true, path: "/dashboard-nft", component: <DashboardNFT /> },
  { exact: true, path: "/dashboard-job", component: <DashboardJobs /> },
  { exact: true, path: "/apps-calendar", component: <Calendar /> },
  { exact: true, path: "/multiple-appointments", component: <MultipleAppointments /> },
  { exact: true, path: "/crm-details", component: <CrmDetails /> },
  {
    exact: true,
    path: "/apps-ecommerce-products",
    component: <EcommerceProducts />,
  },
  {
    exact: false,
    path: "/apps-ecommerce-product-details",
    component: <EcommerceProductDetail />,
  },
  {
    exact: false,
    path: "/apps-ecommerce-add-product",
    component: <EcommerceAddProduct />,
  },
  {
    exact: true,
    path: "/apps-lab-assessments",
    component: <Assessments />,
  },
  {
    exact: false,
    path: "/apps-lab-assessment-details",
    component: <AssessmentDetail />,
  },
  {
    exact: false,
    path: "/apps-add",
    component: <AddAssessment />,
  },
  {
    exact: true,
    path: "/apps-ecommerce-salts",
    component: <EcommerceSalts />,
  },
  {
    exact: false,
    path: "/apps-ecommerce-salt-details",
    component: <EcommerceSaltDetail />,
  },
  {
    exact: false,
    path: "/apps-ecommerce-add-salt",
    component: <EcommerceAddSalt />,
  },
  {
    exact: true,
    path: "/apps-academy-courses",
    component: <AcademyCourses />,
  },
  {
    exact: false,
    path: "/apps-academy-add-course",
    component: <AcademyAddCourse />,
  },
  {
    exact: false,
    path: "/data",
    component: <Datas />,
  },
  {
    exact: false,
    path: "/data/add",
    component: <AddData />,
  },
  {
    exact: false,
    path: "/teams-add-articles",
    component: <Article />,
  },
  {
    exact: false,
    path: "/teams-add-podcast",
    component: <Podcast />,
  },
  {
    exact: false,
    path: "/teams-podcast",
    component: <GetPodcast />,
  },
  {
    exact: false,
    path: "/teams-videos",
    component: <GetVideo />,
  },
  {
    exact: false,
    path: "/teams-add-video",
    component: <VideoForm />,
  },
  {
    exact: false,
    path: "/teams-blogs",
    component: <GetBlogs />,
  },
  {
    exact: false,
    path: "/teams-add-blogs",
    component: <AddBlogs />,
  },
  {
    exact: false,
    path: "/apps-new-academy-add-course",
    component: <NewAddCourse />,
  },
  {
    exact: false,
    path: "/apps-ecommerce-orders",
    component: <EcommerceOrders />,
  },
  {
    exact: false,
    path: "/apps-ecommerce-order-details",
    component: <EcommerceOrderDetail />,
  },
  {
    exact: true,
    path: "/apps-ecommerce-customers",
    component: <EcommerceCustomers />,
  },
  { exact: true, path: "/apps-ecommerce-cart", component: <EcommerceCart /> },
  {
    exact: true,
    path: "/apps-ecommerce-checkout",
    component: <EcommerceCheckout />,
  },
  {
    exact: true,
    path: "/feeds",
    component: <EcommerceManufacturers />,
  },
  {
    exact: true,
    path: "/disorders",
    component: <EcommerceManufacturers />,
  },
  {
    exact: true,
    path: "/assessments",
    component: <EcommerceManufacturers />,
  },
  {
    exact: true,
    path: "/manufacturers",
    component: <EcommerceManufacturers />,
  },
  {
    exact: true,
    path: "/generic",
    component: <EcommerceManufacturers />,
  },
  {
    exact: true,
    path: "/edit/manufacturers",
    component: <ManageCollections />,
  },
  {
    exact: true,
    path: "/organizations",
    component: <EcommerceManufacturers />,
  },
  {
    exact: true,
    path: "/establishments",
    component: <EcommerceManufacturers />,
  },
  {
    exact: true,
    path: "/apps-ecommerce-manufacturer-details",
    component: <EcommerceManufacturerDetail />,
  },

  { exact: true, path: "/apps-file-manager", component: <FileManager /> },
  { exact: true, path: "/apps-todo", component: <ToDoList /> },

  //Chat
  { exact: true, path: "/apps-chat", component: <Chat /> },
  { exact: true, path: "/apps-chat/:id", component: <Chat /> },

  //EMail
  { exact: true, path: "/apps-mailbox", component: <MailInbox /> },
  { exact: true, path: "/apps-email-basic", component: <BasicAction /> },
  {
    exact: true,
    path: "/apps-email-ecommerce",
    component: <EcommerceAction />,
  },

  //Projects
  { exact: true, path: "/apps-projects-list", component: <ProjectList /> },

  { exact: true, path: "/layout/tabs/top/subtags", component: <TopTabsWithSubTags /> },
  { exact: true, path: "/layout/tabs/top", component: <TopTabs /> },

  {
    exact: true,
    path: "/apps-projects-overview",
    component: <ProjectOverview />,
  },
  { exact: true, path: "/apps-projects-create", component: <CreateProject /> },

  //Task
  { exact: true, path: "/apps-tasks-list-view", component: <TaskList /> },
  { exact: true, path: "/apps-tasks-details", component: <TaskDetails /> },

  //Crm
  { exact: true, path: "/apps-crm-contacts", component: <CrmContacts /> },
  { exact: true, path: "/apps-crm-companies", component: <CrmCompanies /> },
  { exact: true, path: "/apps-crm-deals", component: <CrmDeals /> },
  { exact: true, path: "/apps-crm-leads", component: <CrmLeads /> },

  //Invoices
  { exact: true, path: "/apps-invoices-list", component: <InvoiceList /> },
  {
    exact: true,
    path: "/apps-invoices-details",
    component: <InvoiceDetails />,
  },
  {
    exact: true,
    path: "/apps-invoices-create/",
    component: <InvoiceCreate />,
  },
  {
    exact: true,
    path: "/apps-invoices-create/:paramsId",
    component: <InvoiceCreate />,
  },
  //Prescriptions
  {
    exact: true,
    path: "/apps-prescriptions-list",
    component: <PrescriptionList />,
  },
  {
    exact: true,
    path: "/apps-prescriptions-details",
    component: <PrescriptionDetails />,
  },
  {
    exact: true,
    path: "/combo/create",
    component: <Combo />,
  },
  //Supports Tickets
  { exact: true, path: "/apps-tickets-list", component: <ListView /> },
  { exact: true, path: "/apps-tickets-details", component: <TicketsDetails /> },

  //transactions
  {
    exact: true,
    path: "/apps-crypto-transactions",
    component: <Transactions />,
  },
  { exact: true, path: "/apps-crypto-buy-sell", component: <BuySell /> },
  { exact: true, path: "/apps-crypto-orders", component: <CryproOrder /> },
  { exact: true, path: "/apps-crypto-wallet", component: <MyWallet /> },
  { exact: true, path: "/apps-crypto-ico", component: <ICOList /> },
  { exact: true, path: "/apps-crypto-kyc", component: <KYCVerification /> },

  // NFT Marketplace
  { exact: true, path: "/apps-nft-marketplace", component: <Marketplace /> },
  { exact: true, path: "/apps-nft-collections", component: <Collections /> },
  { exact: true, path: "/apps-nft-create", component: <CreateNFT /> },
  { exact: true, path: "/apps-nft-creators", component: <Creators /> },
  { exact: true, path: "/apps-nft-explore", component: <ExploreNow /> },
  { exact: true, path: "/apps-nft-item-details", component: <ItemDetails /> },
  { exact: true, path: "/apps-nft-auction", component: <LiveAuction /> },
  { exact: true, path: "/apps-nft-ranking", component: <Ranking /> },
  { exact: true, path: "/apps-nft-wallet", component: <WalletConnect /> },

  //charts
  { exact: true, path: "/charts-apex-line", component: <LineCharts /> },
  { exact: true, path: "/charts-apex-area", component: <AreaCharts /> },
  { exact: true, path: "/charts-apex-column", component: <ColumnCharts /> },
  { exact: true, path: "/charts-apex-bar", component: <BarCharts /> },
  { exact: true, path: "/charts-apex-mixed", component: <MixedCharts /> },
  { exact: true, path: "/charts-apex-timeline", component: <TimelineCharts /> },
  {
    exact: true,
    path: "/charts-apex-candlestick",
    component: <CandlestickChart />,
  },
  { exact: true, path: "/charts-apex-boxplot", component: <BoxplotCharts /> },
  { exact: true, path: "/charts-apex-bubble", component: <BubbleChart /> },
  { exact: true, path: "/charts-apex-scatter", component: <ScatterCharts /> },
  { exact: true, path: "/charts-apex-heatmap", component: <HeatmapCharts /> },
  { exact: true, path: "/charts-apex-treemap", component: <TreemapCharts /> },
  { exact: true, path: "/charts-apex-pie", component: <PieCharts /> },
  {
    exact: true,
    path: "/charts-apex-radialbar",
    component: <RadialbarCharts />,
  },
  { exact: true, path: "/charts-apex-radar", component: <RadarCharts /> },
  { exact: true, path: "/charts-apex-polar", component: <PolarCharts /> },

  { exact: true, path: "/charts-chartjs", component: <ChartsJs /> },
  { exact: true, path: "/charts-echarts", component: <Echarts /> },

  // Base Ui
  { exact: true, path: "/ui-alerts", component: <UiAlerts /> },
  { exact: true, path: "/ui-badges", component: <UiBadges /> },
  { exact: true, path: "/ui-buttons", component: <UiButtons /> },
  { exact: true, path: "/ui-colors", component: <UiColors /> },
  { exact: true, path: "/ui-cards", component: <UiCards /> },
  { exact: true, path: "/ui-carousel", component: <UiCarousel /> },
  { exact: true, path: "/ui-dropdowns", component: <UiDropdowns /> },
  { exact: true, path: "/ui-grid", component: <UiGrid /> },
  { exact: true, path: "/ui-images", component: <UiImages /> },
  { exact: true, path: "/ui-tabs", component: <UiTabs /> },
  { exact: true, path: "/ui-accordions", component: <UiAccordions /> },
  { exact: true, path: "/ui-modals", component: <UiModals /> },
  { exact: true, path: "/ui-offcanvas", component: <UiOffcanvas /> },
  { exact: true, path: "/ui-placeholders", component: <UiPlaceholders /> },
  { exact: true, path: "/ui-progress", component: <UiProgress /> },
  { exact: true, path: "/ui-notifications", component: <UiNotifications /> },
  { exact: true, path: "/ui-media", component: <UiMediaobject /> },
  { exact: true, path: "/ui-embed-video", component: <UiEmbedVideo /> },
  { exact: true, path: "/ui-typography", component: <UiTypography /> },
  { exact: true, path: "/ui-lists", component: <UiList /> },
  { exact: true, path: "/ui-general", component: <UiGeneral /> },
  { exact: true, path: "/ui-ribbons", component: <UiRibbons /> },
  { exact: true, path: "/ui-utilities", component: <UiUtilities /> },

  // Advance Ui
  { exact: true, path: "/advance-ui-nestable", component: <UiNestableList /> },
  { exact: true, path: "/advance-ui-scrollbar", component: <UiScrollbar /> },
  { exact: true, path: "/advance-ui-animation", component: <UiAnimation /> },
  { exact: true, path: "/advance-ui-tour", component: <UiTour /> },
  { exact: true, path: "/advance-ui-swiper", component: <UiSwiperSlider /> },
  { exact: true, path: "/advance-ui-ratings", component: <UiRatings /> },
  { exact: true, path: "/advance-ui-highlight", component: <UiHighlight /> },

  // Widgets
  { exact: true, path: "/widgets", component: <Widgets /> },

  // Forms
  { exact: true, path: "/form-builder", component: <FormBuilder /> },
  { exact: true, path: "/forms-elements", component: <BasicElements /> },
  { exact: true, path: "/forms-select", component: <FormSelect /> },
  { exact: true, path: "/forms-editors", component: <FormEditor /> },
  {
    exact: true,
    path: "/forms-checkboxes-radios",
    component: <CheckBoxAndRadio />,
  },
  { exact: true, path: "/forms-masks", component: <Masks /> },
  { exact: true, path: "/forms-file-uploads", component: <FileUpload /> },
  { exact: true, path: "/forms-pickers", component: <FormPickers /> },
  { exact: true, path: "/forms-range-sliders", component: <FormRangeSlider /> },
  { exact: true, path: "/forms-layouts", component: <Formlayouts /> },
  { exact: true, path: "/forms-validation", component: <FormValidation /> },
  { exact: true, path: "/forms-wizard", component: <FormWizard /> },
  { exact: true, path: "/forms-advanced", component: <FormAdvanced /> },
  { exact: true, path: "/forms-select2", component: <Select2 /> },

  //Tables
  { exact: true, path: "/tables-basic", component: <BasicTables /> },
  { exact: true, path: "/tables-gridjs", component: <GridTables /> },
  { exact: true, path: "/tables-listjs", component: <ListTables /> },
  { exact: true, path: "/exotel", component: <ExotelList /> },
  { exact: true, path: "/tables-datatables", component: <DataTables /> },
  { exact: true, path: "/tables-react", component: <ReactTable /> },

  //Icons
  { exact: true, path: "/icons-remix", component: <RemixIcons /> },
  { exact: true, path: "/icons-boxicons", component: <BoxIcons /> },
  { exact: true, path: "/icons-materialdesign", component: <MaterialDesign /> },
  { exact: true, path: "/icons-feather", component: <FeatherIcons /> },
  { exact: true, path: "/icons-lineawesome", component: <LineAwesomeIcons /> },
  { exact: true, path: "/icons-crypto", component: <CryptoIcons /> },

  //Maps
  { exact: true, path: "/maps-google", component: <GoogleMaps /> },
  { exact: true, path: "/maps-vector", component: <VectorMaps /> },
  { exact: true, path: "/maps-leaflet", component: <LeafletMaps /> },

  //Pages
  { exact: true, path: "/pages-starter", component: <Starter /> },
  { exact: true, path: "/pages-profile", component: <SimplePage /> },
  { exact: true, path: "/pages-profile-settings", component: <Settings /> },
  { exact: true, path: "/pages-team", component: <Team /> },
  { exact: true, path: "/pages-team-doc", component: <TeamDoc /> },
  { exact: true, path: "/pages-timeline", component: <Timeline /> },
  { exact: true, path: "/pages-faqs", component: <Faqs /> },
  { exact: true, path: "/pages-gallery", component: <Gallery /> },
  { exact: true, path: "/pages-pricing", component: <Pricing /> },
  { exact: true, path: "/pages-sitemap", component: <SiteMap /> },
  { exact: true, path: "/pages-search-results", component: <SearchResults /> },
  { exact: true, path: "/pages-privecy-policy", component: <PrivecyPolicy /> },
  { exact: true, path: "/roles-management", component: <RolesManagement /> },
  {
    exact: true,
    path: "/pages-terms-condition",
    component: <TermsCondition />,
  },

  //User Profile
  { exact: true, path: "/profile", component: <UserProfile /> },
  { exact: true, path: "/personal-details", component: <PersonalDetails /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    exact: true,
    path: "/",
    component: <Navigate to="/dashboard" />,
  },
  { exact: true, path: "*", component: <Navigate to="/dashboard" /> },

  //Job pages
  { exact: true, path: "/apps-job-statistics", component: <Statistics /> },
  { exact: true, path: "/apps-job-lists", component: <JobList /> },
  { exact: true, path: "/apps-job-grid-lists", component: <JobGrid /> },
  { exact: true, path: "/apps-job-details", component: <JobOverview /> },
  {
    exact: true,
    path: "/apps-job-candidate-lists",
    component: <CandidateList />,
  },
  {
    exact: true,
    path: "/apps-job-candidate-grid",
    component: <CandidateGrid />,
  },
  { exact: true, path: "/apps-job-application", component: <Application /> },
  { exact: true, path: "/apps-job-new", component: <NewJobs /> },
  {
    exact: true,
    path: "/apps-job-companies-lists",
    component: <CompaniesList />,
  },
  { exact: true, path: "/apps-job-categories", component: <JobCategories /> },

  //APIkey
  { exact: true, path: "/apps-api-key", component: <ApiKey /> },
];

const publicRoutes = [
  // Authentication Page
  { exact: true, path: "/logout", component: <Logout /> },
  { exact: true, path: "/login", component: <Login /> },
  { exact: true, path: "/forgot-password", component: <ForgetPasswordPage /> },
  { exact: true, path: "/register", component: <Register /> },

  //AuthenticationInner pages
  { exact: true, path: "/auth-signin-basic", component: <BasicSignIn /> },
  { exact: true, path: "/auth-signin-cover", component: <CoverSignIn /> },
  { exact: true, path: "/auth-signup-basic", component: <BasicSignUp /> },
  { exact: true, path: "/auth-signup-cover", component: <CoverSignUp /> },
  {
    exact: true,
    path: "/auth-pass-reset-basic",
    component: <BasicPasswReset />,
  },
  {
    exact: true,
    path: "/auth-pass-reset-cover",
    component: <CoverPasswReset />,
  },
  {
    exact: true,
    path: "/auth-lockscreen-basic",
    component: <BasicLockScreen />,
  },
  {
    exact: true,
    path: "/auth-lockscreen-cover",
    component: <CoverLockScreen />,
  },
  { exact: true, path: "/auth-logout-basic", component: <BasicLogout /> },
  { exact: true, path: "/auth-logout-cover", component: <CoverLogout /> },
  {
    exact: true,
    path: "/auth-success-msg-basic",
    component: <BasicSuccessMsg />,
  },
  {
    exact: true,
    path: "/auth-success-msg-cover",
    component: <CoverSuccessMsg />,
  },
  { exact: true, path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  { exact: true, path: "/auth-twostep-cover", component: <CoverTwosVerify /> },
  { exact: true, path: "/auth-404-basic", component: <Basic404 /> },
  { exact: true, path: "/auth-404-cover", component: <Cover404 /> },
  { exact: true, path: "/auth-404-alt", component: <Alt404 /> },
  { exact: true, path: "/auth-500", component: <Error500 /> },
  { exact: true, path: "/pages-maintenance", component: <Maintenance /> },
  { exact: true, path: "/pages-coming-soon", component: <ComingSoon /> },

  { exact: true, path: "/landing", component: <OnePage /> },
  { exact: true, path: "/nft-landing", component: <NFTLanding /> },
  { exact: true, path: "/job-landing", component: <JobLanding /> },
  { exact: true, path: "/take-assessment", component: <TakeAssessment /> },

  {
    exact: true,
    path: "/auth-pass-change-basic",
    component: <BasicPasswCreate />,
  },
  {
    exact: true,
    path: "/auth-pass-change-cover",
    component: <CoverPasswCreate />,
  },

  { exact: true, path: "/auth-offline", component: <Offlinepage /> },
];

export { authProtectedRoutes, publicRoutes };
