import Dashboard from "./views/Dashboard.jsx";
import Upload from "./views/Upload.jsx";
import TableList from "./views/TableList.jsx";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/upload",
    name: "Upload",
    icon: "pe-7s-cloud-upload",
    component: Upload,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Table",
    icon: "pe-7s-note2",
    component: TableList,
    layout: "/admin"
  }
];

export default dashboardRoutes;
