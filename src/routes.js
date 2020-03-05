import Dashboard from "./views/Dashboard.jsx";
import Upload from "./views/Upload.jsx";
import TableList from "./views/TableList.jsx";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/upload",
    name: "upload",
    icon: "pe-7s-cloud-upload",
    component: Upload,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "table",
    icon: "pe-7s-note2",
    component: TableList,
    layout: "/admin"
  }
];

export default dashboardRoutes;
